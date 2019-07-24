import {
  Camera,
  EventDispatcher,
  Matrix4,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
  MOUSE
} from "three/build/three.module"

class Events extends EventDispatcher {
  enabled = true
  #canvas
  #camera
  #scene
  #enableObjectsNames = ['node', 'edge']

  #selected
  #hovered
  #dragParam
  #raycaster
  #mouse
  #enabled
  #clickEnabled
  constructor(scene, camera, canvasDom) {
    super()
    this.#enabled = true
    this.#clickEnabled = true
    this.#scene = scene
    this.#camera = camera
    this.#canvas = canvasDom

    this.#dragParam = {
      offset: new Vector3(),
      inverseMatrix: new Matrix4(),
      worldPosition: new Vector3(),
      intersection: new Vector3(),
      plane: new Plane()
    }
    this.#raycaster = new Raycaster()
    this.#mouse = new Vector2()

    this.#selected = null
    this.#hovered = null

    this.#active()
  }
  enable() {
    this.#enabled = true
  }
  disable() {
    this.#enabled = false
  }
  #active () {
    this.#canvas.addEventListener( 'mousemove', this.#onMouseMove, false )
    this.#canvas.addEventListener( 'mousedown', this.#onMouseDown, false )
    this.#canvas.addEventListener( 'mouseup', this.#onMouseCancel, false )
    this.#canvas.addEventListener('dblclick', this.#onDoubleClick)
    this.#canvas.addEventListener('click', this.#onClick)
    this.#canvas.addEventListener('contextmenu', this.#onRightClick)
  }
  #deactive () {
    this.#canvas.removeEventListener( 'mousemove', this.#onMouseMove, false )
    this.#canvas.removeEventListener( 'mousedown', this.#onMouseDown, false )
    this.#canvas.removeEventListener( 'mouseup', this.#onMouseCancel, false )
    this.#canvas.removeEventListener('dblclick', this.#onDoubleClick)
    this.#canvas.removeEventListener('click', this.#onClick)
    this.#canvas.removeEventListener('contextmenu', this.#onRightClick)
  }
  #onMouseMove = (event) => {
    if (!this.#enabled) return
    event.preventDefault()

    const rect = this.#canvas.getBoundingClientRect()
    const { plane, intersection, inverseMatrix, worldPosition, offset } = this.#dragParam
    this.#mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.#mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    //drag logic
    this.#raycaster.setFromCamera(this.#mouse, this.#camera)
    if (this.#selected) {
      if (this.#clickEnabled) this.#clickEnabled = false

      let originPos = new Vector3(), currentPos = new Vector3()

      if (this.#raycaster.ray.intersectPlane(plane, intersection)) {
        originPos.copy(this.#selected.position)
        this.#selected.position.copy(intersection.sub(offset).applyMatrix4(inverseMatrix))
        currentPos.copy(this.#selected.position)
      }

      this.dispatchEvent({type: 'drag', param: {object: this.#selected, offset: currentPos.sub(originPos)}})
      return
    }

    //hover logic
    this.#raycaster.setFromCamera(this.#mouse, this.#camera)
    const intersects = this.#raycaster.intersectObjects(this.#scene.children, true)
    if (intersects.length > 0 && this.#enableObjectsNames.includes(intersects[0].object.parent.objectType)) {
      const object = intersects[0].object.parent
      plane.setFromNormalAndCoplanarPoint(this.#camera.getWorldDirection(plane.normal), worldPosition.setFromMatrixPosition(object.matrixWorld))
      if (this.#hovered !== object) {

        this.dispatchEvent({type: 'hoveron', param: {object, event}})
        this.#canvas.style.cursor = 'pointer'
        this.#hovered = object
      }
    } else {

      if (this.#hovered !== null) {
        this.dispatchEvent({type: 'hoveroff', param: {object: this.#hovered, event}})
        this.#canvas.style.cursor = 'auto'
        this.#hovered = null
      }
    }
  }
  #onMouseDown = (event) => {
    if (!this.#enabled) return
    if (event.button !== MOUSE.LEFT) return

    event.preventDefault()
    const { plane, intersection, inverseMatrix, worldPosition, offset } = this.#dragParam
    this.#raycaster.setFromCamera( this.#mouse, this.#camera )
    const intersects = this.#raycaster.intersectObjects( this.#scene.children, true )

    if ( intersects.length > 0 && intersects[ 0 ].object.parent.objectType === 'node') {
      this.#selected = intersects[ 0 ].object.parent
      if ( this.#raycaster.ray.intersectPlane(plane, intersection) ) {
       inverseMatrix.getInverse( this.#selected.parent.matrixWorld )
       offset.copy( intersection ).sub( worldPosition.setFromMatrixPosition( this.#selected.matrixWorld ) )
      }
      this.#canvas.style.cursor = 'move'
      this.dispatchEvent( { type: 'dragstart', param: {object: this.#selected}} )

      if (this.#hovered !== null) {
        this.dispatchEvent({type: 'hoveroff', param: {object: this.#hovered, event}})
        this.#hovered = null
      }
    }
  }
  #onMouseCancel = (event) => {
    if (!this.#enabled) return

    event.preventDefault()
    if ( this.#selected ) {
      this.dispatchEvent( { type: 'dragend', param: {object: this.#selected} } )
      this.#selected = null
    }

    setTimeout(() => {
      this.#clickEnabled = true
    }, 0)
    this.#canvas.style.cursor = this.#hovered ? 'pointer' : 'auto'
  }
  #onDoubleClick = (event) => {
    if (!this.#enabled) return

    this.#raycaster.setFromCamera(this.#mouse, this.#camera)
    const intersects = this.#raycaster.intersectObjects(this.#scene.children, true)
    let selectedObjects = []
    if (intersects.length > 0 && this.#enableObjectsNames.includes(intersects[0].object.parent.objectType)) selectedObjects.push(intersects[0].object.parent)

    this.dispatchEvent({type: 'dblclick', param: {object: selectedObjects[0], event}})
  }
  #onClick = (event) => {
    if (!this.#enabled || !this.#clickEnabled) return

    this.#raycaster.setFromCamera(this.#mouse, this.#camera)
    const intersects = this.#raycaster.intersectObjects(this.#scene.children, true)
    let selectedObjects = []
    if (intersects.length > 0 && this.#enableObjectsNames.includes(intersects[0].object.parent.objectType)) selectedObjects.push(intersects[0].object.parent)

    this.dispatchEvent({type: 'click', param: {object: selectedObjects[0], event}})
  }
  #onRightClick = (event) => {
    if (!this.#enabled) return

    this.#raycaster.setFromCamera(this.#mouse, this.#camera)
    const intersects = this.#raycaster.intersectObjects(this.#scene.children, true)
    let selectedObjects = []
    if (intersects.length > 0 && this.#enableObjectsNames.includes(intersects[0].object.parent.objectType)) selectedObjects.push(intersects[0].object.parent)

    this.dispatchEvent({type: 'rightClick', param: {object: selectedObjects[0], event}})
  }
}

export default Events