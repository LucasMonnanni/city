class RoadState {
	constructor(tile) {
		this.name = 'road'
		this.type = 'asphalt'
		this.tile = tile
	}

	onEnter() {
		this.tile.color('0xDD9999')
	}

	onExit() {}

	onUpdate() {}
}