import { Scene, PerspectiveCamera, EventDispatcher, Vector3 } from 'three/build/three.module'
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
    this.#config = Object.assign({}, defaultConfig, customConfig)
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
    const { fov, near, far, position } = this.#config.camera
    if (!(fov && near && far && position)) throw new Error('camera config not complete!')

    this.#scene = new Scene()
    this.#camera = new PerspectiveCamera( fov, this.#container.clientWidth/this.#container.clientHeight, near, far )
    this.#camera.position.set(position[0], position[1], position[2])
  }
  #installModules() {
    this.#renderer = new Renderer(this.#scene, this.#camera, this.#container.clientWidth, this.#container.clientHeight)
    this.#viewPort = new OrbitControls(this.#camera, this.#renderer.canvas)
    this.#nodesHandler = new NodesHandler(this.#scene, Object.assign(this.#config, {innerWidth: this.#container.clientWidth, innerHeight: this.#container.clientHeight}))
    this.#edgesHandler = new EdgesHandler(this.#scene, this.#nodesHandler, Object.assign(this.#config, {innerWidth: this.#container.clientWidth, innerHeight: this.#container.clientHeight}))
    this.#eventsControl = new Events(this.#scene, this.#camera, this.#renderer.canvas)

    if (this.#config.boxSelect) {
      this.#boxSelectControl = new BoxSelect(this.#scene, this.#camera, this.#renderer.canvas, this.#config.boxSelectEnableType, this.#config.selectionBoxStyles)
    }
  }
  #initViewPort() {
    const { targetPosition, enableRotate, zoomMinRatioOfCamera, zoomMaxRatioOfCamera } = this.#config.viewPort
    const { near, far } = this.#config.camera
    if (!(near && far)) throw new Error('camera config not complete!')
    if (!(targetPosition && enableRotate && zoomMinRatioOfCamera && zoomMaxRatioOfCamera)) throw new Error('view port config not complete!')

    this.#viewPort.target.set(targetPosition[0], targetPosition[1], targetPosition[2])
    this.#viewPort.enableRotate = enableRotate
    this.#viewPort.enableKeys = false
    this.#viewPort.screenSpacePanning = true
    this.#viewPort.minDistance = near * zoomMaxRatioOfCamera
    this.#viewPort.maxDistance = far * zoomMinRatioOfCamera
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
    if (this.#config.boxSelect) {
      this.#boxSelectControl.removeEventListener('boxSelectEnd', this.handleBoxSelectEnd)
      this.#boxSelectControl.dispose()
    }
    this.#eventsControl.removeEventListener('click', this.handleClick)
    this.#eventsControl.removeEventListener('rightClick', this.handleRightClick)
    this.#eventsControl.removeEventListener('dblclick', this.handleDoubleClick)
    this.#eventsControl.removeEventListener('hoveron', this.handleHoverOn)
    this.#eventsControl.removeEventListener('hoveroff', this.handleHoverOff)
    this.#eventsControl.removeEventListener('dragstart', this.handleDragstart)
    this.#eventsControl.removeEventListener('dragend', this.handleDragend)
    this.#eventsControl.removeEventListener('drag', this.handleDragmove)

    this.#eventsControl.dispose()
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

    if (object.objectType === 'edge') return this.dispatchEvent({type: 'hoveronEdge', param: {target, event}})
    if (object.objectType === 'node') return this.dispatchEvent({type: 'hoveronNode', param: {target, event}})
  }
  handleHoverOff = ({param}) => {
    const { object, event } = param
    const target = object.userData

    if (object.objectType === 'edge') return this.dispatchEvent({type: 'hoveroffEdge', param: {target, event}})
    if (object.objectType === 'node') return this.dispatchEvent({type: 'hoveroffNode', param: {target, event}})
  }
  enableBoxSelect = () => {
    this.#boxSelectControl.enable()
    this.#eventsControl.disable()
    this.#viewPort.enabled = false
  }
  disableBoxSelect = () => {
    this.#boxSelectControl.disable()
    this.#eventsControl.enable()
    this.#viewPort.enabled = true
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
      this.#viewPort.enabled = true
    }, 0)
  }
  handleDragstart = () => {
    this.#viewPort.enabled = false
  }
  handleDragmove = ({param}) => {
    const edges = this.#nodesHandler.nodeRelatedEdgesMap[param.object.userId]
    if (edges) this.updateEdgesPosition(edges)

    const selectedNodeIds = this.#nodesHandler.selectedNodesIds
    if (selectedNodeIds.includes(param.object.userId)) {
      const needToUpdatePositionNodeIds = selectedNodeIds.filter((nodeId) => nodeId !== param.object.userId)
      this.#nodesHandler.updateNodesPositionByOffset(needToUpdatePositionNodeIds, param.offset)

      needToUpdatePositionNodeIds.forEach((nodeId) => {
        const edges = this.#nodesHandler.nodeRelatedEdgesMap[nodeId]
        if (edges) this.updateEdgesPosition(edges)
      })
    }
  }
  handleDragend = ({param}) => {
    this.#viewPort.enabled = true

    let positionChangedNodeIds = []
    const selectedNodeIds = this.#nodesHandler.selectedNodesIds
    if (selectedNodeIds > 0 && selectedNodeIds.includes(param.object.userId)) positionChangedNodeIds.push(...selectedNodeIds)
    else positionChangedNodeIds.push(param.object.userId)

    const positionChangedNodes = positionChangedNodeIds.map((nodeId) => {
      const nodeInst = this.#nodesHandler.nodeIdMap[nodeId]
      return {id: nodeInst.userId, position: nodeInst.position}
    })
    this.dispatchEvent({type: 'nodesPositionChanged', param: {nodesPosition: positionChangedNodes}})
  }

  destroy () {
    this.#unBindEvent()
    this.#scene = null
    this.#camera = null
    this.#renderer = null
    this.#viewPort = null
    this.#nodesHandler = null
    this.#edgesHandler = null
    this.#boxSelectControl = null
    this.#eventsControl = null
    this.#container = null
    this.#config = null
  }
  addNodes (originalNodes) {
    this.#nodesHandler.addNodes(originalNodes)
  }
  deleteNodes (nodeIds) {
    let edgeIds = []
    nodeIds.forEach((nodeId) => {
      const edges = this.#nodesHandler.nodeRelatedEdgesMap[nodeId]
      if (edges) edgeIds.push(...edges.map((edge) => edge.id))
    })
    this.deleteEdges(edgeIds)
    this.#nodesHandler.deleteNodes(nodeIds)
  }
  addEdges (originalLines, lineType) {
    this.#edgesHandler.addEdges(originalLines, lineType)
  }
  deleteEdges (edgeIds) {
    this.#edgesHandler.deleteEdges(edgeIds)
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
  updateNodesColor (nodeIds, colorData) {
    this.#nodesHandler.updateNodesColor(nodeIds, colorData)
  }
  updateNodesPosition (nodes) {
    this.#nodesHandler.updateNodesPosition(nodes)
    nodes.forEach((node) => {
      const edges = this.#nodesHandler.nodeRelatedEdgesMap[node.id]
      if (edges) this.updateEdgesPosition(edges)
    })
  }
  selectNodesByIds (nodeIds) {
    this.#nodesHandler.selectNodes(nodeIds)
  }
  selectEdgesByIds (edgeIds) {
    this.#edgesHandler.selectEdges(edgeIds)
  }
  transformToViewPosition (x, y) {
    let vec = new Vector3()
    let pos = new Vector3()
    const rect = this.#renderer.canvas.getBoundingClientRect()
    vec.set(
      ((x - rect.left) / rect.width) * 2 - 1,
      -((y - rect.top) / rect.height) * 2 + 1,
      0.5 )

    vec.unproject( this.#camera )
    vec.sub( this.#camera.position ).normalize()
    const distance = - this.#camera.position.z / vec.z
    pos.copy( this.#camera.position ).add( vec.multiplyScalar( distance ) )
    return pos
  }
  snapshot(type){
    let image = new Image()
    image.src = this.#renderer.canvas.toDataURL(type)
    return image
  }
  updateRendererSize(width, height) {
    this.#renderer.updateRendererSize(width, height)
  }
}

export default NetworkGraph