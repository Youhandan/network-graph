import {
  PlaneBufferGeometry,
  CircleBufferGeometry,
  TextureLoader,
  CanvasTexture,
  BoxHelper,
  MeshBasicMaterial,
  Mesh,
  Object3D,
  Vector3
} from 'three/build/three.module'

class Node extends Object3D {
  constructor(data, config) {
    super()
    const { position, ...userData } = data
    this.selectedStatus = false
    this.userData = userData
    this.userId = data.id
    this.circlePaneMesh = null
    this.selectedBoxMesh = null
    this.name = 'node'

    this.color = config.nodeColor
    this.size = config.nodeSize
    this.selectedBorderColor = config.nodeSelectedBorderColor
    this.labelColor = config.nodeLabelColor
    this.labelFontSize = config.nodeLabelFontSize

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
      this.add(this.selectedBoxMesh)
    } else {
      this.remove(this.selectedBoxMesh)
    }
  }
  init() {
    const { icon_url, label } = this.userData
    const bufferGeometry = new CircleBufferGeometry(this.size, 32)
    const backgroundMaterial = new MeshBasicMaterial({ color: this.color })
    this.circlePaneMesh = new Mesh(bufferGeometry, backgroundMaterial)
    this.add(this.circlePaneMesh)
    this.selectedBoxMesh = new BoxHelper(this.circlePaneMesh, this.selectedBorderColor)

    if (icon_url) this.add(this.imgMesh(bufferGeometry, icon_url))
    if (label) this.add(this.labelMesh(label))
  }
  imgMesh (geometry, img_url) {
    const imgMaterial = new MeshBasicMaterial({map: new TextureLoader().load(img_url), transparent: true})
    return new Mesh(geometry, imgMaterial)
  }
  labelMesh (labelText) {
    const labelCanvas = this.makeLabelCanvas(labelText)
    const labelGeometry = new PlaneBufferGeometry(1, 1)
    const texture = new CanvasTexture(labelCanvas)
    const labelMaterial = new MeshBasicMaterial({map: texture, transparent: true})
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

    ctx.fillStyle = this.labelColor
    ctx.fillText(labelText, borderSize, borderSize)
    return ctx.canvas
  }
}

export { Node }