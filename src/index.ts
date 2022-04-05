import Phaser from 'phaser';
import config from './config';
import City from './Scenes/city'
import UI from './Scenes/ui'
import CreateRoad from './Scenes/createRoad'
import CreateRoadGrid from './Scenes/createRoadGrid'
import CreateZone from './Scenes/createZone'
import CreatePath from './Scenes/createPath'  

window.game = new Phaser.Game(
  Object.assign(config, {
    scene: [
      City,
      UI,
      CreateRoad,
      CreateRoadGrid,
      CreateZone,
      CreatePath
    ],
  })
);
