import CreateScene from "./createScene.js";
import data from "../data.js";

class CreateRoadGrid extends CreateScene	{
	constructor() {
		super('CreateRoadGrid', 0x222222)
		this.tileType = 'road'
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
			// var remainderX = (xMax - xMin) % this.step
			// var remainderY = (yMax - yMin) % this.step
			// var firstStepX = remainderX > Math.floor(this.step/2) ? remainderX : this.step + remainderX
			// var firstStepY = remainderY > Math.floor(this.step/2) ? remainderY : this.step + remainderY
			// var xs = [this.drag.start.X, this.drag.start.X + firstStepX * direction[0]]
			// var ys = [this.drag.start.Y, this.drag.start.Y + firstStepY * direction[1]]
			// console.log(remainderX, remainderY)
			// while (xs[xs.length-1] < this.xMax) {
			// 	xs.push(xs[xs.length - 1] + this.step * direction[0])
			// } 
			// while (ys[ys.length - 1] < this.yMax) {
			// 	ys.push(ys[ys.length-1] + this.step * direction[1])
			// }
			// xs.forEach(x => {
			// 	for (var y = yMin; y <= yMax; y += 1) {
			// 		this.selection.push(this.tileMap.tiles[y][x])
			// 	}
			// })
			// ys.forEach(y => {
			// 	for (var x = xMin; x <= xMax; x += 1) {
			// 		this.selection.push(this.tileMap.tiles[y][x])
			// 	}
			// })
			for (var x = this.drag.start.X; x * direction[0] <= this.drag.over.X * direction[0]; x += this.step * direction[0]) {
				for (var y = yMin; y <= yMax; y += 1) {
					this.selection.push(this.tileMap.tiles[y][x])
				}
			}
			for (var y = this.drag.start.Y; y * direction[1] <= this.drag.over.Y * direction[1]; y += this.step * direction[1]) {
				for (var x = xMin; x <= xMax; x += 1) {
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