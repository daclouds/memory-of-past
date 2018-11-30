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

var game = new Phaser.Game(config);
