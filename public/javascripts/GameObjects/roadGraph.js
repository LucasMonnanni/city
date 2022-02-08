class Graph	{
	constructor()	{
		this.adjList = {};
	}

	addVertex(v)	{
		this.adjList[v] = [];
	}

	addEdge(v, w, road, oneWay = false)	{
		if (!this.adjList[v])	{
			this.addVertex(v)
		}
		if (!this.adjList[w])	{
			this.addVertex(w)
		}
		this.adjList[v].push({node: w, road: road});
		if (!oneWay)	{
			this.adjList[w].push({node: v, road: road});
		}
	}

	getNodes()	{
		return Object.keys(this.adjList);
	}
}

class Road	{
	constructor(graph, start, end, oneWay)	{
		this.graph = graph
		this.start = start;
		this.end = end;
		this.oneWay = oneWay;
		if (start.X == end.X || start.Y == end.Y) {
			this.length = Math.abs(start.X - end.X) + Math.abs(start.Y - end.Y) + 1;
			console.log('straight road')
		} else {
			this.length = Math.floor((Math.abs(start.X - end.X) + Math.abs(start.Y - end.Y) + 2) * 0.707);
			console.log('diagonal road')
		}

		this.addEdge()
	}
	
	addEdge()	{
		this.graph.addEdge(this.start.id, this.end.id, this, this.oneWay);
	}

}

export {Road, Graph}
