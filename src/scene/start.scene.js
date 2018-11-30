import 'phaser';

class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'start', active: false });
  }

  preload () {
    this.load.image('stagemain', 'assets/start/stagemain.png');
    this.load.image('start', 'assets/start/start.png');
    // this.load.image('controls', 'assets/start/controls.png');
  }

  create () {
    this.add.image(800, 450, 'stagemain');
    this.add.image(1200, 450, 'start');
    // this.add.image(1300, 550, 'controls');

    this.input.keyboard.once('keydown', (event) => {
      this.children.removeAll();

      this.scene.launch('controls');
    });
  }
}

export default StartScene;