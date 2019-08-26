import { WebGLRenderer } from 'three/build/three.module'

class Renderer {
  #renderer = null
  #camera = null
  #scene = null
  #renderHandlerId
  constructor(scene, camera, width, height) {
    this.width = width
    this.height = height
    this.#scene = scene
    this.#camera = camera
    this.#renderer = new WebGLRenderer({antialias: true, logarithmicDepthBuffer: true, preserveDrawingBuffer: true, alpha: true})
    this.#renderHandlerId = undefined
    this.#init()
  }
  get canvas () {
    return this.#renderer.domElement
  }
  dispose () {
    this.#stop()
  }
  #init() {
    this.#renderer.setSize( this.width, this.height )
    this.#start()
  }
  #start = () => {
    if (!this.#renderHandlerId) {
      this.#render()
    }
  }
  #stop = () => {
    if (this.#renderHandlerId) {
      window.cancelAnimationFrame(this.#renderHandlerId)
      this.#renderHandlerId = undefined
    }
  }
  #render = () => {
    this.#renderer.clear()
    this.#renderer.render(this.#scene, this.#camera)
    this.#renderHandlerId = requestAnimationFrame(this.#render)
  }
  updateRendererSize(width, height) {
    this.#camera.aspect = width / height
    this.#camera.updateProjectionMatrix()
    this.#renderer.setSize(width, height)
  }
}

export { Renderer }