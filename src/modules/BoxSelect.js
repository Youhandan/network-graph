import { EventDispatcher } from 'three'
import { SelectionBox } from './boxSelection/SelectionBox'
import { SelectionHelper } from './boxSelection/SelectionHelper'

class BoxSelect extends EventDispatcher {
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
    this.selectedObjects = {}
    this.#bindEvents()
  }
  enable () {
    this.enabled = true
    this.#selectionBoxHelper.enableBoxSelect()
  }
  disable () {
    this.enabled = false
    this.#selectionBoxHelper.disableBoxSelect()
    this.selectedObjects = {}
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
    const rect = this.#canvas.getBoundingClientRect()
    this.#selectionBox.startPoint.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
      0.5)
  }
  #handleMousemove = (event) => {
    if (!this.enabled) return
    if (this.#selectionBoxHelper.isDown) {
      const rect = this.#canvas.getBoundingClientRect()
      this.#selectionBox.endPoint.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
        0.5)

      const intersectsObjects = this.#selectionBox.select()
      intersectsObjects.forEach((objectChild) => {
        if (this.#enableObjectsNames.includes(objectChild.parent.objectType) && objectChild.parent.visible) {
          this.selectedObjects[objectChild.parent.userId] = objectChild.parent
        }
      })
    }
  }
  #handleMouseup = (event) => {
    if (!this.enabled) return
    const rect = this.#canvas.getBoundingClientRect()
    this.#selectionBox.endPoint.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
      0.5)
    setTimeout(() => this.dispatchEvent({type: 'boxSelectEnd', param: Object.values(this.selectedObjects)}), ) //exec after click event
  }
}

export { BoxSelect }
