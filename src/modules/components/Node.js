import {
  PlaneBufferGeometry,
  CircleBufferGeometry,
  TextureLoader,
  CanvasTexture,
  MeshBasicMaterial,
  Mesh,
  Object3D,
  EdgesGeometry,
  Vector3,
  Vector2
} from 'three/build/three.module'
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js'
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'

class Node extends Object3D {
  constructor(data, config) {
    super()
    const { position, ...userData } = data
    this.selectedStatus = false
    this.userData = userData
    this.userId = data.id
    this.circlePaneMesh = null
    this.borderMesh = null
    this.imgMesh = null
    this.labelMesh = null
    this.name = 'circle'
    this.objectType = 'node'

    this.color = config.nodeColor
    this.activeColor = config.nodeActiveColor
    this.size = config.nodeSize
    this.borderSize = config.nodeBorderSize
    this.borderColor = config.nodeBorderColor || this.color
    this.activeBorderColor = config.nodeActiveBorderColor || this.activeColor
    this.fillColor = config.nodeFillColor
    this.fillActiveColor = config.nodeFillActiveColor || this.color
    this.labelColor = config.nodeLabelColor
    this.labelActiveColor = config.nodeLabelActiveColor
    this.labelFontSize = config.nodeLabelFontSize
    this.imgColor = config.nodeImgColor || this.color
    this.imgActiveColor = config.nodeImgActiveColor || this.activeColor

    if (position) {
      this.position.copy(new Vector3(position.x, position.y, position.z))
    }
    this.init()
  }
  get selected() {
    return this.selectedStatus
  }
  set selected(val) {
    this.selectedStatus = val
    if (val) {
      this.borderMesh.material.color.set(this.activeBorderColor)
      this.circlePaneMesh.material.color.set(this.fillActiveColor)
      this.imgMesh && this.imgMesh.material.color.set(this.imgActiveColor)
      this.labelMesh && this.labelMesh.material.color.set(this.labelActiveColor)
    } else {
      this.borderMesh.material.color.set(this.borderColor)
      this.circlePaneMesh.material.color.set(this.fillColor)
      this.imgMesh && this.imgMesh.material.color.set(this.imgColor)
      this.labelMesh && this.labelMesh.material.color.set(this.labelColor)
    }
  }
  init() {
    const { icon_url, label } = this.userData
    const bufferGeometry = new CircleBufferGeometry(this.size, 32)
    const backgroundMaterial = new MeshBasicMaterial({ color: this.fillColor })
    this.circlePaneMesh = new Mesh(bufferGeometry, backgroundMaterial)
    this.add(this.circlePaneMesh)
    this.borderMesh = this.circleBorder(bufferGeometry)
    this.add(this.borderMesh)

    if (icon_url) {
      this.imgMesh = this.img(bufferGeometry, icon_url)
      this.add(this.imgMesh)
    }
    if (label) {
      this.labelMesh = this.label(label)
      this.add(this.labelMesh)
    }
  }
  circleBorder(geometry) {
    const borderGeo = new EdgesGeometry( geometry )
    let fatBorderGeo = new LineSegmentsGeometry().setPositions(borderGeo.attributes.position.array)
    const lineMaterial = new LineMaterial( {
      color: this.borderColor,
      linewidth: this.borderSize,
      resolution: new Vector2(window.innerWidth, window.innerHeight)
    } )
    return new LineSegments2(fatBorderGeo, lineMaterial)
  }
  img (geometry, img_url) {
    const imgMaterial = new MeshBasicMaterial({map: new TextureLoader().load(img_url), transparent: true, color: this.imgColor})
    return new Mesh(geometry, imgMaterial)
  }
  label (labelText) {
    const labelCanvas = this.makeLabelCanvas(labelText)
    const labelGeometry = new PlaneBufferGeometry(1, 1)
    const texture = new CanvasTexture(labelCanvas)
    const labelMaterial = new MeshBasicMaterial({map: texture, transparent: true, color: this.labelColor})
    const label = new Mesh(labelGeometry, labelMaterial)
    label.position.y = - this.size * 1.5 //relative position of parent
    // if units are meters then 0.01 here makes size of the label into centimeters.
    const labelBaseScale = 0.01
    label.scale.x = labelCanvas.width  * labelBaseScale
    label.scale.y = labelCanvas.height * labelBaseScale
    return label
  }
  makeLabelCanvas(labelText) {
    const borderSize = 2
    const ctx = document.createElement('canvas').getContext('2d')
    const font =  `${this.labelFontSize}px bold sans-serif`
    ctx.font = font
    // measure how long the name will be
    const doubleBorderSize = borderSize * 2
    const width = ctx.measureText(labelText).width + doubleBorderSize
    const height = this.labelFontSize + doubleBorderSize
    ctx.canvas.width = width
    ctx.canvas.height = height

    // need to set font again after resizing canvas
    ctx.font = font
    ctx.textBaseline = 'top'

    ctx.fillStyle = '#ffffff'
    ctx.fillText(labelText, borderSize, borderSize)
    return ctx.canvas
  }
}

export { Node }