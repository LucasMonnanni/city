import City from './Scenes/city.js'
import CreateRoad from './Scenes/createRoad.js'
import UI from './Scenes/ui.js'
import CreateZone from './Scenes/createZone.js'

var config = {
	type: Phaser.AUTO,
	width: 1200,
	height: 600,
	scene: [
		City,
		UI,
		CreateRoad,
		CreateZone
	],
	parent: 'juego'
}

window.game = new Phaser.Game(config);
