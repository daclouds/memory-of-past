import 'phaser';

class StageScene extends Phaser.Scene {
    constructor() {
        super({ key: 'stage', active: false });
        this.gameOver = false;
        this.currentStage = 1;
    }

    preload () {
        this.score = this.score || 0;
        this.gameOver = false;

        Array.from({length: 9}, (_, i) => {
            this.load.image(`stage${i}`, `assets/stages/stage${i}.png`);
            this.load.image(`ground${i}`, `assets/stages/stage${i}ground.png`);
        });

        this.load.image('polaroid', 'assets/stages/polaroid.png');
        
        this.load.spritesheet('dude', 'assets/stages/dude.png', { frameWidth: 200, frameHeight: 300 });
        this.load.spritesheet('enemy', 'assets/stages/enemy.png', { frameWidth: 200, frameHeight: 300 });

        this.load.image('game-over', 'assets/gameover/game-over.png');
        this.load.image('press-any-key-to-continue', 'assets/gameover/press-any-key-to-continue.png');
        this.load.image('backdrop', 'assets/backdrop.png');

        this.load.image('score_text', 'assets/score/score_text.png');
        this.load.image('countdown', 'assets/score/countdown.png');

        this.load.image('gaugebar', 'assets/score/gaugebar.png');
        this.load.image('gauge_fill', 'assets/score/gauge_fill.png');
    }

    create () {
        this.count = 10;
        this.gauge = 100;

        //  A simple background for our game
        this.add.image(800, 450, `stage${this.currentStage}`);

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        this.platforms.create(800, 864, `ground${this.currentStage}`).setScale(1).refreshBody();

        // The player and its settings
        this.player = this.physics.add.sprite(200, 550, 'dude');

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.enemy = this.physics.add.sprite(1400, 550, 'enemy');

        //  Player physics properties. Give the little guy a slight bounce.
        this.enemy.setBounce(0.2);
        this.enemy.setCollideWorldBounds(true);

        if (!this.anims.anims.size) {
            //  Our player animations, turning, walking left and walking right.
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'turn',
                frames: [ { key: 'dude', frame: 4 } ],
                frameRate: 20
            });

            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });

            // enemy player animations, turning, walking left and walking right.
            this.anims.create({
                key: 'eleft',
                frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'eturn',
                frames: [ { key: 'enemy', frame: 4 } ],
                frameRate: 20
            });

            this.anims.create({
                key: 'eright',
                frames: this.anims.generateFrameNumbers('enemy', { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        }
        this.polaroid = this.add.image(800, 520, 'polaroid');
        this.polaroid.setScale(1 - 0.05 * this.currentStage);
        // this.polaroid.setAlpha(0.5);

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        this.bombs = this.physics.add.group();

        //  The score
        this.add.image(128, 64, 'score_text');
        this.scoreText = this.add.text(120, 54, `${this.score}`, { fontSize: '40px', fill: '#000' });
        this.add.image(780, 96, 'countdown');
        this.countText = this.add.text(750, 82, '10', { fontSize: '60px', fill: '#000' });

        this.add.image(128, 200, 'gaugebar');
        this.gaugeFill = this.add.image(128, 200, 'gauge_fill');

        //  Collide the player and the stars with the platforms
        this.physics.add.collider(this.player, this.platforms);
        // this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);

        //  Collide the enemy and the stars with the platforms
        this.physics.add.collider(this.enemy, this.platforms);

        this.physics.add.collider(this.player, this.enemy, this.hitEnemy, null, this);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        // this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        this.secondInterval = setInterval(() => this.countdown(), 1000);
    }

    update () {
        if (this.gameOver) {
            return;
        }

        if (this.count === 0) {
            this.count = 600;
            this.countText.setText('');
            this.clearSecondInterval();
            this.checkPicture(this.player, this.polaroid);
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }

        this.gaugeFill.setScale(this.gauge / 100, 1);
    }

    checkPicture (player, polaroid) {
        const intersect = Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), polaroid.getBounds());
        if (intersect && this.currentStage < 9) {
            this.clearSecondInterval();
            this.currentStage += 1;

            this.score += 100;
            this.scoreText.setText(this.score);

            this.scene.launch('stage-clear');
        } else {
            const backdrop = this.add.image(800, 450, 'backdrop');
            backdrop.alpha = 0.9;
            this.add.image(800, 250, 'game-over');
            this.add.image(800, 800, 'press-any-key-to-continue');
            this.countText.setText('');
            this.gameOver = true;
            this.currentStage = 0;
            this.input.keyboard.once('keydown', (event) => {
                this.children.removeAll();
                this.scene.launch('start');
            });
        }
    }

    countdown () {
        if (this.count <= 0) {
            this.clearSecondInterval();
            return;      
        };
        this.count -= 1;
        this.countText.setText(this.count);

        const x = Math.abs(this.player.x - this.enemy.x) > 200 && this.player.x < this.enemy.x ? -160 : 160;
        const y = Math.round(Phaser.Math.FloatBetween(0.0, 1.0)) * -330;
        if (x >= 0) {
            this.enemy.anims.play('eright', true);
        } else {
            this.enemy.anims.play('eleft', true);
        }
        this.enemy.setVelocityX(x);
        if (y < 0 && this.enemy.body.touching.down) {
            this.enemy.setVelocityY(y);
        }

        if (this.gauge < 100) this.gauge += 2;
    }

    clearSecondInterval () {
        if (this.secondInterval) {
            clearInterval(this.secondInterval);
            this.secondInterval = undefined;
        }
    }

    hitBomb (player, bomb) {
        this.physics.pause();

        this.player.setTint(0xff0000);

        this.player.anims.play('turn');

        this.gameOver = true;
    }

    hitEnemy (player, enemy) {
        const isDefense = this.cursors.space.isDown && this.gauge >= 60;
        if (isDefense) this.gauge -= 35;
        const playerMoveAmount = isDefense ? 160 : 320;
        const enemyMoveAmount = 320;
        if(enemy.body.touching.left) {
            if (isDefense) {
                enemy.body.position.x += enemyMoveAmount;
            }
            player.body.position.x += playerMoveAmount * -1;
        } else if (enemy.body.touching.right) {
            if (isDefense) {
                enemy.body.position.x += enemyMoveAmount * -1;
            }
            player.body.position.x += playerMoveAmount;
        }
    }
}

export default StageScene;