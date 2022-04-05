import City from "../Scenes/city"
import { Road } from "./roadGraph"
import { TileMap } from './tileMap'

type tileType = 'grass' | 'road' | 'roadNode'
type Point = { x: number, y: number }


export class Tile {
	tileMap: TileMap
	scene: City
	type: tileType
	color: number
	hoverColor: number
	basePoints: Point[] = []
	points: Point[] = []
	id: string
	x: number
	y: number
	X: number
	Y: number
	sprite: Phaser.GameObjects.Polygon
	text: Phaser.GameObjects.Text
	road: Road | Road[] | null

	static colors: {[key in tileType]: number} = {
		grass: 0x9FDF61,
		road: 0x222222,
		roadNode: 0x000000
	} 
	constructor(tileMap: TileMap, size: number, X: number, Y: number, tileData: {type: tileType, height: number}) {
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
		this.id = (X + Y * tileMap.width).toString()
		const coords = tileMap.tileToSceneCoords(X, Y)
		this.x = coords[0]
		this.y = coords[1]
		
		this.setPolyPoints()
		this.sprite = this.makePolySprite()
		this.road = null

		this.sprite.on('pointerdown', this.onClick, this)
		this.sprite.on('pointerover', this.onHover, this)
		this.sprite.on('pointerout', this.onBlur, this)
		this.text = this.scene.add.text(this.x, this.y, this.id, {
			fontFamily: 'Arial',
			fontSize: '12px',
			color: '#FFFFFF',
		})
		this.text.setOrigin(0.5, 0.5)
		this.text.setDepth(1)
	}


	makePolySprite(): Phaser.GameObjects.Polygon {
		const sprite = this.scene.add.polygon(this.x, this.y, this.points, this.color, 1).setStrokeStyle(1, 0xDDDDDD)
		sprite.setInteractive(new Phaser.Geom.Polygon(this.basePoints), Phaser.Geom.Polygon.Contains)
			.setDisplayOrigin(0, 0)
		return sprite
	}

	setPolyPoints() {
			this.points = this.basePoints
	}

	onClick(pointer: Phaser.Input.Pointer) {
		this.tileMap.onTileClick(this, pointer)
	}

	onHover() {
		this.sprite.setFillStyle(this.hoverColor)
		this.tileMap.onTileHover(this)
	}

	onBlur() {
		this.sprite.setFillStyle(this.color)
	}

	paint(color: number) {
		this.sprite.setFillStyle(color)
	}

	setType(type: tileType) {
		if (this.type != type){
			this.type = type
			this.color = Tile.colors[type]
			this.hoverColor = this.color - 0x222222
			switch (type) {
				case 'road':
					this.road = null
					break
				case 'grass':
					this.road = null
					break
				case 'roadNode':
					this.road = []
					break
			}
			this.reset()
		}
		return this
	}

	setRoad(road: Road) {
		switch (this.type) {
			case 'road':
				this.road = road
				break
			case 'roadNode':
				if (this.road instanceof Array) {
					this.road.push(road)
				} else {
					this.road = [road]
				}
				break
			default:
				break
		}
		return this
	}

	reset() {
		this.sprite.setFillStyle(this.color)
		return this
	}

	update()	{

	}

}

export default Tile