class Queue {
	constructor() {
		this.values = []
	}

	enqueue(value, priority) {
		this.values.push({ value: value, priority: priority })
		this.bubbleUp()
	}

	dequeue() {
		let max = this.values[0]
		let end = this.values.pop()
		if (this.values.length > 0) {
			this.values[0] = end
			this.sinkDown()
		}
		return max
	}

	bubbleUp() {
		//Reference 'new' Element
		let idx = this.values.length - 1
		const element = this.values[idx]
		//while the index is NOT the top of the heap
		while (idx > 0) {
			//Find 'parent' element
			let parentIdx = Math.floor((idx - 1) / 2)
			let parent = this.values[parentIdx]
			// if the child element is greater/equal to the parent, exit the loop
			if (element.priority >= parent.priority) break
			// else, swap parent and child and reassign the 'new' element's index to be what the parent's was.
			this.values[parentIdx] = element
			this.values[idx] = parent
			idx = parentIdx;
		}
	}

	sinkDown() {
		let idx = 0
		const length = this.values.length
		const element = this.values[0]
		while (true) {
			let leftChild, rightChild
			let swap = null
			let leftChildIdx = 2 * idx + 1
			let rightChildIdx = 2 * idx + 2
			if (leftChildIdx < length) {
				leftChild = this.values[leftChildIdx]
				if (leftChild.priority < element.priority) {
					swap = leftChildIdx
				}
			}
			if (rightChildIdx < length) {
				rightChild = this.values[rightChildIdx]
				if (
					!swap && rightChild.priority < element.priority ||
					swap && rightChild.priority < leftChild.priority
				) {
					swap = rightChildIdx
				}
			}

			if (!swap) break
			this.values[idx] = this.values[swap]
			this.values[swap] = element
			idx = swap
		}
	}
}
class Graph	{
	constructor(scene)	{
		this.scene = scene
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

	removeEdge(v, w, oneWay)	{
		this.adjList[v].splice(this.adjList[v].indexOf(this.adjList[v].find(element => element.node == w)), 1)
		if (!oneWay) {
			this.adjList[w].splice(this.adjList[w].indexOf(this.adjList[w].find(element => element.node == v)), 1)
		}
	}

	getNodes()	{
		return Object.keys(this.adjList);
	}

	getConnectedNodes(start)	{
		
	}

	createPath(start, end)	{
		var then = this.scene.time.now
		this.path = this.dijkstra(start, end)
		console.log(this.scene.time.now-then)
		this.highlightPath()
	}

	dijkstra(start, end)	{
		const queue = new Queue();
		const distances = {};
		const previous = {};

		let path = []; // to return at the end
		let smallest;
		for (let vertex in this.adjList) {
			if (vertex == start.id) {
				distances[vertex] = 0
				queue.enqueue(vertex, 0)
			} else {
				distances[vertex] = Infinity
				queue.enqueue(vertex, Infinity)
			}
			previous[vertex] = null
		}
		while (queue.values.length) {
			smallest = queue.dequeue().value
			if (smallest == end.id) {
				while (previous[smallest]) {
					path.push(this.adjList[smallest].find(element => element.node == previous[smallest]).road)
					smallest = previous[smallest]
					// path.push(previous[smallest])
					// smallest = previous[smallest]
				}
				break
			}
			if (smallest && distances[smallest] !== Infinity) {
				for (let nextNode of this.adjList[smallest]) {
					let candidate = distances[smallest] + nextNode.road.length
					let neighborValue = nextNode.node;
					if (candidate < distances[neighborValue]) {
						// update 'distances' object
						distances[neighborValue] = candidate;
						// update 'previous' object
						previous[neighborValue] = smallest; 
						// enqueue priority queue with new smallest distance
						queue.enqueue(neighborValue, candidate)
					}
				}
			}
		}
		return path.reverse()
	}

	highlightPath()	{
		this.path.forEach(element => {
			element.tiles.forEach(tile => {
				tile.paint(0xFF0000)
				})
		})
	}
}

class Road	{
	constructor(graph, tiles, oneWay)	{
		this.graph = graph
		this.tiles = tiles
		this.oneWay = oneWay;

		this.setLength();
		this.tiles.forEach(element => {
			element.setType('road')
			element.setRoad(this)
		})
		this.addEdge()
	}

	setLength() {
		var start = this.tiles[0]
		var end = this.tiles[this.tiles.length-1]
		if (start.X == end.X || start.Y == end.Y) {
			this.length = Math.abs(start.X - end.X) + Math.abs(start.Y - end.Y) + 1
		} else {
			this.length = Math.floor((Math.abs(start.X - end.X) + Math.abs(start.Y - end.Y) + 2) * 0.707)
		}
	}

	get start()	{
		return this.tiles[0]
	}

	get end()	{
		return this.tiles[this.tiles.length - 1]
	}
	
	addEdge()	{
		this.graph.addEdge(this.start.id, this.end.id, this, this.oneWay);
	}

	removeEdge()	{
		this.graph.removeEdge(this.start.id, this.end.id, this.oneWay);
	}

	split(tile)	{
		if (this.start == tile)	{
			return
		} else if (this.end == tile) {
			return
		} else {
			console.log('Before removing edge:')
			console.log(this.graph.adjList)
			this.removeEdge()
			console.log('After removing edge:')
			console.log(this.graph.adjList)
			var tileIdx = this.tiles.indexOf(tile)
			new Road(this.graph, this.tiles.slice(0, tileIdx+1), this.oneWay)
			this.tiles = this.tiles.slice(tileIdx)
			this.setLength()
			this.addEdge()
		}
	}

	pointTiles()	{

	}
}

export {Road, Graph}
