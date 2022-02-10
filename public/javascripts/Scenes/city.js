import TileMap from '../GameObjects/tileMap.js'
import { Graph } from '../GameObjects/roadGraph.js'
import data from '../data.js'

class City extends Phaser.Scene {
	constructor() {	
		super('City')
	}
	
	create(tileData = {}) {
		console.log(tileData)
		this.tileMap = new TileMap(this, 350, 200, tileData)
		this.graph = new Graph(this)
		this.cameraCursor = this.input.keyboard.addKeys('W,S,A,D');
		this.cam = this.cameras.main
		this.setWheelListener();
	}
	
	setWheelListener() {
		this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
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

	setCamera(pointer)	{
		var edge = this.getCameraInput(pointer)
		if (edge.x || edge.y)	{
			this.moveCamera(edge)
		}
	}

	getCameraInput(pointer)	{
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

	moveCamera(edge)	{
		this.cam.scrollX += Math.floor(data.cameraMotion.speed * edge.x / this.cam.zoom)
		this.cam.scrollY += Math.floor(data.cameraMotion.speed * edge.y / this.cam.zoom)
	}
}

export default City