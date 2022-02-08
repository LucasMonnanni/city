class CreateScene extends Phaser.Scene {
	constructor(key, selectionColor) {
		super({
			key: key,
			active: false
		})
		this.selectionColor = selectionColor
		this.selection = []
		this.previousSelection = []
	}

	create() {
		this.tileMap = this.scene.get('City').tileMap
		this.clicked = false
		this.drag = {}
		this.tileMap.events.on('tileClick', this.onClick, this)
		this.tileMap.events.on('tileHover', (tile)=> {
			this.drag.over = tile
		}, this)
	}
	
	onClick(tile, pointer) {
		console.log('tileClicked: ' + tile.X + ', ' + tile.Y)
		if (!this.clicked) {
			this.clicked = true
			this.drag = {
				start: tile,
				over: tile,
				end: tile,
				pointer: pointer
			}
			console.log('Drag start set')
			console.log(tile.x, tile.y)
			console.log(pointer.worldX, pointer.worldY)
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