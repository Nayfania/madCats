class Menu extends Phaser.Scene {

    cat;

    health;
    damage;
    speed;
    attackSpeed;
    level;
    paws = [];
    skillManager;

    strength;
    vitality;
    dexterity;
    agility;

    constructor() {
        super({key: 'MenuScene'});
    }

    preload() {
        this.load.scenePlugin('rexuiplugin', '/dist/rexuiplugin.js', 'rexUI', 'rexUI');

        this.load.spritesheet('player', 'img/cat.png', {frameWidth: 117, frameHeight: 147});
        this.load.spritesheet('player2', 'img/cat2.png', {frameWidth: 117, frameHeight: 147});
        this.load.image('damage', 'img/damage.png');
        this.load.image('health', 'img/health.png');
        this.load.image('speed', 'img/speed.jpg');
        this.load.image('attackSpeed', 'img/attackSpeed.jpg');
        this.load.image('strength', 'img/strength.png');
        this.load.image('agility', 'img/agility.png');
        this.load.image('vitality', 'img/vitality.png');
        this.load.image('dexterity', 'img/dexterity.png');
        this.load.image('logo', 'img/logo.jpg');
        this.load.image('coin', 'img/coin.jpg');
        this.load.spritesheet('paw', 'img/paw.png', {frameWidth: 50, frameHeight: 64});

        this.load.image('fatty', 'img/icons/fatty.png');
        this.load.image('strong_paw', 'img/icons/strong_paw.png');
    }

    create() {
        console.log(this.scene.key)
        this.switchScene();
        this.addCat();

        this.add.image(600, 70, 'logo');

        var test = this.add.graphics();
        test.lineStyle(2, 0x777777, 0.2);
        test.lineBetween(470, 235, 676, 235).setDepth(100);
        test.lineBetween(470, 335, 590, 335).setDepth(100);
        test.lineBetween(470, 405, 590, 405).setDepth(100);
        test.lineBetween(470, 475, 590, 475).setDepth(100);

        test.lineBetween(830, 180, 830, 230).setDepth(100);
        test.lineBetween(1000, 180, 1000, 230).setDepth(100);

        this.addHealth();
        this.add.image(720, 200, 'damage');
        this.damage = this.add.text(755, 180, Player.damage(), {fontSize: '40px', fill: '#000000'});

        this.add.image(870, 200, 'speed');
        this.speed = this.add.text(900, 180, Player.speed(), {fontSize: '40px', fill: '#000000'});

        this.add.image(1030, 200, 'attackSpeed');
        this.attackSpeed = this.add.text(1060, 180, Player.attackSpeed() / 1000, {fontSize: '40px', fill: '#000000'});

        this.addStrength();
        this.addAgility();
        this.addVitality();
        this.addDexterity();

        this.add.image(500, 600, 'coin');
        this.coins = this.add.text(540, 580, 'X ' + Player.coins, {fontSize: '40px', fill: '#eed44f'}).setShadow(1, 1);
        this.updatePaws();

        this.level = this.add.text(880, 480, 'LEVEL ' + Player.level, {
            fontSize: '40px',
            // fontStyle: 'strong',
            fill: '#ff8437',
            stroke: '#7c7c7c',
            strokeThickness: 3
        });

        this.skillManager = new SkillManager(this);
        this.addSkillPanel();
    }

    updatePoints() {
        console.log('Menu Scene: updatePoints');
        this.coins.text = 'X ' + Player.coins;
        this.health.text = Player.currentHealth;
        this.damage.text = Player.damage();
        this.speed.text = Player.speed();
        this.attackSpeed.text = Player.attackSpeed() / 1000;
        this.level.text = 'LEVEL ' + Player.level;
        this.updatePaws();
        this.strength.text = Player.strength;
        this.agility.text = Player.agility;
        this.vitality.text = Player.vitality;
        this.dexterity.text = Player.dexterity;
    }

    switchScene() {
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', function (event) {
            if (!Player.needToChooseSkill) {
                game.scene.switch('MenuScene', 'GameScene');
            }
        });

        this.events.on('sleep', () => {
            console.log('MenuScene slept');
        });

        this.events.on('wake', () => {
            console.log('MenuScene wake');
            this.updatePoints();
            this.addSkillPanel();
        });
    }

    addCat() {
        this.anims.create({
            key: 'menuPlayer',
            frames: this.anims.generateFrameNumbers('player', {frames: [0, 1, 2, 2, 1, 0], end: 0}),
            frameRate: 8,
        });
        this.anims.create({
            key: 'menuPlayer2',
            frames: this.anims.generateFrameNumbers('player2', {frames: [0, 1, 2, 2, 1, 0], end: 0}),
            frameRate: 8,
        });
        this.cat = this.physics.add.sprite(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2 - 50);
        // this.cat.preFX.addGlow();
        this.cat.play(Player.reborn ? 'menuPlayer2' : 'menuPlayer');
        this.time.addEvent({
            callback: function () {
                this.cat.play(Player.reborn ? 'menuPlayer2' : 'menuPlayer');
            },
            callbackScope: this,
            delay: 5000, // 1000 = 1 second
            loop: true
        });
    }

    addHealth() {
        this.add.image(500, 200, 'health');
        this.health = this.add.text(550, 173, Player.currentHealth, {fontSize: '60px', fill: '#cb1414'});
    }

    addStrength() {
        this.add.image(500, 300, 'strength');
        this.strength = this.add.text(550, 280, Player.strength, {fontSize: '50px', fill: '#cb1414'});

        this.addPaw(650, 300, function () {
            Player.strength++;
            this.strength.text = Player.strength;
            KnockBack.update(this);
        }.bind(this));
    }

    addAgility() {
        this.add.image(500, 370, 'agility');
        this.agility = this.add.text(550, 350, Player.agility, {fontSize: '50px', fill: '#cb1414'});

        this.addPaw(650, 370, function () {
            Player.agility++;
            this.agility.text = Player.agility;
        }.bind(this));
    }

    addVitality() {
        this.add.image(500, 440, 'vitality');
        this.vitality = this.add.text(550, 420, Player.vitality, {fontSize: '50px', fill: '#cb1414'});

        this.addPaw(650, 440, function () {
            Player.vitality++;
            this.vitality.text = Player.vitality;
            Player.addHealth(10);
        }.bind(this));
    }

    addDexterity() {
        this.add.image(500, 510, 'dexterity');
        this.dexterity = this.add.text(550, 490, Player.dexterity, {fontSize: '50px', fill: '#cb1414'});

        this.addPaw(650, 510, function () {
            Player.dexterity++;
            this.dexterity.text = Player.dexterity;
        }.bind(this));
    }

    addPaw(x, y, func) {
        const pawUp = this.add.image(x, y, 'paw', 0).setInteractive();
        const pawDown = this.add.image(x, y, 'paw', 1).setInteractive();

        pawDown.visible = false;

        pawUp.on('pointerdown', function () {
            pawUp.visible = false;
            pawDown.visible = true;
            if (Player.coins > 0) {
                func();
                Player.coins--;
                this.updatePoints();
                this.updatePaws();
            }
        }, this);

        pawDown.on('pointerup', function () {
            if (Player.coins > 0) {
                pawUp.visible = true;
            }
            pawDown.visible = false;
        });

        this.paws.push(pawUp);
    }

    updatePaws() {
        this.paws.forEach(function (paw) {
            paw.visible = Player.coins > 0;
        });
    }

    addSkillPanel() {
        this.skillManager.addPanel();
        this.skillManager.addIcons();
    }
}