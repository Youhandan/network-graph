const config = {
  camera: {
    fov: 45,
    aspect: window.innerWidth / window.innerHeight,
    near: 1,
    far: 1000,
    position: [0, 0, 100]
  },// Refer to threejs perspective camera [https://threejs.org/docs/#api/en/cameras/PerspectiveCamera]
  viewPort: {
    targetPosition: [0, 2, 10],
    enableRotate: false
  },// Refer to threejs OrbitControls module [https://threejs.org/docs/#examples/en/controls/OrbitControls]

  nodeSize: 3,
  nodeColor: '#0000ff',
  nodeSelectedBorderColor: '#000000',
  nodeLabelColor: '#000000',
  nodeLabelFontSize: 100,

  curveEdgeColor: '#000000',
  curveEdgeSelectedColor: '#ff0000',
  curveEdgeLineWidth: 10,
  curveEdgeControlPointCenterOffset: 5,
  curveEdgeArrow: true,
  curveEdgeArrowLength: 2,
  curveEdgeArrowWidth: 1,

  straightEdgeColor: '#000000',
  straightEdgeSelectedColor: '#ff0000',
  straightEdgeLineWidth: 10,
  straightEdgeArrow: false,
  straightEdgeArrowLength: 2,
  straightEdgeArrowWidth: 1,

  enableBoxSelection: true,
  selectionBoxStyles: {
    border: '1px solid #55aaff',
    backgroundColor: 'rgba(75, 160, 255, 0.3)'
  },
  boxSelectionEnableType: ['node', 'curveEdge', 'straightEdge'],

  enableSingleSelection: true,
  singleSelectionEnableType: ['node', 'curveEdge', 'straightEdge'],

  enableContextMenu: true,
  contextMenuEnableType: ['node', 'curveEdge', 'straightEdge']
}

export default config