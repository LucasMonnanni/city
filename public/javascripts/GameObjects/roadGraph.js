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

	removeEdge(v, w, oneWay, normalize = true)	{
		console.log(`Removing edge from ${v} to ${w} ${oneWay? '' : 'and back'}`)
		this.adjList[v].splice(this.adjList[v].indexOf(this.adjList[v].find(element => element.node == w)), 1)
		if (!oneWay) {
			this.adjList[w].splice(this.adjList[w].indexOf(this.adjList[w].find(element => element.node == v)), 1)
		}
		if (normalize) {
			this.normalizeNode(v)
			this.normalizeNode(w)
		}
	}

	normalizeNode(v) {
		console.log('Normalizing node:' + v)
		if (!this.adjList[v].length) {
			console.log('Deleting unconnected node')
			delete this.adjList[v]
		} else if (this.adjList[v].length == 1) {
			var w = this.adjList[v][0].node
			console.log('Node has only one edge')
			// check if only edge is one way
			if (!this.adjList[w].find(element => element.node == v)) {
				console.log('It is a one way edge')
				var incoming = this.getIncomingNodes(v)
				// check if there is only one other incoming edge
				if (incoming.length == 1)	{
					console.log('It has only one incoming')
					console.log(incoming[0])
					// if both, remove vertex and replace edges
					var u = incoming[0].node
					// make both roads one
					incoming[0].road.merge(this.adjList[v][0].road)
					// add new edge and remove old ones
					this.adjList[u].splice(this.adjList[u].indexOf(this.adjList[u].find(element => element.node == v)), 1)
					this.adjList[u].push({node: w, road: incoming[0].road})
				}
			} else {
				console.log('Edge is two ways, node is radial, stays put')
			}
		} else if (this.adjList[v].length == 2) {
			[u, w] = [0, 1].map(i => this.adjList[v][i].node)
			var incoming = this.getIncomingNodes(v)
			console.log(incoming)
			if (incoming.length == 2 && [u, w].includes(incoming[0].node) && [u, w].includes(incoming[1].node)) {
				// make both roads one
				incoming[0].road.merge(incoming[0].road)
				// add new edge and remove old ones
				this.adjList[u].splice(this.adjList[u].indexOf(this.adjList[u].find(element => element.node == v)), 1)
				this.adjList[u].push({ node: w, road: incoming[0].road })
				this.adjList[w].splice(this.adjList[w].indexOf(this.adjList[w].find(element => element.node == v)), 1)
				this.adjList[w].push({ node: u, road: incoming[0].road })
			}
		}
	}

	getNodes()	{
		return Object.keys(this.adjList);
	}

	getIncomingNodes(v)	{
		var incoming = []
		this.getNodes().forEach(node => {
			this.adjList[node].forEach(edge => {
				if (edge.node == v) {
					incoming.push({node: Number(node), road: edge.road})
				}
			})
		})
		return incoming
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
		this.oneWay = oneWay;
		this.tiles = tiles.slice(1,-1)
		console.log(tiles)
		this.nodeTiles = {}
		for (let i = 0; i < tiles.length; i++)	{
			if (i ==0 || i == tiles.length-1) {
				tiles[i].setType('roadNode')
				if (i == 0)	{
					this.nodeTiles.start = tiles[i]
				} else {
					this.nodeTiles.end = tiles[i]
				}
			} else {
				tiles[i].setType('road')
			}
			tiles[i].setRoad(this)
		}
		console.log(this.nodeTiles)
		console.log(this.tiles)
		this.setLength();
		this.addEdge()
		console.log(this.tiles.length)
	}

	setLength() {
		var start = this.start
		var end = this.end
		if (start.X == end.X || start.Y == end.Y) {
			this.length = Math.abs(start.X - end.X) + Math.abs(start.Y - end.Y) + 1
		} else {
			this.length = (Math.abs(start.X - end.X) + Math.abs(start.Y - end.Y) + 2) * 0.707
		}
	}

	get start()	{
		return this.nodeTiles.start
	}

	get end()	{
		return this.nodeTiles.end
	}
	
	addEdge()	{
		this.graph.addEdge(this.start.id, this.end.id, this, this.oneWay);
	}

	removeEdge(normalize)	{
		this.graph.removeEdge(this.start.id, this.end.id, this.oneWay, normalize);
	}

	split(tile)	{
		if (this.start === tile)	{
			return
		} else if (this.end === tile) {
			return
		} else {
			console.log('Splitting road')
			console.log('Before removing edge:')
			console.log(this.graph.adjList)
			this.removeEdge(false)
			console.log('After removing edge:')
			console.log(this.graph.adjList)
			var tileIdx = this.tiles.indexOf(tile)
			var newTiles = [this.nodeTiles.start].concat(this.tiles.slice(0, tileIdx + 1))
			new Road(this.graph, newTiles, this.oneWay)
			this.nodeTiles.start = this.tiles[tileIdx]
			this.tiles = this.tiles.slice(tileIdx+1)
			this.setLength()
			this.addEdge()
		}
	}

	merge(otherRoad)	{
		console.log('Merging road')
		if (this.nodeTiles.end == otherRoad.nodeTiles.start) {
			this.nodeTiles.end = otherRoad.nodeTiles.end
			this.tiles.push(otherRoad.nodeTiles.start)
			otherRoad.nodeTiles.start.setType('road').setRoad(this)
		} else if (this.nodeTiles.end == otherRoad.nodeTiles.end)	{
			this.nodeTiles.end = otherRoad.nodeTiles.start
			this.tiles.push(otherRoad.nodeTiles.end)
			otherRoad.nodeTiles.end.setType('road').setRoad(this)
		} else if (this.nodeTiles.start == otherRoad.nodeTiles.end) {
			this.nodeTiles.start = otherRoad.nodeTiles.start
			this.tiles.push(otherRoad.nodeTiles.end)
			otherRoad.nodeTiles.end.setType('road').setRoad(this)
		} else if (this.nodeTiles.start == otherRoad.nodeTiles.start) {
			this.nodeTiles.start = otherRoad.nodeTiles.end
			this.tiles.push(otherRoad.nodeTiles.start)
			otherRoad.nodeTiles.start.setType('road').setRoad(this)
		} else {
			return this
		}
		this.tiles.concat(otherRoad.tiles)
		otherRoad.tiles.forEach((tile)=>{
			tile.setRoad(this)
		})
		this.length += otherRoad.length
		return this
	}

	delete()	{
		console.log('Deleting road')
		console.log(this.tiles.length)
		console.log(this.nodeTiles)
		this.tiles.forEach((tile)=>{
			tile.setType('grass')
		})
		console.log(this.nodeTiles)
		if (this.nodeTiles.start.road.length == 1)	{
			this.nodeTiles.start.setType('grass')
		} else {
			this.nodeTiles.start.road.splice(this.nodeTiles.start.road.indexOf(this), 1)
		}
		if (this.nodeTiles.end.road.length == 1) {
			this.nodeTiles.end.setType('grass')
		} else {
			this.nodeTiles.end.road.splice(this.nodeTiles.end.road.indexOf(this), 1)
		}
		this.removeEdge()
	}
}

export {Road, Graph}
