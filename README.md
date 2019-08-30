# network-graph
This is a network graph lib based on Threejs, in order to optimize rendering over thousands of nodes in webgl mode.

# How to use
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Demo</title>
  <script src="./static/research-graph.js"></script>
  <style type="text/css">
  		#canvas {
  			width: 100%;
    		height: 100%;
    		background-color: #161E28;
  		}
	</style>
</head>
<body>
	<div id="canvas"></div>
<script>
    const canvas = document.getElementById('canvas')
    const graph = new NetworkGraph(canvas)
    const nodes = [
	    {
	      "id":"1",
	      "label":"HUMAN",
	      "position":{"x":20,"y":1},
	      "style": {
	        "color": "#5CCEC2"
	      }
	    },
	    {
	      "id":"2",
	      "label":"CAR",
	      "position":{"x":0,"y":1},
	      "style": {
	        "color": "#4FA3FF"
	      }
	    },
	    {
	      "id":"3",
	      "label":"PHONE",
	      "position":{"x":-20,"y":1},
	      "style": {
	        "color": "#EF8DBA"
	      }
	    }
    ]
    const edges = [
	    {"id":"a","source":"1","target":"2"},
	    {"id":"c","source":"1","target":"2"},
	    {"id":"b","source":"2","target":"1"},
	    {"id":"d","source":"2","target":"3"},
	    {"id":"e","source":"3","target":"2"},
	    {"id":"f","source":"3","target":"2"}
    ]
    graph.addNodes(nodes)
    graph.addEdges(edges)
  </script>

