class Menu extends Phaser.Scene {
    constructor() {
        super({key: 'MenuScene'});
    }

    preload() {
        this.load.spritesheet('player', 'img/cat.png', {frameWidth: 117, frameHeight: 147});
        this.load.image('damage', 'img/damage.png');
        this.load.spritesheet('paw', 'img/paw.png', {frameWidth: 50, frameHeight: 64});
    }

    create() {
        console.log(this.scene.key)
        this.switchScene();
        this.addCat();
        this.addStrength();

        this.agility = this.add.text(470, 350, 'Agility:' + Player.agility, {fontSize: '60px', fill: '#cb1414'});
        this.vitality = this.add.text(470, 420, 'Vitality:' + Player.vitality, {fontSize: '60px', fill: '#cb1414'});
        this.points = this.add.text(470, 500, 'Points:' + Player.points, {fontSize: '60px', fill: '#cb1414'});
    }

    updatePoints() {
        this.points.text = 'Points:' + Player.points;
    }

    switchScene() {
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', function (event) {
            console.log('ESC');
            // game.scene.getScene('MenuScene').scene.scene.input.keyboard.removeKey('ESC');
            // game.scene.getScene('GameScene').scene.scene.input.keyboard.addKey('ESC');
            game.scene.switch('MenuScene', 'GameScene');
        });

        this.events.on('sleep', () => {
            console.log('MenuScene slept');
        });

        this.events.on('wake', () => {
            console.log('MenuScene wake');

            this.updatePoints();
        });
    }

    addCat() {
        this.anims.create({
            key: 'menuPlayer',
            frames: this.anims.generateFrameNumbers('player', {frames: [0, 1, 2, 2, 1, 0], end: 0}),
            frameRate: 8,
        });
        this.player = this.physics.add.sprite(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2);
        this.player.preFX.addGlow();
        this.player.play('menuPlayer');
        this.time.addEvent({
            callback: function () {
                this.player.play('menuPlayer');
            },
            callbackScope: this,
            delay: 5000, // 1000 = 1 second
            loop: true
        });
    }

    addStrength() {
        this.add.image(500, 300, 'damage');
        const strength = this.add.text(550, 270, Player.strength, {fontSize: '60px', fill: '#cb1414'});
        const strengthAdd = this.add.image(650, 300, 'paw', 0).setInteractive();
        const strengthAdd2 = this.add.image(650, 300, 'paw', 1).setInteractive();
        strengthAdd2.visible=false;
        strengthAdd.on('pointerdown', function () {
            strengthAdd.visible = false;
            strengthAdd2.visible = true;
            if (Player.points > 0) {
                Player.strength++;
                strength.text = Player.strength + ' +';
                Player.points--;
                this.updatePoints();
            }
        }, this);
        strengthAdd2.on('pointerup', function () {
            strengthAdd.visible = true;
            strengthAdd2.visible = false;
        });
    }
}