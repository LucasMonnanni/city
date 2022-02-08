import Tile from './tile.js'

class TileMap {
	constructor(scene, x, y, tileData) {
		this.scene = scene
		this.offsetX = x
		this.offsetY = y
		this.tiles = []
		this.events = new Phaser.Events.EventEmitter()

		this.clicked = false

		if (Object.keys(tileData).length == 0) {
			console.log('No tile data provided')
			this.tileData = {
				size: 64,
				rows: []
			}
			// populate tileData
			for (let j = 0; j < 10; j++) {
				this.tileData.rows[j] = []
				this.height = j + 1
				for (let i = 0; i < 15; i++) {
					if (false) {
						// if (j>3 && j< 7 && j%2 == 0 && i%2 == 0 && i>4 && i<13)	{
						this.tileData.rows[j][i] = { type: 'solid', height: 24, id: '0xDD9999' }
					} else {
						// this.tileData.rows[j][i] = (j + i) % 2 == 0 ? { type: 'flat', id: '0x9FDF61' } : { type: 'flat', id: '0xFFFFFF' }
						this.tileData.rows[j][i] = {type: 'grass'}
						this.width = i + 1
					}
				}
			}
		} else {
			this.tileData = tileData
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

	tileToSceneCoords(X, Y) {
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

	onTileClick(tile, pointer) {
		this.events.emit('tileClick', tile, pointer)
	}

	onTileHover(tile) {
		this.events.emit('tileHover', tile)
	}
}

export default TileMap