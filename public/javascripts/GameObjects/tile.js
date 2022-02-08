class Tile {
	static colors = {
		grass: 0x9FDF61,
		road: 0x222222,
		zone: {
			residential: '#00FF00',
			commercial: '#0000FF',
			industrial: '#AAAA00',
		}
	}
	constructor(tileMap, size, X, Y, tileData) {
		this.tileMap = tileMap
		this.scene = tileMap.scene
		this.type = tileData.type
		this.color = Tile.colors[tileData.type]
		this.hoverColor = this.color - 0x222222
		const halfSize = size / 2
		this.basePoints = [
			{ x: 0, y: -halfSize / 2 },
			{ x: halfSize, y: 0 },
			{ x: 0, y: halfSize / 2 },
			{ x: -halfSize, y: 0 },
		]
		this.X = X
		this.Y = Y
		this.id = X + Y * tileMap.width
		const coords = tileMap.tileToSceneCoords(X, Y)
		this.x = coords[0]
		this.y = coords[1]
		
		this.setPolyPoints(tileData, halfSize)
		this.setPolySprite()

		this.sprite.on('pointerdown', this.onClick, this)
		this.sprite.on('pointerover', this.onHover, this)
		this.sprite.on('pointerout', this.onBlur, this)
	}


	setPolySprite() {
		this.sprite = this.scene.add.polygon(this.x, this.y, this.points, this.color, 1).setStrokeStyle(1, 0xDDDDDD)
		this.sprite.setInteractive(new Phaser.Geom.Polygon(this.basePoints), Phaser.Geom.Polygon.Contains)
			.setDisplayOrigin(0, 0)
	}

	setPolyPoints(tileData, halfSize) {
			this.points = this.basePoints
			tileData.height = 0
	}

	onClick(pointer) {
		this.tileMap.onTileClick(this, pointer)
	}

	onHover() {
		this.sprite.setFillStyle(this.hoverColor)
		this.tileMap.onTileHover(this)
	}

	onBlur() {
		this.sprite.setFillStyle(this.color)
	}

	paint(color) {
		this.sprite.setFillStyle(color)
	}

	setType(type) {
		this.type = type
		this.color = Tile.colors[type]
		this.reset()
	}

	reset() {
		this.sprite.setFillStyle(this.color)
	}

}

export default Tile