</body>
</html>
```

# API

This is a network graph lib based on Threejs, in order to optimize rendering over thousand of nodes in webgl mode.


## Graph Constructor

| Param | Description |
|-------------|-------------|
| **dom** | Canvas document |
| **customConfig** | Network graph global custom config, this will override default config ( graphDefaultConfig.js )  |

## Graph Data  

| dataType | type | config |
|--------|-----------|-------------|
| **node** | **Object** | { id *(required)*, position, icon(font, scale, content), label, imgUrl, style( color, activeColor, size, borderSize, borderColor, activeBorderColor, fillColor, fillActiveColor, labelColor, labelActiveColor, labelFontSize, labelFontFamily, labelScale, imgColor, imgActiveColor, iconColor, iconActiveColor), ...anyelse} |
| **curveEdge** | **Object** | { id*(required)*, source*(required)*, target*(required)*, controlPointCenterOffset, visible, ...anyelse}
| **straightEdge** | **Object** | { id*(required)*, source*(required)*, target*(required)*, visible, ...anyelse}



## Graph Methods  

| Method | Arguments | Description |
|--------|-----------|-------------|
| **addNodes (nodesData)** | **nodesData(Array) required:** Each element is a node type data| Add nodes in graph. |
| **addEdges (edgesData, edgeType)** | **edgesData(Array) required:** Each element is a curveEdge/straightEdge type data. <br> **edgeType(String):** One of 'curve' or 'straight'. **Default** is 'straight'| Add specific edges in graph. |
| **updateEdgesVisibility (edgeIds, visible)** | **edgeIds(Array) required:** Need to update visibility edges id.<br> **visible(Boolean) required:**  Edges visible status.| Change edges visible status.|
| **updateNodesPosition (nodesData)** | **nodesData(Array) required:** Each element is a node type data with updated postion. | Update node position when new position need to be set.|
| **updateEdgesPosition (edges)** | **edges(Array) required:** Edges need to update, edges are edge type data.| Change edges position when source or target position change or need to update curve edge controlPointCenterOffset.|
| **updateNodesColor (nodeIds, color)** | **nodeIds(Array) required:** Need to update color nodes id.<br> **color(Strinfg) required:**  Color to change *(enable Color, Hex, or String)*.| Change nodes color.|
| **updateEdgesColor (edgeIds, color)** | **edgeIds(Array) required:** Need to update color edges id.<br> **color(Strinfg) required:**  Color to change *(enable Color, Hex, or String)*.| Change edges color.|
| **selectNodesByIds (nodeIds)** | **nodeIds(Array) required:** Need to select node id. | Select nodes by id.|
| **selectEdgesByIds (edgeIds)** | **edgeIds(Array) required:** Need to select edges id. | Select edges by id.|
| **deleteNodes (nodeIds)** | **nodeIds(Array) required:** Need to delete nodes ids. | Delete nodes by id.|
| **deleteEdges (edgeIds)** | **edgeIds(Array) required:** Need to delete edges ids. | Delete edges by id.|
| **destroy** | null | Unbind event and set handler to be null.|
| **snapshot (type)** | **type(String):** Output canvas data url type | Take snapshot of current graph. |
| **transformToViewPosition (x, y)** | **x(Numbner):** world position x.<br> **y(Numbner):** world position y | Transform canvas 2d position to 3d view position |
| **updateRendererSize (width, height)** | **width(String unit px):** width canvas should change to.<br> **height(String unit px):** height canvas should change to | Change graph width and height when container size change |
| **enableBoxSelect** | null | Start box select |
| **disableBoxSelect** | null | Stop box select |




## Graph Events

| Event | Param | Description |
|-------|-------|-------------|
| **clickStage** | **{param: {event}}** | When click stage will be triggered|
| **rightClickStage** | **{param: {event}}** | When right click stage will be triggered|
| **dblclickStage** | **{param: {event}}** | When double click stage will be triggered|
| **clickNode** | **{param: {target, event}}** | When click node will be triggered|
| **rightClickNode** | **{param: {target, event}}** | When right click node will be triggered|
| **dblclickNode** | **{param: {target, event}}** | When double click node will be triggered|
| **hoveronNode** | **{param: {target, event}}** | When hover on node will be triggered|
| **hoveroffNode** | **{param: {target, event}}** | When hover off node will be triggered|
| **clickEdge** | **{param: {target, event}}** | When click edge will be triggered|
| **rightClickEdge** | **{param: {target, event}}** | When right click edge will be triggered|
| **dblclickEdge** | **{param: {target, event}}** | When double click edge will be triggered|
| **hoveronEdge** | **{param: {target, event}}** | When hover on edge will be triggered|
| **hoveroffEdge** | **{param: {target, event}}** | When hover off edge will be triggered|
| **boxSelect** | **{param: {nodeIds, edgeIds}}** | When box select end will be triggered|
| **nodesPositionChanged** | **{param: {nodesPosition}}** | When drag node end will be triggered|

## Graph Config

| item | Destription | Default |
|------|-------|------|
| **camera** | Construct of `fov`, `near`, `far`, `position`. *Refer to threejs perspective camera [https://threejs.org/docs/#api/en/cameras/PerspectiveCamera]*|`{fov: 45, near: 1, far: 1000, position: [0, 0, 100]}`|
| **viewPort** | Construct of `targetPosition`,`enableRotate`, `zoomMinRatioOfCamera`, `zoomMaxRatioOfCamera`. |`{targetPosition: [0, 0, 10],enableRotate: false,zoomMinRatioOfCamera: 0.8,zoomMaxRatioOfCamera: 50}`|
| **nodeSize** | Node size| 3 |
| **nodeColor** | Node color| '#5CCEC2' |
| **nodeActiveColor** | Node selected color| '#FFFFFF' |
| **nodeFillColor** | Node fill color| '#161E28' |
| **nodeFillActiveColor** | Node selected fill color| '#161E28' |
| **nodeBorderSize** | Node border size| 0.2 |
| **nodeBorderColor** | Node border color| '#5CCEC2' |
| **nodeActiveBorderColor** | Node selected border color| '#FFFFFF' |
| **nodeLabelColor** | Node label color| '#8196AC' |
| **nodeLabelActiveColor** | Node selected border color| '#C6DEF0' |
| **nodeLabelFontSize** | Node label font size| 50 |
| **nodeLabelScale** | Node label scale set for higher resolution| 0.05 |
| **nodeLabelFontFamily** | Node label font family| 'sans-serif' |
| **nodeImgColor** | Node fill image color | nodeImgColor |
| **nodeImgActiveColor** | Node selected image color| '#FFFFFF' |
| **nodeIconColor** | Node fill icon color| '#5CCEC2' |
| **nodeIconActiveColor** | Node selected fill icon color| '#FFFFFF' |
| **showImg** | Whether to show node fill image| true |
| **showLabel** | Whether to show node fill label| true |
| **showIcon** | Whether to show node fill icon| true |
| **curveEdgeColor** | Curve edge color| '#8196AC' |
| **curveEdgeSelectedColor** | Curve edge selected color| '#FFFFFF' |
| **curveEdgeLineWidth** | Curve edge line width| 0.1 |
| **curveEdgeControlPointCenterOffset** | Curve edge control point center offset | 5 |
| **curveEdgeArrow** | Whether to show curve edge direction | true |
| **curveEdgeArrowLength** | Set curve edge arrow length| 2 |
| **curveEdgeArrowWidth** | Set curve edge arrow width| 1 |
| **straightEdgeColor** | Straight edge color | '#8196AC' |
| **straightEdgeSelectedColor** | Straight edge selected color| '#FFFFFF' |
| **straightEdgeLineWidth** | Curve edge line width| 0.2 |
| **straightEdgeArrow** | Whether to show straight edge direction| false |
| **straightEdgeArrowLength** | Set straight edge arrow length| 2 |
| **straightEdgeArrowWidth** | Set straight edge arrow width | 1 |
| **boxSelect** | Whether enable box select | true |
| **selectionBoxStyles** | Set box selection box style, construct of `border `, `backgroundColor`| `{border: '1px solid #55aaff',backgroundColor: 'rgba(75, 160, 255, 0.3)'}` |
| **boxSelectEnableType** | Box select type | `['node', 'edge']` |







