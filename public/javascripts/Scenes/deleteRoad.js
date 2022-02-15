
class DeleteRoad extends Phaser.Scene {
	constructor() {
		super('DeleteRoad')
	}

	create() {
		this.graph = this.scene.get('City').graph
		this.tileMap = this.scene.get('City').tileMap
		this.selectionColor = 0xDD0000
		this.previousSelection = []
		this.selection = []

		this.tileMap.events.on('tileClick', this.onClick, this)
		this.tileMap.events.on('tileHover', this.onHover, this)
	}

	update() {
		this.previousSelection.forEach(tile => {
			tile.reset()
		})
		this.selection.forEach(tile => {
			tile.paint(this.selectionColor)
		})
		this.previousSelection = this.selection
	}

	onHover(tile) {
		if (tile.type == 'road') {
			this.selection = [...tile.road.tiles]
			for (var key in tile.road.nodeTiles) {
				if (tile.road.nodeTiles[key].road.length == 1) {
					this.selection.push(tile.road.nodeTiles[key])
				}
			}
		}
	}

	onClick(tile) {
		if (tile.type == 'road') {
			tile.road.delete()
			this.tileMap.events.removeListener('tileClick', this.onClick, this)
			this.tileMap.events.removeListener('tileHover', this.onHover, this)
			this.scene.stop(this.key)
		}
	}
}

export default DeleteRoad