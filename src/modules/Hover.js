import { Raycaster, Vector2, EventDispatcher } from 'three/build/three.module'

class Hover extends EventDispatcher {
  enabled = true
  #canvas = null
  #camera = null
  #scene = null
  #enableObjectsNames
  #mouseoverObject
  #timer
  constructor(scene, camera, canvasDom, enableObjectsNames = ['node', 'edge']) {
    super()
    if (!(scene && camera && canvasDom && enableObjectsNames)) throw new Error('Lost required constructor param')

    this.#camera = camera
    this.#scene = scene
    this.#canvas = canvasDom
    this.#enableObjectsNames = enableObjectsNames
    this.#mouseoverObject = null
    this.#timer = null

    this.#bindEvents()
  }
  enable () {
    this.enabled = true
  }
  disable () {
    this.enabled = false
  }
  #bindEvents () {
    this.#canvas.addEventListener('mousemove', this.#handleMousemove)
  }
  dispose () {
    this.#canvas.removeEventListener('mousemove', this.#handleMousemove)
  }
  #handleMousemove = (event) => {
    if(!this.enabled) return
    if (this.#timer) return

    const rayCaster = new Raycaster()
    let mouse = new Vector2()
    var rect = this.#canvas.getBoundingClientRect();
    mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
    mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
    rayCaster.setFromCamera(mouse, this.#camera)
    const intersects = rayCaster.intersectObjects(this.#scene.children, true)
    if (intersects.length > 0 && this.#enableObjectsNames.includes(intersects[0].object.parent.objectType)) {
      if (this.#mouseoverObject && intersects[0].object.parent.userId === this.#mouseoverObject.userId) return
      this.#mouseoverObject = intersects[0].object.parent
      this.#timer = setTimeout(() => {
        this.#timer = null
        this.dispatchEvent({type: 'hoveron', param: {object: this.#mouseoverObject, event}})
      }, 500)

    } else {
      if (this.#mouseoverObject === null) return
      this.#timer = setTimeout(() => {
        this.#timer = null
        this.dispatchEvent({type: 'hoveroff', param: {object: this.#mouseoverObject, event}})
        this.#mouseoverObject = null
      }, 500)

    }
  }
}

export { Hover }
