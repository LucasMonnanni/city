import TileMap from '../GameObjects/tileMap'
import { Graph } from '../GameObjects/roadGraph'
import { data } from '../data'

class City extends Phaser.Scene {
	tileMap!: TileMap
	graph!: Graph
	cameraCursor!: {
		W: Phaser.Input.Keyboard.Key,
		S: Phaser.Input.Keyboard.Key,
		A: Phaser.Input.Keyboard.Key,
		D: Phaser.Input.Keyboard.Key
	}
	constructor() {	
		super('City')
	}
	cam!: Phaser.Cameras.Scene2D.Camera
	
	create() {
		this.cameraCursor = this.input.keyboard.addKeys('W,S,A,D');
		this.tileMap = new TileMap(this, 350, 200)
		this.graph = new Graph(this)
		this.cam = this.cameras.main
		this.setWheelListener();
	}
	
	setWheelListener() {
		this.input.on("wheel", (pointer: Phaser.Input.Pointer, gameObjects: any, deltaX: number, deltaY: number, deltaZ: number) => {
			var deltaZoom = 0;
			if (deltaY > 0 && this.cam.zoom > data.cameraMotion.minZoom + 0.1) {
				deltaZoom = -.1;
			}

			if (deltaY < 0 && this.cam.zoom < data.cameraMotion.maxZoom - 0.1) {
				deltaZoom = .1;
			}
			this.cam.setZoom(this.cam.zoom + deltaZoom);
			this.cam.scrollX += (pointer.worldX - this.cam.midPoint.x) * deltaZoom;
			this.cam.scrollY += (pointer.worldY - this.cam.midPoint.y) * deltaZoom;
		});
	}

	update() {
		var pointer = this.input.activePointer
		this.setCamera(pointer)
	}

	setCamera(pointer: Phaser.Input.Pointer)	{
		var edge = this.getCameraInput(pointer)
		if (edge.x || edge.y)	{
			this.moveCamera(edge)
		}
	}

	getCameraInput(pointer : Phaser.Input.Pointer): {x: number, y: number} {
		var edge = {x: 0, y: 0}
		if (pointer.x < data.cameraMotion.edgeWidth || this.cameraCursor.A.isDown){
			edge.x += -1
		}
		if (pointer.x > this.game.config.width - data.cameraMotion.edgeWidth || this.cameraCursor.D.isDown)	{
			edge.x += 1
		}
		if (pointer.y < data.cameraMotion.edgeWidth || this.cameraCursor.W.isDown) {
			edge.y += -1
			console.log('up!')
		}
		if (pointer.y > this.game.config.height - data.cameraMotion.edgeWidth || this.cameraCursor.S.isDown)	{
			edge.y += 1
			console.log('down!')
		}
		return edge
	} 

	moveCamera(edge: {x: number, y: number}) {
		this.cam.scrollX += Math.floor(data.cameraMotion.speed * edge.x / this.cam.zoom)
		this.cam.scrollY += Math.floor(data.cameraMotion.speed * edge.y / this.cam.zoom)
	}
}

export default City