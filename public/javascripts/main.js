import City from './Scenes/city.js'
import UI from './Scenes/ui.js'
import CreateRoad from './Scenes/createRoad.js'
import CreateRoadGrid from './Scenes/createRoadGrid.js'
import CreateZone from './Scenes/createZone.js'
import CreatePath from './Scenes/createPath.js'

var config = {
	type: Phaser.AUTO,
	width: 1200,
	height: 600,
	scene: [
		City,
		UI,
		CreateRoad,
		CreateRoadGrid,
		CreateZone,
		CreatePath
	],
	parent: 'juego'
}

window.game = new Phaser.Game(config);
