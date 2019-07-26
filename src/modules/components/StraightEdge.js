/*
According to ArrowHelper class.
* */

import {
  BufferGeometry,
  Float32BufferAttribute,
  Vector3,
  Vector2,
  MeshBasicMaterial,
  Mesh,
  Object3D
} from 'three/build/three.module'
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js'
import { LineSegments2Enhence } from '../enhenceLib/LineSegments2-enhence'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'

class StraightEdge extends Object3D {
  constructor(data, config) {
    super()
    const { sourcePos, targetPos, visible, ...userData } = data
    this.visible = visible
    this.selectedStatus = false
    this.userId = data.id
    this.sourcePos = new Vector3(sourcePos.x, sourcePos.y, sourcePos.z)
    this.targetPos = new Vector3(targetPos.x, targetPos.y, targetPos.z)
    this.userData = userData
    this.objectType = 'edge'
    this.name = 'straight'
    this.arrow = null
    this.line = null

    this.color = config.straightEdgeColor
    this.selectedColor = config.straightEdgeSelectedColor
    this.linewidth = config.straightEdgeLineWidth
    this.showArrow = config.straightEdgeArrow
    this.arrowWidth = config.straightEdgeArrowWidth
    this.arrowLength = config.straightEdgeArrowLength

    this.init()
  }
  init () {
    const length = this.startPoint.distanceTo(this.endPoint)
    this.position.copy( this.startPoint )
    this.line = this.lineMesh()
    this.add(this.line)
    if (this.showArrow) {
      this.arrow = this.arrowMesh()
      this.add(this.arrow)
    }
    this.setDirection(this.direction.normalize())
    this.setLength(length, this.arrowLength, this.arrowWidth)
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
  get direction () {
    const { sourcePos, targetPos } = this
    let dir = new Vector3()
    return dir.subVectors(targetPos, sourcePos)
  }
  get startPoint () {
    const { sourcePos } = this
    const {x, y, z} = this.direction.clone().setLength(3)
    return new Vector3(x + sourcePos.x, y + sourcePos.y, z + sourcePos.z)
  }
  get endPoint () {
    const { targetPos, startPoint } = this
    const distance = this.startPoint.distanceTo(new Vector3(targetPos.x, targetPos.y, targetPos.z))
    const {x, y ,z} = this.direction.clone().setLength(distance - 3)
    return new Vector3(x + startPoint.x, y + startPoint.y, z + startPoint.z)
  }
  lineMesh () {
    const fatLineGeo = new LineSegmentsGeometry().setPositions( new Float32BufferAttribute( [ 0, 0, 0, 0, 1, 0 ], 3 ).array )
    const lineMaterial = new LineMaterial( {
      color: this.color,
      linewidth: this.linewidth,
      resolution: new Vector2(window.innerWidth, window.innerHeight)
    } )
    return new LineSegments2Enhence(fatLineGeo, lineMaterial)
  }
  arrowMesh () {
    const triangularGeometry = new BufferGeometry()
    triangularGeometry.addAttribute( 'position', new Float32BufferAttribute( [ -0.5, -0.5, 0, 0.5, -0.5, 0, 0, 0.5, 0 ], 3 ) )
    triangularGeometry.translate( 0, - 0.5, 0 )
    let triangle = new Mesh(triangularGeometry, new MeshBasicMaterial( { color : this.color } ))
    triangle.matrixAutoUpdate = false
    return triangle
  }
  setDirection (dir) {
    // dir is assumed to be normalized
    let axis = new Vector3()
    let radians

    // quaternion (x,y,z,w) 旋转中, (x, y, z)代表绕哪个轴旋转, w = cos(θ/2) θ即为旋转角度
    if ( dir.y > 0.99999 ) { // y正方向的单位向量

      this.quaternion.set( 0, 0, 0, 1 )

    } else if ( dir.y < - 0.99999 ) {  // y负方向的单位向量

      this.quaternion.set( 1, 0, 0, 0 )

    } else { // 与y方向有夹角的单位向量

      //这个向量由(0,1,0)与dir向量叉积得到
      axis.copy(new Vector3(0, 1, 0).cross(dir)).normalize()
      // 通过点积运算反推得到 (0, 1, 0) . (dir.x, dir.y, dir.z) = |(0,1,0)||(dir.x, dir.y, dir.z)|cosθ
      radians = Math.acos(dir.dot(new Vector3(0, 1, 0)))
      this.quaternion.setFromAxisAngle( axis, radians )

    }
  }
  setLength (length, arrowLength, arrowWidth) {
    const actualLineLength = this.showArrow ? length - this.arrowLength : length
    this.line.scale.set( 1, Math.max( 0, actualLineLength ), 1 )
    this.line.updateMatrix()

    if (this.showArrow) {
      this.arrow.scale.set( arrowWidth, arrowLength, arrowWidth ) // 平移之后缩放，平移量也会按缩放比例变换，缩放和旋转都是以坐标原点为依据。
      this.arrow.position.y = length
      this.arrow.updateMatrix()
    }
  }
  updateGeometry () {
    this.position.copy( this.startPoint )
    const length = this.startPoint.distanceTo(this.endPoint)
    this.setDirection(this.direction.normalize())
    this.setLength(length, this.arrowLength, this.arrowWidth)
  }
  updatePosition = (sourcePos, targetPos) => {
    this.sourcePos.copy(sourcePos)
    this.targetPos.copy(targetPos)
    this.updateGeometry()
  }
  updateVisibility = (visible) => {
    this.visible = visible
  }
  updateColor = (color) => {
    this.line.material.color.set(color)
    this.showArrow && this.arrow.material.color.set(color)
  }
}

export { StraightEdge }