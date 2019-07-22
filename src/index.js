import { Scene, PerspectiveCamera, EventDispatcher } from 'three/build/three.module'
import { OrbitControls } from './modules/OrbitControls'
import { BoxSelect } from './modules/BoxSelect'
import { NodesHandler } from './modules/NodesHandler'
import { EdgesHandler } from './modules/EdgesHandler'
import { Renderer } from './modules/Renderer'
import Events from './modules/Events'
import defaultConfig from './graphDefaultConfig'

class NetworkGraph extends EventDispatcher {
  #scene = null
  #camera = null
  #renderer = null
  #viewPort = null
  #nodesHandler = null
  #edgesHandler = null
  #boxSelectControl = null
  #eventsControl

  #container = null
  #config = null

  constructor(dom, customConfig = {}) {
    super()
    this.#container = dom
    this.#config = Object.assign(defaultConfig, customConfig)
    this.#init()
  }
  #init() {
    try {
      this.#initScene()
      this.#installModules()
      this.#bindEvent()
      this.#initViewPort()
      this.#container.appendChild(this.#renderer.canvas)
    }
    catch (e) {
      console.log(e);
    }
  }
  #initScene() {
    const { fov, aspect, near, far, position } = this.#config.camera
    this.#scene = new Scene()
    this.#camera = new PerspectiveCamera( fov, aspect, near, far )
    this.#camera.position.set(position[0], position[1], position[2])
  }
  #installModules() {
    this.#renderer = new Renderer(this.#scene, this.#camera)
    this.#viewPort = new OrbitControls(this.#camera, this.#renderer.canvas)
    this.#nodesHandler = new NodesHandler(this.#scene, this.#config)
    this.#edgesHandler = new EdgesHandler(this.#scene, this.#nodesHandler, this.#config)
    this.#eventsControl = new Events(this.#scene, this.#camera, this.#renderer.canvas)

    if (this.#config.boxSelect) {
      this.#boxSelectControl = new BoxSelect(this.#scene, this.#camera, this.#renderer.canvas, this.#config.boxSelectEnableType, this.#config.selectionBoxStyles)
    }
  }
  #initViewPort() {
    const { targetPosition, enableRotate } = this.#config.viewPort
    this.#viewPort.target.set(targetPosition[0], targetPosition[1], targetPosition[2])
    this.#viewPort.enableRotate = enableRotate
    this.#viewPort.update()
  }
  #bindEvent() {
    if (this.#config.boxSelect) {
      this.#boxSelectControl.addEventListener('boxSelectEnd', this.handleBoxSelectEnd)
    }
    this.#eventsControl.addEventListener('click', this.handleClick)
    this.#eventsControl.addEventListener('rightClick', this.handleRightClick)
    this.#eventsControl.addEventListener('dblclick', this.handleDoubleClick)
    this.#eventsControl.addEventListener('hoveron', this.handleHoverOn)
    this.#eventsControl.addEventListener('hoveroff', this.handleHoverOff)
    this.#eventsControl.addEventListener('dragstart', this.handleDragstart)
    this.#eventsControl.addEventListener('dragend', this.handleDragend)
    this.#eventsControl.addEventListener('drag', this.handleDragmove)
  }
  #unBindEvent() {
    this.#config.boxSelect && this.#boxSelectControl.dispose()
    this.#eventsControl.deactivate()
    this.#renderer.dispose()
  }

  handleClick = ({param}) => {
    const { object, event } = param
    if (!object) return this.dispatchEvent({type: 'clickStage', param: {event}})

    const target = object.userData
    if (object.objectType === 'edge') return this.dispatchEvent({type: 'clickEdge', param: {target, event}})
    if (object.objectType === 'node') return this.dispatchEvent({type: 'clickNode', param: {target, event}})
  }
  handleRightClick = ({param}) => {
    const { object, event } = param
    if (!object) return this.dispatchEvent({type: 'rightClickStage', param: {event}})

    const target = object.userData
    if (object.objectType === 'edge') return this.dispatchEvent({type: 'rightClickEdge', param: {target, event}})
    if (object.objectType === 'node') return this.dispatchEvent({type: 'rightClickNode', param: {target, event}})
  }
  handleDoubleClick = ({param}) => {
    const { object, event } = param
    if (!object) return this.dispatchEvent({type: 'dblclickStage', param: {event}})

    const target = object.userData
    if (object.objectType === 'edge') return this.dispatchEvent({type: 'dblclickEdge', param: {target, event}})
    if (object.objectType === 'node') return this.dispatchEvent({type: 'dblclickNode', param: {target, event}})
  }
  handleHoverOn = ({param}) => {
    const { object, event } = param
    const target = object.userData

    this.dispatchEvent({type: 'hoveron', param: {target, event}})
  }
  handleHoverOff = ({param}) => {
    const { object, event } = param
    const target = object.userData

    this.dispatchEvent({type: 'hoveroff', param: {target, event}})
  }
  enableBoxSelect = () => {
    this.#boxSelectControl.enable()
    this.#eventsControl.disable()
  }
  handleBoxSelectEnd = ({param}) => {
    let edgeIds = [], nodeIds = []
    param.forEach((object) => {
      if (object.objectType === 'edge') edgeIds.push(object.userId)
      if (object.objectType === 'node') nodeIds.push(object.userId)
    })
    this.dispatchEvent({type: 'boxSelect', param: {nodeIds, edgeIds}})

    this.#boxSelectControl.disable()
    setTimeout(() => {
      this.#eventsControl.enable()
    }, 0)
  }
  handleDragstart = () => {
    this.#viewPort.enabled = false
  }
  handleDragmove = ({param}) => {
    const edges = this.#nodesHandler.nodeRelatedEdgesMap[param.object.userId]
    if (edges) this.updateEdgesPosition(edges)
  }
  handleDragend = () => {
    this.#viewPort.enabled = true
  }

  addNodes (originalNodes) {
    this.#nodesHandler.addNodes(originalNodes)
  }
  addEdges (originalLines, lineType) {
    this.#edgesHandler.addEdges(originalLines, lineType)
    this.#nodesHandler.addRelatedEdgesToNodes(originalLines)
  }
  updateEdgesVisibility (edgeIds, visible) {
    this.#edgesHandler.updateEdgesVisibility(edgeIds, visible)
  }
  updateEdgesPosition (edges) {
    this.#edgesHandler.updateEdgesPosition(edges)
  }
  updateEdgesColor (edgeIds, color) {
    this.#edgesHandler.updateEdgesColor(edgeIds, color)
  }
  selectNodesByIds (nodeIds) {
    this.#nodesHandler.selectNodes(nodeIds)
  }
  selectEdgesByIds (edgeIds) {
    this.#edgesHandler.selectEdges(edgeIds)
  }
}

export default NetworkGraph