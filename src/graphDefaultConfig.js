const config = {
  camera: {
    fov: 45,
    near: 1,
    far: 1000,
    position: [0, 0, 100]
  },// Refer to threejs perspective camera [https://threejs.org/docs/#api/en/cameras/PerspectiveCamera]
  viewPort: {
    targetPosition: [0, 0, 10],
    enableRotate: false
  },// Refer to threejs OrbitControls module [https://threejs.org/docs/#examples/en/controls/OrbitControls]

  nodeSize: 3,
  nodeColor: '#5CCEC2',
  nodeActiveColor: '#FFFFFF',
  nodeFillColor: '#161E28',
  nodeFillActiveColor: '#5CCEC2',
  nodeBorderSize: 2,
  nodeBorderColor: '#5CCEC2',
  nodeActiveBorderColor: '#FFFFFF',
  nodeLabelColor: '#8196AC',
  nodeLabelActiveColor: '#C6DEF0',
  nodeLabelFontSize: 200,
  nodeImgColor: '#5CCEC2',
  nodeImgActiveColor: '#FFFFFF',

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

  boxSelect: true,
  selectionBoxStyles: {
    border: '1px solid #55aaff',
    backgroundColor: 'rgba(75, 160, 255, 0.3)'
  },
  boxSelectEnableType: ['node', 'edge']
}

export default config