const config = {
  camera: {
    fov: 45,
    near: 1,
    far: 1000,
    position: [0, 0, 100]
  },// Refer to threejs perspective camera [https://threejs.org/docs/#api/en/cameras/PerspectiveCamera]
  viewPort: {
    targetPosition: [0, 0, 10],
    enableRotate: false,
    zoomMinRatioOfCamera: 0.8,
    zoomMaxRatioOfCamera: 50
  },// Refer to threejs OrbitControls module [https://threejs.org/docs/#examples/en/controls/OrbitControls]

  nodeSize: 3,
  nodeColor: '#5CCEC2',
  nodeActiveColor: '#FFFFFF',
  nodeFillColor: '#161E28',
  nodeFillActiveColor: '#5CCEC2',
  nodeBorderSize: 0.2,
  nodeBorderColor: '#5CCEC2',
  nodeActiveBorderColor: '#FFFFFF',
  nodeLabelColor: '#8196AC',
  nodeLabelActiveColor: '#C6DEF0',
  nodeLabelFontSize: 50,
  nodeLabelScale: 0.05,
  nodeLabelFontFamily: 'sans-serif',
  nodeImgColor: '#5CCEC2',
  nodeImgActiveColor: '#FFFFFF',
  nodeIconColor: '#5CCEC2',
  nodeIconActiveColor: '#FFFFFF',
  showImg: true,
  showLabel: true,
  showIcon: true,

  curveEdgeColor: '#8196AC',
  curveEdgeSelectedColor: '#FFFFFF',
  curveEdgeLineWidth: 0.1,
  curveEdgeControlPointCenterOffset: 5,
  curveEdgeArrow: true,
  curveEdgeArrowLength: 2,
  curveEdgeArrowWidth: 1,

  straightEdgeColor: '#8196AC',
  straightEdgeSelectedColor: '#FFFFFF',
  straightEdgeLineWidth: 0.2,
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