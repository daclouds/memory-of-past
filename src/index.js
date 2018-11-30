import StartScene from './scene/start.scene';
import ControlsScene from './scene/controls.scene';
import StageScene from './scene/stage.scene';
import StageClearScene from './scene/stage-clear.scene';

var config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 900,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 150 },
          debug: false
      }
  },
  scene: [StartScene, ControlsScene, StageScene, StageClearScene]
};

new Phaser.Game(config);
