import CreateScene from './createScene'
import {Road, Graph} from '../GameObjects/roadGraph'
import { Tile } from '../GameObjects/tile'

type RoadType = 'road' | 'avenue' 

class CreateRoad extends CreateScene {
	oneWay: boolean
	graph!: Graph


	constructor() {
		super('CreateRoad', 0x222222)
		this.oneWay = false
		this.clicked = false
	}
	
	create() {
		this.graph = this.scene.get('City').graph
		CreateScene.prototype.create.call(this)	
	}

	update()	{
		if (this.clicked) {
			this.previousSelection = this.selection
			this.selection = []
			var pointerTan = (this.drag.over.Y - this.drag.start.Y) / (this.drag.over.X - this.drag.start.X)
			if (!pointerTan)	{
				pointerTan = 0
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
			// get next tile, check if road, if road, add to selection
			this.colorTiles()
		}
	}

	createSelectionObject() {
		var nodes: number[] = []
		this.selection.forEach((element, idx, array) => {
			if (element.type == 'road') {
				element.road.split(element)
				nodes.push(idx)
			} else if (idx == 0 || idx == this.selection.length - 1) {
				nodes.push(idx)
			}
		})
		for (let i = 1; i < nodes.length; i++) {
			console.log('Creating road with nodes:')
			console.log(nodes)
			new Road(this.graph, this.selection.slice(nodes[i-1], nodes[i]+1), this.oneWay)
		}
	}
	
}

export default CreateRoad