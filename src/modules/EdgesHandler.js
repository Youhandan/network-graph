import { StraightEdge } from './components/StraightEdge'
import { CurveEdge } from './components/CurveEdge'

class EdgesHandler {
  constructor (scene, nodesHandler, config) {
    this.edgeIdMap = {}
    this.scene = scene
    this.nodesHandler = nodesHandler
    this.config = config
  }
  get edges () {
    return Object.values(this.edgeIdMap)
  }
  get selectedEdgesIds () {
    return Object.keys(this.edgeIdMap).filter((id) => {
      if (this.edgeIdMap[id].selected) return id
    })
  }
  addEdges = (edgesData, lineType = 'straight') => {
    edgesData.forEach((edgeData) => {
      const source = this.nodesHandler.nodeIdMap[edgeData.source]
      const target = this.nodesHandler.nodeIdMap[edgeData.target]
      if (!source || !target) throw new Error('related node is not exist!')

      const edge = {sourcePos: source.position, targetPos: target.position, ...edgeData}
      const edgeInst = lineType === 'straight' ? new StraightEdge(edge, this.config) : new CurveEdge(edge, this.config)
      this.edgeIdMap[edgeInst.userId] = edgeInst
      this.scene.add(edgeInst)
    })
    this.nodesHandler.addRelatedEdgesToNodes(edgesData)
  }
  selectEdges = (edgeIds) => {
    this.edges.forEach((edgeInst) => {
      edgeInst.selected = edgeIds.includes(edgeInst.userId)
    })
  }
  updateEdgesPosition = (edges) => {
    edges.forEach((edge) => {
      const edgeInst = this.edgeIdMap[edge.id]
      const sourcePos = this.nodesHandler.nodeIdMap[edgeInst.userData.source].position
      const targetPos = this.nodesHandler.nodeIdMap[edgeInst.userData.target].position
      if (edgeInst.name === 'straight') {
        edgeInst.updatePosition(sourcePos, targetPos)
      }
      if (edgeInst.name === 'curve') {
        edgeInst.updatePosition(sourcePos, targetPos, edge.controlPointCenterOffset)
      }
    })
  }
  updateEdgesVisibility = (edgeIds, visible) => {
    edgeIds.forEach((edgeId) => {
      this.edgeIdMap[edgeId].updateVisibility(visible)
    })
  }
  updateEdgesColor = (edgeIds, color) => {
    edgeIds.forEach((edgeId) => {
      this.edgeIdMap[edgeId].updateColor(color)
    })
  }
}

export { EdgesHandler }