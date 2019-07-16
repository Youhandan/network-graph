import {
  QuadraticBezierCurve3,
  Line,
  Vector3,
  LineBasicMaterial,
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Ray
} from 'three/build/three.module'

class CurveEdge extends Object3D {
  constructor (data, config) {
    super()
    const { sourcePos, targetPos, controlPointCenterOffset, visible, ...userData } = data
    this.visible = visible
    this.selectedStatus = false
    this.userId = data.id
    this.sourcePos = new Vector3(sourcePos.x, sourcePos.y, sourcePos.z)
    this.targetPos = new Vector3(targetPos.x, targetPos.y, targetPos.z)
    this.userData = userData
    this.name = 'curveEdge'
    this.curve = null
    this.arrow = null

    this.color = config.curveEdgeColor
    this.selectedColor = config.curveEdgeSelectedColor
    this.linewidth = config.curveEdgeLineWidth
    this.showArrow = config.curveEdgeArrow
    this.arrowWidth = config.curveEdgeArrowWidth
    this.arrowLength = config.curveEdgeArrowLength
    this.controlPointCenterOffset = controlPointCenterOffset || config.curveEdgeControlPointCenterOffset

    this.init()
  }
  get selected() {
    return this.selectedStatus
  }
  set selected(val) {
    this.selectedStatus = val
    if (val) {
      this.updateColor(this.selectedColor)
    } else {
      this.updateColor(this.color)
    }
  }
  get controlPoint () {
    const { sourcePos, targetPos } = this
    let controlPos = new Vector3()
    controlPos.subVectors(targetPos, sourcePos)
    const middlePoint = new Vector3((sourcePos.x + targetPos.x) / 2, (sourcePos.y + targetPos.y) / 2, (sourcePos.z + targetPos.z) / 2)
    controlPos.setLength(this.controlPointCenterOffset * sourcePos.distanceTo(targetPos) * 0.08)
    const axis = new Vector3().copy(targetPos).cross(sourcePos).normalize()
    controlPos.applyAxisAngle(axis, Math.PI / 2)
    controlPos.add(middlePoint)
    return controlPos
  }
  get startPoint () {
    const { sourcePos, controlPoint } = this
    const dir = new Vector3().copy(controlPoint).sub(sourcePos).normalize()
    return new Ray(sourcePos, dir).at(3, new Vector3())
  }
  get endPoint () {
    const { targetPos, controlPoint } = this
    const dir = new Vector3().copy(controlPoint).sub(targetPos).normalize()
    return new Ray(targetPos, dir).at(3, new Vector3())
  }

  init () {
    const { startPoint, endPoint, controlPoint } = this
    const quadraticBezierCurve = new QuadraticBezierCurve3(startPoint, controlPoint, endPoint)
    const points = quadraticBezierCurve.getPoints(50)
    const curveBufferGeometry = new BufferGeometry().setFromPoints(points)
    const curveMaterial = new LineBasicMaterial( { color: this.color, linewidth: this.linewidth } )
    this.curve = new Line(curveBufferGeometry, curveMaterial)
    this.add(this.curve)

    if (this.showArrow) {
      this.arrow = this.arrowMesh()
      const dir = new Vector3().subVectors(points[50], points[49])
      this.setArrowDirection(dir.normalize())
      this.setArrowLength(points[50], this.arrowLength, this.arrowWidth)
      this.add(this.arrow)
    }
  }
  arrowMesh () {
    const triangularGeometry = new BufferGeometry()
    triangularGeometry.addAttribute( 'position', new Float32BufferAttribute( [ -0.5, -0.5, 0, 0.5, -0.5, 0, 0, 0.5, 0 ], 3 ) )
    triangularGeometry.translate( 0, - 0.5, 0 )
    let triangle = new Mesh(triangularGeometry, new MeshBasicMaterial( { color : this.color } ))
    triangle.matrixAutoUpdate = false
    return triangle
  }
  setArrowDirection (dir) {
    // dir is assumed to be normalized
    let axis = new Vector3()
    let radians

    // quaternion (x,y,z,w) 旋转中, (x, y, z)代表绕哪个轴旋转, w = cos(θ/2) θ即为旋转角度
    if ( dir.y > 0.99999 ) { // y正方向的单位向量

      this.arrow.quaternion.set( 0, 0, 0, 1 )

    } else if ( dir.y < - 0.99999 ) {  // y负方向的单位向量

      this.arrow.quaternion.set( 1, 0, 0, 0 )

    } else { // 与y方向有夹角的单位向量

      //由(0,1,0)与dir向量叉积得到
      axis.copy(new Vector3(0, 1, 0).cross(dir)).normalize()
      // 通过点积运算反推得到 (0, 1, 0) . (dir.x, dir.y, dir.z) = |(0,1,0)||(dir.x, dir.y, dir.z)|cosθ
      radians = Math.acos(dir.dot(new Vector3(0, 1, 0)))
      this.arrow.quaternion.setFromAxisAngle( axis, radians )

    }
  }
  setArrowLength (origin, arrowLength, arrowWidth) {
    this.arrow.scale.set( arrowWidth, arrowLength, arrowWidth ) // 平移之后缩放，平移量也会按缩放比例变换，缩放和旋转都是以坐标原点为依据。
    this.arrow.position.copy(origin)
    this.arrow.updateMatrix()
  }
  updateGeometry () {
    const quadraticBezierCurve = new QuadraticBezierCurve3(this.startPoint, this.controlPoint, this.endPoint)
    const points = quadraticBezierCurve.getPoints( 50 )
    this.curve.geometry.setFromPoints(points)
    const dir = new Vector3().subVectors(points[50], points[49])
    this.setArrowDirection( dir.normalize())
    this.setArrowLength(points[50], this.arrowLength, this.arrowWidth)
  }
  updatePosition = (sourcePos, targetPos, controlPointCenterOffset) => {
    this.sourcePos.copy(sourcePos)
    this.targetPos.copy(targetPos)
    if (controlPointCenterOffset) this.controlPointCenterOffset = controlPointCenterOffset
    this.updateGeometry()
  }
  updateVisibility = (visible) => {
    this.visible = visible
  }
  updateColor = (color) => {
    this.curve.material.color.set(color)
    this.showArrow && this.arrow.material.color.set(color)
  }
}

export { CurveEdge }