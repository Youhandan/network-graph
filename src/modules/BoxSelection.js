import { EventDispatcher } from 'three'
import { SelectionBox } from './boxSelection/SelectionBox'
import { SelectionHelper } from './boxSelection/SelectionHelper'

class BoxSelection extends EventDispatcher {
  enabled = false
  #selectionBox = null
  #selectionBoxHelper = null
  #canvas = null
  #enableObjectsNames
  constructor(scene, camera, canvasDom, enableObjectsNames, selectionBoxStyles) {
    super()
    if (!(scene && camera && canvasDom && enableObjectsNames && selectionBoxStyles)) throw new Error('Lost required constructor param')
    this.#selectionBox = new SelectionBox(camera, scene)
    this.#selectionBoxHelper = new SelectionHelper(canvasDom, selectionBoxStyles)
    this.#canvas = canvasDom
    this.#enableObjectsNames = enableObjectsNames
    this.#bindEvents()
  }
  enable () {
    this.enabled = true
    this.#selectionBoxHelper.enableBoxSelect()
  }
  disable () {
    this.enabled = false
    this.#selectionBoxHelper.disableBoxSelect()
  }
  #bindEvents () {
    this.#canvas.addEventListener('mousedown', this.#handleMousedown)
    this.#canvas.addEventListener('mousemove', this.#handleMousemove)
    this.#canvas.addEventListener('mouseup', this.#handleMouseup)
  }
  dispose () {
    this.#canvas.removeEventListener('mousedown', this.#handleMousedown)
    this.#canvas.removeEventListener('mousemove', this.#handleMousemove)
    this.#canvas.removeEventListener('mouseup', this.#handleMouseup)
  }
  #handleMousedown = (event) => {
    if (!this.enabled) return
    this.#selectionBox.startPoint.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5)
  }
  #handleMousemove = (event) => {
    if (!this.enabled) return
    if (this.#selectionBoxHelper.isDown) {
      this.#selectionBox.endPoint.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5)

      const intersectsObjects = this.#selectionBox.select()
      let selectedObjects = {}
      intersectsObjects.forEach((objectChild) => {
        if (this.#enableObjectsNames.includes(objectChild.parent.objectType) && objectChild.parent.visible) {
          selectedObjects[objectChild.parent.userId] = objectChild.parent
        }
      })

      this.dispatchEvent({type: 'boxSelect', objects: Object.values(selectedObjects)})
    }
  }
  #handleMouseup = (event) => {
    if (!this.enabled) return
    this.#selectionBox.endPoint.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5);
    setTimeout(() => this.dispatchEvent({type: 'boxSelectEnd'}), 0) //exec after click event
  }
}

export { BoxSelection }
