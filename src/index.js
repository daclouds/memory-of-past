import DefaultScene from './default.scene';

var config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 900,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: DefaultScene
};

function gotoNextStage() {
    game.scene.scenes[0].scene.restart();
}
var game = new Phaser.Game(config);
