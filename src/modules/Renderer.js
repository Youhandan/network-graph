import { WebGLRenderer } from 'three/build/three.module'

const defaultConfig = {
  width: window.innerWidth,
  height: window.innerHeight
}
class Renderer {
  #renderer = null
  #camera = null
  #scene = null
  constructor(scene, camera, config = {}) {
    this.width = config.width || defaultConfig.width
    this.height = config.height || defaultConfig.height
    this.#scene = scene
    this.#camera = camera
    this.#renderer = new WebGLRenderer({antialias: true, logarithmicDepthBuffer: true,  alpha: true})
    this.#init()
  }
  get canvas () {
    return this.#renderer.domElement
  }
  #bindEvent () {
    window.addEventListener('resize', this.#onWindowResize)
  }
  #unBindEvent () {
    window.removeEventListener('resize', this.#onWindowResize)
  }
  dispose () {
    this.#unBindEvent()
  }
  #init() {
    this.#renderer.setSize( this.width, this.height )
    this.#render()
  }
  #render = () => {
    requestAnimationFrame(this.#render)
    this.#renderer.render(this.#scene, this.#camera)
  }
  #onWindowResize = () => {
    this.#camera.aspect = this.width / this.height
    this.#camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
  }
}

export { Renderer }