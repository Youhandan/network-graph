import { Scene, PerspectiveCamera, EventDispatcher } from 'three/build/three.module'
import { DragControls } from './modules/DragControls'
import { OrbitControls } from './modules/OrbitControls'
import { BoxSelection } from './modules/BoxSelection'
import { NodesHandler } from './modules/NodesHandler'
import { EdgesHandler } from './modules/EdgesHandler'
import { SingleSelection } from './modules/SingleSelection'
import { RightClick } from './modules/RightClick'
import { Renderer } from './modules/Renderer'
import defaultConfig from './graphDefaultConfig'

class NetworkGraph extends EventDispatcher {
  #scene = null
  #camera = null
  #renderer = null
  #viewPort = null
  #dragControls = null
  #nodesHandler = null
  #edgesHandler = null
  #boxSelectionControls = null
  #singleSelectionControls = null
  #rightClickControl = null

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
    this.#dragControls = new DragControls(this.#nodesHandler, this.#camera, this.#renderer.canvas)
    if (this.#config.enableBoxSelection) {
      this.#boxSelectionControls = new BoxSelection(this.#scene, this.#camera, this.#renderer.canvas, this.#config.boxSelectionEnableType, this.#config.selectionBoxStyles)
    }
    if (this.#config.enableSingleSelection) {
      this.#singleSelectionControls = new SingleSelection(this.#scene, this.#camera, this.#renderer.canvas, this.#config.singleSelectionEnableType)
    }
    if (this.#config.enableContextMenu) {
      this.#rightClickControl = new RightClick(this.#scene, this.#camera, this.#renderer.canvas, this.#config.contextMenuEnableType)
    }
  }
  #initViewPort() {
    const { targetPosition, enableRotate } = this.#config.viewPort
    this.#viewPort.target.set(targetPosition[0], targetPosition[1], targetPosition[2])
    this.#viewPort.enableRotate = enableRotate
    this.#viewPort.update()
  }
  #bindEvent() {
    if (this.#config.enableBoxSelection) {
      this.#boxSelectionControls.addEventListener('boxSelect', this.handleSelectByObjects)
      this.#boxSelectionControls.addEventListener('boxSelectEnd', this.disableBoxSelect)
    }
    if (this.#config.enableSingleSelection) {
      this.#singleSelectionControls.addEventListener('select', this.handleSelectByObjects)
    }
    if (this.#config.enableContextMenu) {
      this.#rightClickControl.addEventListener('contextMenu', this.handleTriggerContextMenu)
    }
    this.#dragControls.addEventListener('dragstart', this.handleDragstart)
    this.#dragControls.addEventListener('dragend', this.handleDragend)
    this.#dragControls.addEventListener('drag', this.handleDragmove)
  }
  #unBindEvent() {
    this.#config.enableSingleSelection && this.#singleSelectionControls.dispose()
    this.#config.enableBoxSelection && this.#boxSelectionControls.dispose()
    this.#dragControls.dispose()
    this.#renderer.dispose()
  }

  handleSelectByObjects = ({objects}) => {
    let edgeIds = [], nodeIds = []
    const originSelectedNodesIds = this.#nodesHandler.selectedNodesIds
    const originSelectedEdgesIds = this.#edgesHandler.selectedEdgesIds
    objects.forEach((object) => {
      if (object.objectType === 'edge') edgeIds.push(object.userId)
      if (object.objectType === 'node') nodeIds.push(object.userId)
    })
    this.#nodesHandler.selectNodes(nodeIds)
    this.#edgesHandler.selectEdges(edgeIds)

    const currentSelectedNodesIds = this.#nodesHandler.selectedNodesIds
    const currentSelectedEdgesIds = this.#edgesHandler.selectedEdgesIds
    if (!(originSelectedNodesIds.length === 0 && currentSelectedNodesIds.length === 0)) {
      this.dispatchEvent({type: 'selectNodesChange', param: this.#nodesHandler.selectedNodesIds})
    }
    if (!(originSelectedEdgesIds.length === 0 && currentSelectedEdgesIds.length === 0)) {
      this.dispatchEvent({type: 'selectEdgesChange', param: this.#edgesHandler.selectedEdgesIds})
    }
  }
  handleTriggerContextMenu = ({param}) => {
    const { object, event } = param
    if (!object) return this.dispatchEvent({type: 'rightClickStage', param: {event}})

    const target = object.userData
    if (object.objectType === 'edge') return this.dispatchEvent({type: 'rightClickEdge', param: {target, event}})
    if (object.objectType === 'node') return this.dispatchEvent({type: 'rightClickNode', param: {target, event}})
  }
  enableBoxSelect = () => {
    this.#boxSelectionControls.enable()
    this.#singleSelectionControls.disable()
  }
  disableBoxSelect = () => {
    this.#boxSelectionControls.disable()
    this.#singleSelectionControls.enable()
  }
  handleDragstart = () => {
    this.#viewPort.enabled = false
  }
  handleDragmove = ({node}) => {
    const edges = this.#nodesHandler.nodeRelatedEdgesMap[node.userId]
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