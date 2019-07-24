import { Node } from './components/Node'

class NodesHandler {
  constructor (scene, config) {
    this.nodeIdMap = {}
    this.nodeRelatedEdgesMap = {}
    this.scene = scene
    this.config = config
  }
  get nodes () {
    return Object.values(this.nodeIdMap)
  }
  get selectedNodesIds() {
    return Object.keys(this.nodeIdMap).filter((id) => {
      if (this.nodeIdMap[id].selected) return id
    })
  }
  addRelatedEdgesToNodes = (newEdges) => {
    newEdges.forEach((newEdge) => {
      this.#addNodeRelatedEdge(newEdge.source, newEdge, 'from')
      this.#addNodeRelatedEdge(newEdge.target, newEdge, 'to')
    })
  }
  #addNodeRelatedEdge (nodeId, newEdge, direction) {
    if (this.nodeRelatedEdgesMap[nodeId]) {
      const isEdgeExist = this.nodeRelatedEdgesMap[nodeId].findIndex((edge) => edge.id === newEdge.id) !== -1
      if (isEdgeExist) return

      this.nodeRelatedEdgesMap[nodeId].push({id: newEdge.id, direction})
    } else {
      this.nodeRelatedEdgesMap[nodeId] = [{id: newEdge.id, direction}]
    }
  }

  addNodes = (nodes) => {
    nodes.forEach((node) => {
      const nodeInst = new Node(node, this.config)
      this.nodeIdMap[nodeInst.userId] = nodeInst
      this.scene.add(nodeInst)
    })
  }
  selectNodes = (nodeIds) => {
    this.nodes.forEach((nodeInst) => {
      nodeInst.selected = nodeIds.includes(nodeInst.userId)
    })
  }
  updateNodesPositionByOffset = (nodeIds, offset) => {
    nodeIds.forEach((nodeId)=> {
      this.nodeIdMap[nodeId].position.add(offset)
    })
  }
}

export { NodesHandler }