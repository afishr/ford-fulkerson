'use strict'

var waves = [];

function bfs(rGraph, s, t, parent) {
	var visited = [];
	var queue = [];
	var V = rGraph.length;
	// Create a visited array and mark all vertices as not visited
	for (var i = 0; i < V; i++) {
		visited[i] = false;
	}
	// Create a queue, enqueue source vertex and mark source vertex as visited
	queue.push(s);
	visited[s] = true;
	parent[s] = -1;

	while (queue.length != 0) {
		var u = queue.shift();
		for (var v = 0; v < V; v++) {
			if (visited[v] == false && rGraph[u][v] > 0) {
				queue.push(v);
				parent[v] = u;
				visited[v] = true;
			}
		}
	}


	//If we reached sink in BFS starting from source, then return true, else false
	return (visited[t] == true);
}

function fordFulkerson(graph, s, t) {
	var rGraph = [];
	waves = [];

	for (var u = 0; u < graph.length; u++) {
		var temp = [];
		for (v = 0; v < graph.length; v++) {
			temp.push(graph[u][v]);
		}
		rGraph.push(temp);
	}
	var parent = [];
	var maxFlow = 0;

	while ( bfs(rGraph, s, t, parent) ) {
		var pathFlow = Number.MAX_VALUE;
		let steps = [];
		for (var v = t; v != s; v = parent[v]) {
			u = parent[v];
			pathFlow = Math.min(pathFlow, rGraph[u][v]);
		}
		for (v = t; v != s; v = parent[v]) {
			u = parent[v];
			rGraph[u][v] -= pathFlow;
			rGraph[v][u] += pathFlow;
			let tempu, tempv;

			tempu = parseInt(u / 2);
			tempv = parseInt(v / 2);

			// console.log(tempu, tempv, pathFlow + '/' + (rGraph[u][v] + pathFlow) + '/' + graph[u][v]);
			
			let temp = [];
			temp.push(tempu);
			temp.push(tempv);
			temp.push(graph[u][v] - rGraph[u][v]);
			temp.push(graph[u][v]);
			temp.push(pathFlow);
			steps.push(temp);
		}

		maxFlow += pathFlow;
		steps.push(maxFlow);
		waves.push(steps.reverse());		
	}

	return maxFlow;
}

function remakeGraph(graph) {
	var rGraph = [];

	for (var u = 0; u < graph.length * 2; u++) {
		var temp = [];
		
		for (var v = 0; v < graph.length * 2; v++) {
			temp.push(0);
		}
		rGraph.push(temp);
	}

	for (let i = 0; i < graph.length; i++) {
		for (let j = 0; j < graph.length; j++) {
			if (i === j)
				rGraph[2*i][2*j+1] = graph[i][j]
			else
				rGraph[2*i+1][2*j] = graph[i][j]			
		}		
	}

	return rGraph;
}