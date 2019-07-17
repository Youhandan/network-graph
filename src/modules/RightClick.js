import { Raycaster, Vector2, EventDispatcher } from 'three/build/three.module'

class RightClick extends EventDispatcher {
  enabled = true
  #canvas = null
  #camera = null
  #scene = null
  #enableObjectsNames
  constructor(scene, camera, canvasDom, enableObjectsNames) {
    super()
    if (!(scene && camera && canvasDom && enableObjectsNames)) throw new Error('Lost required constructor param')

    this.#camera = camera
    this.#scene = scene
    this.#canvas = canvasDom
    this.#enableObjectsNames = enableObjectsNames
    this.#bindEvents()
  }
  enable () {
    this.enabled = true
  }
  disable () {
    this.enabled = false
  }
  #bindEvents () {
    this.#canvas.addEventListener('contextmenu', this.#handleContextMenu)
  }
  dispose () {
    this.#canvas.removeEventListener('contextmenu', this.#handleContextMenu)
  }
  #handleContextMenu = (event) => {
    if(!this.enabled) return

    const rayCaster = new Raycaster()
    let mouse = new Vector2()
    var rect = this.#canvas.getBoundingClientRect();
    mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
    mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
    rayCaster.setFromCamera(mouse, this.#camera)
    const intersects = rayCaster.intersectObjects(this.#scene.children, true)
    let selectedObjects = []
    if (intersects.length > 0 && this.#enableObjectsNames.includes(intersects[0].object.parent.objectType)) selectedObjects.push(intersects[0].object.parent)

    this.dispatchEvent({type: 'rightClick', param: {object: selectedObjects[0], event}})
  }
}

export { RightClick }
