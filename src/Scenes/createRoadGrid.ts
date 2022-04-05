import CreateScene from "./createScene";
import {Road, Graph} from "../GameObjects/roadGraph"
import {data} from "../data";

class CreateRoadGrid extends CreateScene	{
	oneWay: boolean
	step!: number
	nodes!: string[][]
	graph!: Graph
	constructor() {
		super('CreateRoadGrid', 0x222222)
		this.oneWay = false
	}

	create() {
		CreateScene.prototype.create.call(this)
		this.graph = this.scene.get('City').graph
		this.step = data.roads.gridSize
	}

	update()	{
		if (this.clicked) {
			this.previousSelection = this.selection
			this.selection = []
			this.nodes = []
			var direction = [0, 0]
			var xMin, xMax, yMin, yMax
			if (this.drag.start.X > this.drag.over.X) {
				xMin = this.drag.over.X
				xMax = this.drag.start.X
				direction[0] = -1
			} else {
				xMin = this.drag.start.X
				xMax = this.drag.over.X
				direction[0] = 1
			}
			if (this.drag.start.Y > this.drag.over.Y) {
				yMin = this.drag.over.Y
				yMax = this.drag.start.Y
				direction[1] = -1
			} else {
				yMin = this.drag.start.Y
				yMax = this.drag.over.Y
				direction[1] = 1
			}
			for (var y = this.drag.start.Y, i = 0; y * direction[1] <= this.drag.over.Y * direction[1]; y += this.step * direction[1], i++) {
				this.nodes[i] = []
				for (var x = xMin; x <= xMax; x += 1) {
					this.selection.push(this.tileMap.tiles[y][x])
					if (x % this.step == 0) {
						this.nodes[i].push(this.tileMap.tiles[y][x].id)
					}
				}
			}
			for (var x = this.drag.start.X; x * direction[0] <= this.drag.over.X * direction[0]; x += this.step * direction[0]) {
				for (var y = yMin; y <= yMax; y += 1) {
					this.selection.push(this.tileMap.tiles[y][x])
				}
			}
			this.colorTiles()
		}
	}

	createSelectionObject() {
		
	}
}

export default CreateRoadGrid