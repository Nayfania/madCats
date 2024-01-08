class Menu extends Phaser.Scene {

    cat;

    points;

    constructor() {
        super({key: 'MenuScene'});
    }

    preload() {
        this.load.spritesheet('player', 'img/cat.png', {frameWidth: 117, frameHeight: 147});
        this.load.image('damage', 'img/damage.png');
        this.load.image('agility', 'img/agility.png');
        this.load.image('vitality', 'img/vitality.png');
        this.load.spritesheet('paw', 'img/paw.png', {frameWidth: 50, frameHeight: 64});
    }

    create() {
        console.log(this.scene.key)
        this.switchScene();
        this.addCat();
        this.addStrength();
        this.addAgility();
        this.addVitality();

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
        this.cat = this.physics.add.sprite(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2);
        this.cat.preFX.addGlow();
        this.cat.play('menuPlayer');
        this.time.addEvent({
            callback: function () {
                this.cat.play('menuPlayer');
            },
            callbackScope: this,
            delay: 5000, // 1000 = 1 second
            loop: true
        });
    }

    addStrength() {
        this.add.image(500, 300, 'damage');
        const strength = this.add.text(550, 270, Player.strength, {fontSize: '60px', fill: '#cb1414'});

        this.addPaw(650, 300, function () {
            Player.strength++;
            strength.text = Player.strength;
        });
    }

    addAgility() {
        this.add.image(500, 370, 'agility');
        const agility = this.add.text(550, 340, Player.agility, {fontSize: '60px', fill: '#cb1414'});

        this.addPaw(650, 370, function () {
            Player.agility++;
            agility.text = Player.agility;
        });
    }

    addVitality() {
        this.add.image(500, 440, 'vitality');
        const vitality = this.add.text(550, 410, Player.vitality, {fontSize: '60px', fill: '#cb1414'});

        this.addPaw(650, 440, function () {
            Player.vitality++;
            vitality.text = Player.vitality;
        });
    }

    addPaw(x, y, func) {
        const paw = this.add.image(x, y, 'paw', 0).setInteractive();
        const paw2 = this.add.image(x, y, 'paw', 1).setInteractive();

        paw2.visible=false;

        paw.on('pointerdown', function () {
            paw.visible = false;
            paw2.visible = true;
            if (Player.points > 0) {
                func();
                Player.points--;
                this.updatePoints();
            }
        }, this);

        paw2.on('pointerup', function () {
            paw.visible = true;
            paw2.visible = false;
        });
    }
}