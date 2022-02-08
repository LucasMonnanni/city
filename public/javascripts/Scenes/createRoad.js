import CreateScene from './createScene.js'
import {Road} from '../GameObjects/roadGraph.js'

class RoadTypes  {
	static Road = new RoadTypes('Road')
	constructor(name) {
		this.name = name
	}
}

class CreateRoad extends CreateScene {
	constructor() {
		super('CreateRoad', 0x222222)
		this.tileType = 'road'
		this.oneWay = false
	}

	create() {
		CreateScene.prototype.create.call(this)
		this.graph = this.scene.get('City').graph
	}

	update()	{
		if (this.clicked) {
			this.previousSelection = this.selection
			this.selection = []
			var pointerTan = (this.drag.over.Y - this.drag.start.Y) / (this.drag.over.X - this.drag.start.X)
			if (pointerTan == NaN)	{
				pointerTan = 1000
			}
			var pointerAngle = Math.atan(pointerTan)
			var selectionLength = Math.max(Math.abs(this.drag.over.X - this.drag.start.X), Math.abs(this.drag.over.Y - this.drag.start.Y)) + 1
			var direction = []
			if (pointerAngle < -Math.PI * 3 / 8) {
				direction = [0, 1]
			} else if (pointerAngle < -Math.PI / 8) {
				direction = [1, 1]
			} else if (pointerAngle < Math.PI / 8) {
				direction = [1, 0]
			} else if (pointerAngle < Math.PI * 3 / 8) {
				direction = [1, 1]
			} else {
				direction = [0, 1]
			}
			var signX = this.drag.over.X > this.drag.start.X ? 1 : -1
			var signY = this.drag.over.Y > this.drag.start.Y ? 1 : -1
			// console.log(selectionLength)
			// console.log(direction)
			// console.log(signX, signY)
			for (let i = 0; i < selectionLength; i++) {
				var X = signX * i * direction[0] + this.drag.start.X
				var Y = signY * i * direction[1] + this.drag.start.Y
				if (X < this.tileMap.width && X > -1 && Y > -1 && Y < this.tileMap.height) {
					this.selection.push(this.tileMap.tiles[Y][X])
				}
			}
			this.colorTiles()
		}
	}

	createSelectionObject() {
		var road = new Road(this.graph, this.selection[0], this.selection[this.selection.length-1], this.oneWay)
		this.selection.forEach(element => {
			element.setType(this.tileType)
		})
	}
	
}

export default CreateRoad