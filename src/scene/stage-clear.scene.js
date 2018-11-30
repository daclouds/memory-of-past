import 'phaser';

class StageClearScene extends Phaser.Scene {
  constructor() {
    super({ key: 'stage-clear', active: false });
  }

  preload () {
    this.load.image('backdrop', 'assets/backdrop.png');

    this.load.image('clear-frame', 'assets/stage-clear/clear-frame.png');
    this.load.image('stage-clear', 'assets/stage-clear/stage-clear.png');
  }

  create () {
    this.add.image(800, 450, 'backdrop');
    this.add.image(800, 520, 'clear-frame');
    this.add.image(800, 150, 'stage-clear');

    // this.input.keyboard.once('keydown', (event) => {
    //   this.children.removeAll();

    //   this.scene.launch('stage');
    // });

    this.time.addEvent({ delay: 2000, callback: () => {
      this.children.removeAll();
      this.scene.launch('stage');
  }, callbackScope: this });
  }
}

export default StageClearScene;