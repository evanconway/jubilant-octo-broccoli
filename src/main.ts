import * as Phaser from 'phaser';

import GameScene from './scenes/GameScene';
import InventoryScene from './scenes/InventoryScene';
import LoadingScene from './scenes/LoadingScene';
import MenuScene from './scenes/MenuScene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',

  type: Phaser.AUTO,

  width: window.innerWidth,
  height: window.innerHeight,

  scene:  GameScene,

  parent: 'game',
  backgroundColor: '#000000',
};

export const game = new Phaser.Game(gameConfig);
