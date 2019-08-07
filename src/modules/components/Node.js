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
    this.iconMesh = null
    this.name = 'circle'
    this.objectType = 'node'

    this.color = userData.style && userData.style.color || config.nodeColor
    this.activeColor = userData.style && userData.style.activeColor || config.nodeActiveColor
    this.size = userData.style && userData.style.size || config.nodeSize
    this.borderSize = userData.style && userData.style.borderSize || config.nodeBorderSize
    this.borderColor = userData.style && userData.style.borderColor || this.color || config.nodeBorderColor
    this.activeBorderColor = userData.style && userData.style.activeBorderColor || this.activeColor || config.nodeActiveBorderColor
    this.fillColor = userData.style && userData.style.fillColor || config.nodeFillColor
    this.fillActiveColor = userData.style && userData.style.fillActiveColor || this.color || config.nodeFillActiveColor
    this.labelColor = userData.style && userData.style.labelColor || config.nodeLabelColor
    this.labelActiveColor = userData.style && userData.style.labelActiveColor || config.nodeLabelActiveColor
    this.labelFontSize = userData.style && userData.style.labelFontSize || config.nodeLabelFontSize
    this.labelFontFamily = userData.style && userData.style.labelFontFamily || config.nodeLabelFontFamily
    this.labelScale = userData.style && userData.style.labelScale || config.nodeLabelScale
    this.imgColor = userData.style && userData.style.imgColor || this.color || config.nodeImgColor
    this.imgActiveColor = userData.style && userData.style.imgActiveColor || this.activeColor || config.nodeImgActiveColor
    this.iconColor = userData.style && userData.style.iconColor || this.color || config.nodeIconColor
    this.iconActiveColor = userData.style && userData.style.iconActiveColor || this.activeColor || config.nodeIconAcitveColor

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
      this.iconMesh && this.iconMesh.material.color.set(this.iconActiveColor)
      this.imgMesh && this.imgMesh.material.color.set(this.imgActiveColor)
      this.labelMesh && this.labelMesh.material.color.set(this.labelActiveColor)
    } else {
      this.borderMesh.material.color.set(this.borderColor)
      this.circlePaneMesh.material.color.set(this.fillColor)
      this.iconMesh && this.iconMesh.material.color.set(this.iconColor)
      this.imgMesh && this.imgMesh.material.color.set(this.imgColor)
      this.labelMesh && this.labelMesh.material.color.set(this.labelColor)
    }
  }
  init() {
    const { icon, label, imgUrl } = this.userData
    const bufferGeometry = new CircleBufferGeometry(this.size, 32)
    const backgroundMaterial = new MeshBasicMaterial({ color: this.fillColor, transparent: true })
    this.circlePaneMesh = new Mesh(bufferGeometry, backgroundMaterial)
    this.add(this.circlePaneMesh)
    this.borderMesh = this.circleBorder(bufferGeometry)
    this.add(this.borderMesh)

    if (icon) {
      const { font, scale, content } = icon
      this.iconMesh = this.icon(bufferGeometry, font, scale, content)
      this.add(this.iconMesh)
    }
    if (imgUrl) {
      this.imgMesh = this.img(bufferGeometry, imgUrl)
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
      transparent: true,
      resolution: new Vector2(window.innerWidth, window.innerHeight)
    } )
    return new LineSegments2(fatBorderGeo, lineMaterial)
  }
  icon(bufferGeometry, font, scale = 1, content) {
    const iconCanvas = this.makeIconCanvas(font, content)
    const texture = new CanvasTexture(iconCanvas)
    const iconMaterial = new MeshBasicMaterial({map: texture, transparent: true, color: this.iconColor})
    const icon = new Mesh(bufferGeometry, iconMaterial)
    icon.scale.multiplyScalar(scale)
    return icon
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
    label.scale.x = labelCanvas.width  * this.labelScale
    label.scale.y = labelCanvas.height * this.labelScale
    return label
  }
  makeLabelCanvas(labelText) {
    const borderSize = 2
    const ctx = document.createElement('canvas').getContext('2d')
    const font =  `${this.labelFontSize}px ${this.labelFontFamily}`
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
  makeIconCanvas(font, content) {
    const ctx = document.createElement('canvas').getContext('2d')
    // canvas height and width with icon size to decide the resolution of iconfont
    // the larger canvas height, width, icon size, the higher resolution
    const iconfont = `64px ${font}`
    ctx.font = iconfont
    const width = 64
    const height = 64
    ctx.canvas.width = width
    ctx.canvas.height = height

    ctx.font = iconfont
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(content, 32, 32)

    return ctx.canvas
  }
  updateColor = ({fillColor, borderColor, iconColor, imgColor, labelColor}) => {
    this.circlePaneMesh.material.color.set(fillColor ? fillColor : this.selectedStatus ?  this.fillActiveColor : this.fillColor )
    this.borderMesh.material.color.set(borderColor ? borderColor : this.selectedStatus ? this.activeBorderColor : this.borderColor)
    this.iconMesh && this.iconMesh.material.color.set(iconColor ? iconColor : this.selectedStatus ? this.iconActiveColor : this.iconColor)
    this.imgMesh && this.imgMesh.material.color.set(imgColor ? imgColor : this.selectedStatus ? this.imgActiveColor : this.imgColor)
    this.labelMesh && this.labelMesh.material.color.set(labelColor ? labelColor : this.selectedStatus ? this.labelActiveColor : this.labelColor)
  }
  updatePosition = (position) => {
    this.position.copy(new Vector3(position.x, position.y, position.z))
  }
}

export { Node }