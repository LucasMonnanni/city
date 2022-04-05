import City from '../Scenes/city'
import {Tile} from './tile'

export class TileMap {
	scene: City
	offsetX: number
	offsetY: number
	width: number
	height: number
	tileData: {size: number, rows: any[][]}
	tiles: Tile[][]
	events: Phaser.Events.EventEmitter
	clicked: boolean
	constructor(scene: City, x: number, y: number, tileData?: {size: number, rows: any[][]}) {
		this.scene = scene
		this.offsetX = x
		this.offsetY = y
		this.tiles = []
		this.events = new Phaser.Events.EventEmitter()

		this.clicked = false

		if (!tileData) {
			console.log('No tile data provided')
			this.width = 15
			this.height = 10
			this.tileData = {
				size: 64,
				rows: [...Array(this.height)].map(x => Array(this.width))
			}
			// populate tileData
			for (let j = 0; j < this.height; j++) {
				this.tileData.rows[j] = []
				for (let i = 0; i < this.width; i++) {
					this.tileData.rows[j][i] = {type: 'grass'}
				}
			}
		} else {
			this.tileData = tileData
			this.width = tileData.rows[0].length
			this.height = tileData.rows.length
		}
		// create tiles from tileData
		for (let j = 0; j < this.tileData.rows.length; j++) {
			this.tiles.push([])
			const row = this.tiles[j]
			for (let i = 0; i < this.tileData.rows[j].length; i++) {
				row.push(
					new Tile(this, this.tileData.size, i, j, this.tileData.rows[j][i])
				)
			}
		}
		
	}

	tileToSceneCoords(X: number, Y:number) {
		var x = (X - Y) * this.tileData.size / 2 + this.offsetX
		var y = (X + Y) * this.tileData.size / 4 + this.offsetY
		return [x, y]
	}

	updateTiles() {
		for (let j = 0; j < this.tiles.length; j++) {
			const row = this.tiles[j]
			for (let i = 0; i < row.length; i++) {
				row[i].update()
			}
		}
	}

	onTileClick(tile: Tile, pointer: Phaser.Input.Pointer) {
		console.log('tileClicked: ' + tile.X + ', ' + tile.Y + ' - ' + tile.id)
		this.events.emit('tileClick', tile, pointer)
	}

	onTileHover(tile: Tile) {
		this.events.emit('tileHover', tile)
	}
}

export default TileMap