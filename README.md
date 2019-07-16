# network-graph
This is a network graph lib based on Threejs, in order to optimize rendering over thousands of nodes in webgl mode.

# API

This is a network graph lib based on Threejs, in order to optimize rendering over thousand of nodes in webgl mode.


## Graph Constructor

| Param | Description |
|-------------|-------------|
| **dom** | Canvas document |
| **customConfig** | Network graph global custom config, this will override default config ( graphDefaultConfig.js )  |

## Graph Methods  

| Method | Arguments | Description |
|--------|-----------|-------------|
| **addNodes (nodesData)** | **nodesData(Array) required:** Each element object construct of id *(required)*, position, iconUrl, label| Add nodes in graph. |
| **addEdges (edgesData, edgeType)** | **edgesData(Array) required:** Each element object construct of id *(required)*, source *(required)*, target *(required)*, controlPointCenterOffset. <br> **edgeType(String):** One of 'curve' or 'straight'. **Default** is 'straight'| Add specific edges in graph. |
| **updateEdgesVisibility (edgeIds, visible)** | **edgeIds(Array) required:** Need to update visibility edges id.<br> **visible(Boolean) required:**  Edges visible status.| Change edges visible status.|
| **updateEdgesPosition (edges)** | **edges(Array) required:** Edges need to update, edge object construct of id *(required)*, source *(required)*, target *(required)*, controlPointCenterOffset.| Change edges position when source or target position change or need to update curvef edge controlPointCenterOffset.|
| **updateEdgesColor (edgeIds, color)** | **edgeIds(Array) required:** Need to update color edges id.<br> **color(Strinfg) required:**  Color to change *(enable Color, Hex, or String)*.| Change edges color.|
| **selectNodesByIds (nodeIds)** | **nodeIds(Array) required:** Need to select node id. | Select nodes by id.|
| **selectEdgesByIds (edgeIds)** | **edgeIds(Array) required:** Need to select edges id. | Select edges by id.|

## Graph Events

| Event | Param | Description |
|--------|----------|-------------|
| **selectNodesChange** | **{param}(Object)** | When nodes are selected in graph, the event will be triggered. *(This will be trigger only when singleSelection or boxSelection is set to be true in config.)*|
| **selectEdgesChange** | **{param}(Object)** | When edges are selected in graph, the event will be triggered. *(This will be trigger only when singleSelection or boxSelection is set to be true in config.)*|
