import { Tile } from "../GameObjects/tile"
import { TileMap } from "../GameObjects/tileMap"

abstract class CreateScene extends Phaser.Scene {
	selection: Tile[] = []
	previousSelection: Tile[] = []
	drag!: {
		start: Tile,
		over: Tile

	}
	selectionColor: number
	tileMap!: TileMap
	clicked: boolean
	abstract createSelectionObject(): void
	declare key: string

	constructor(key: string, selectionColor: number) {
		super({
			key: key,
			active: false
		})
		this.selectionColor = selectionColor
		this.selection = []
		this.previousSelection = []
		this.clicked = false
	}

	create() {
		this.tileMap = this.scene.get('City').tileMap
		this.tileMap.events.on('tileClick', this.onClick, this)
		this.tileMap.events.on('tileHover', (tile: Tile)=> {
			if (this.clicked) {
				this.drag.over = tile
			}
		}, this)
	}
	
	onClick(tile: Tile, pointer: Phaser.Input.Pointer) {
		if (!this.clicked) {
			this.clicked = true
			this.drag = {
				start: tile,
				over: tile
			}
		} else {
			this.clicked = false
			this.createSelectionObject()
			this.tileMap.events.removeListener('tileClick', this.onClick, this)
			this.scene.stop(this.key)
		}
	}

	colorTiles() {
		this.previousSelection.forEach(element => {
			element.reset()
		})
		this.selection.forEach(element => {
			element.paint(this.selectionColor)
		})
	}

}

export default CreateScene