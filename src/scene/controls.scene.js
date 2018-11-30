import 'phaser';

class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'controls', active: false });
  }

  preload () {
    this.load.image('controls_x', 'assets/controls/controls_x.png');
    // this.load.image('controls', 'assets/controls/controls.png');
    // this.load.image('start-game', 'assets/controls/start-game.png');
  }

  create () {
    this.add.image(800, 450, 'controls_x');
    // this.add.image(1200, 450, 'controls');
    // this.add.image(1300, 550, 'start-game');

    this.input.keyboard.once('keydown', (event) => {
      this.children.removeAll();

      this.scene.launch('stage');
    });
  }
}

export default StartScene;