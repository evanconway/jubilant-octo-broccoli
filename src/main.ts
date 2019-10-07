import * as Phaser from 'phaser';

import GameScene from './scenes/GameScene';
import InventoryScene from './scenes/InventoryScene';
import LoadingScene from './scenes/LoadingScene';
import MenuScene from './scenes/MenuScene';
import ReadoutScene from './scenes/ReadoutScene';
import WinScene from './scenes/WinScene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'n o t h i n g',

  type: Phaser.AUTO,

  width: window.innerWidth,
  height: window.innerHeight,
 
  scene:  [MenuScene, GameScene, InventoryScene, LoadingScene, ReadoutScene, WinScene],

  parent: 'game',
  backgroundColor: '#000000',
};

export const game = new Phaser.Game(gameConfig);
