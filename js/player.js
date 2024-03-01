class Player {
    scene;
    player;
    isRunning = false;

    static level = 1;
    static expPercent = 100;
    static coins = 0;

    static baseHealth = 100;
    static maxHealth = 100;
    static currentHealth = 100;

    satiety = 100; // 0 < 30 < 70 < 100 < 130 < 200
    satietyIcon;
    static overate = false;
    static hungry = false;
    static hungerDamage = 5;

    static strength = 1; // Damage
    static agility = 1; // Speed
    static vitality = 1; // Health
    static dexterity = 1; // Attack Speed

    static baseDamage = 1;
    static baseSpeed = 100;
    static baseAttackSpeed = 500; // ms

    static critChance = 0; // %
    static isCrit = false;

    static knockBackChance = 0; // %
    static regenerate = false;
    static healLvlUp = false;
    static reborn = false; // Agility - flee, Vitality - dfe, Dexterity - hit(?), Strength * 3

    static killed = 0;

    static needToChooseSkill = false;
    static skills = [];

    constructor(scene, heart) {
        this.scene = scene.scene;
        this.heart = heart;
    }

    static addHealth(value) {
        Player.maxHealth += value;
        Player.currentHealth += value;
    }

    heal(value) {
        this.showDamage('+' + value, this.get(), "#32de1d");
        if (Player.currentHealth === Player.maxHealth) {
            return;
        }

        if (Player.currentHealth + value <= Player.maxHealth) {
            Player.currentHealth += value;
            return;
        }

        Player.currentHealth = Player.maxHealth;
    }

    hunger() {
        let value = Player.hungerDamage;
        if ((this.satiety - value) < 0) {
            this.satiety = 0;
        } else {
            this.satiety -= value;
        }

        this.updateSatiety();
    }

    eat(value) {
        this.satiety += value;
        this.updateSatiety();
    }

    updateSatiety() {
        if (this.satietyIcon !== undefined) {
            this.satietyIcon.destroy();
        }

        if (this.satiety > 130) {
            this.satietyIcon = this.scene.add.image(1800, 110, 'satiety', 0).setScrollFactor(0, 0);
            Player.overate = true;
            Player.hungry = false;
        } else if (this.satiety > 70 && this.satiety <= 130) {
            this.satietyIcon = this.scene.add.image(1800, 110, 'satiety', 1).setScrollFactor(0, 0);
            Player.overate = false;
            Player.hungry = false;
        } else if (this.satiety > 30 && this.satiety <= 70) {
            this.satietyIcon = this.scene.add.image(1800, 110, 'satiety', 2).setScrollFactor(0, 0);
            Player.overate = false;
            Player.hungry = false;
        } else {
            this.satietyIcon = this.scene.add.image(1800, 110, 'satiety', 3).setScrollFactor(0, 0);
            Player.overate = false;
            Player.hungry = true;
        }
    }

    static damage() {
        let damage = Player.baseDamage + (Player.reborn ? Player.strength * 3 : Player.strength * 2);

        if (Player.critChance > 0 && (Math.random() * 100) <= Player.critChance) {
            Player.isCrit = true;
            return damage * 2;
        }

        Player.isCrit = false;

        return damage;
    };

    isEvaded() {
        const evaded =  Player.reborn && (Math.random() * 100) <= Player.agility;
        if (evaded) {
            this.showDamage('EVADE', this.player, "#ffffff");
        }
        return evaded;
    }

    takeDamage(damage) {
        if (Player.reborn) {
            damage -= Player.vitality;
        }
        Player.currentHealth -= damage;
        this.showDamage(damage, this.player, "#ff0000");
        this.heart.update();
    }

    damageEnemy(enemy) {
        let damage = Player.damage();
        enemy.health -= damage;
        if (Player.isCrit) {
            this.showDamage(damage, enemy, "#ffb937", 80, 'smoke');
        } else {
            this.showDamage(damage, enemy, "#ffffff");
        }
    }

    static speed = function () {
        let speed = Player.baseSpeed + (Player.agility * 10);
        return Player.overate ? speed / 2 : speed;
    }

    static attackSpeed = function () {
        return Player.baseAttackSpeed - (Player.dexterity * 10);
    }

    create() {
        console.log('Player create')

        this.cursors = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            s: Phaser.Input.Keyboard.KeyCodes.S,
        });

        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('player', {frames: [0, 1, 2, 2, 1, 0], end: 0}),
            frameRate: 8,
        });
        this.scene.anims.create({
            key: 'idle2',
            frames: this.scene.anims.generateFrameNumbers('player2', {frames: [0, 1, 2, 2, 1, 0], end: 0}),
            frameRate: 8,
        });
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNumbers('player_run', {
                frames: [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0],
                end: 0
            }),
            frameRate: 16,
        });
        this.scene.anims.create({
            key: 'run2',
            frames: this.scene.anims.generateFrameNumbers('player_run2', {
                frames: [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0],
                end: 0
            }),
            frameRate: 16,
        });

        this.player = this.scene.physics.add.sprite(this.scene.sys.game.canvas.width / 2, this.scene.sys.game.canvas.height / 2);
        this.player.preFX.addGlow();

        this.player.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
            this.isRunning = false;
        }, this);

        this.animateIdle();
        this.scene.time.addEvent({
            callback: this.animateIdle,
            callbackScope: this,
            delay: 5000, // 1000 = 1 second
            loop: true
        });

        this.player.setCollideWorldBounds(true);
        this.player.setCircle(60);

        this.scene.input.on('pointermove', (pointer) => {
            this.player.flipX = this.player.x <= pointer.worldX;
        });

        this.floatingNumbers = new FloatingNumbersPlugin(this.scene, Phaser.Plugins.BasePlugin);

        this.satietyIcon = this.scene.add.image(1800, 110, 'satiety', 1).setScrollFactor(0, 0);

        this.regeneration();
    }

    static reset() {
        Player.currentHealth = Player.baseHealth;
        Player.maxHealth = Player.baseHealth;
        Player.killed = 0;
        Player.baseDamage = 1;
        Player.baseSpeed = 100;
        Player.baseAttackSpeed = 500;
        Player.level = 1;
    }

    animateIdle() {
        if (!this.isRunning) {
            this.player.play(Player.reborn ? 'idle2' : 'idle');
        }
    }

    animateRun() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.player.play(Player.reborn ? 'run2' : 'run');
        }
    }

    exp() {
        this.expBar = this.scene.rexUI.add.expBar({
            width: 1000,
            background: this.scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x4e342e),
            // icon: this.scene.add.rectangle(0, 0, 20, 20, 0x4e342e),
            nameText: this.scene.add.text(0, 0, 'LEVEL 1', {fontSize: 24}),
            valueText: this.scene.rexUI.add.BBCodeText(0, 0, '', {fontSize: 24}),
            valueTextFormatCallback: function (value, min, max) {
                value = Math.floor(value);
                return `[b]${value}[/b]/${max}`;
            },
            bar: {
                height: 10,
                barColor: 0xa57829,
                trackColor: 0x260e04,
                trackStrokeColor: 0x000000
            },
            align: {},
            space: {left: 20, right: 20, top: 20, bottom: 20, icon: 10, bar: 10},
            levelCounter: {
                table: [0, 0, 10, 20, 30, 40, 50, 60, 70, 90, 100],
                maxLevel: 10,
                exp: 0,
            },
            easeDuration: 2000
        });
        this.expBar.setLevel(Player.level);
        this.expBar.setScrollFactor(0, 0);
        this.expBar.setPosition(1000, 50)
            .layout()
            .on('levelup.start', function (level, val) {
                // console.log('levelup.start', level)
                // expBar.nameText = 'LEVEL '+level;
            })
            .on('levelup.end', function (level) {
                // console.log('levelup.end', level)
                // this.expBar.setValueText(level);
                this.expBar.nameText = 'LEVEL ' + level;
            }, this)
            .on('levelup.complete', function (level) {
                // console.log('levelup.complete', level)
                if (Player.level !== level) {
                    Player.level++;
                    Player.needToChooseSkill = true;

                    HealLvlUp.update(this);
                    if (Player.healLvlUp) {
                        this.heal(30);
                    }

                    this.animateLvlUp();

                    game.scene.switch('GameScene', 'MenuScene');
                }
            }, this);
    }

    addExp(experience) {
        console.log('Got experience: ' + (experience * Player.expPercent) / 100)
        this.expBar.gainExp((experience * Player.expPercent) / 100);
    }

    animateLvlUp() {
        this.player.visible = false;
        this.player.body.setEnable(false);

        let lvlup = this.scene.add.image(this.player.x, this.player.y, 'lvlup');

        this.scene.tweens.add({
            targets: [lvlup],
            duration: 200,
            y: {from: this.player.y, to: this.player.y - 25},
            ease: 'Linear',
            yoyo: true,
            repeat: 2,
            onStart: _ => console.log('Tween is onStart!'),
            onActive: _ => console.log('Tween is onActive!'),
            onComplete: function () {
                lvlup.visible = false;
                lvlup.destroy();
                this.player.visible = true;
                this.player.body.setEnable(true);
            }.bind(this)
        });
    }

    get() {
        return this.player;
    }

    playerMovement() {
        const left = this.cursors.left.isDown || this.cursors.a.isDown;
        const right = this.cursors.right.isDown || this.cursors.d.isDown;
        const up = this.cursors.up.isDown || this.cursors.w.isDown;
        const down = this.cursors.down.isDown || this.cursors.s.isDown;

        if (left && !up && !down) { // Left
            this.player.setVelocityX(-Player.speed());
        } else if (right && !up && !down) { // Right
            this.player.setVelocityX(Player.speed());
        } else if (up && !right && !left) { // Up
            this.player.setVelocityY(-Player.speed());
        } else if (down && !right && !left) { // Down
            this.player.setVelocityY(Player.speed());
        } else if (left && down) { // Down and Left
            this.player.setVelocity(-Player.speed(), Player.speed());
        } else if (left && up) { // Up and Left
            this.player.setVelocity(-Player.speed(), -Player.speed());
        } else if (right && up) { // Up and Right
            this.player.setVelocity(Player.speed(), -Player.speed());
        } else if (right && down) { // Down and Right
            this.player.setVelocity(Player.speed(), Player.speed());
        }

        if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) {
            this.animateRun();
        }
    }

    showDamage(text, object, color, fontSize = 42, animation = 'up') {
        this.floatingNumbers.createFloatingText({
            textOptions: {
                fontFamily: 'shrewsbury',
                fontSize: fontSize,
                color: color,
                strokeThickness: 2,
                fontWeight: "bold",
                stroke: "#000000",
                shadow: {
                    offsetX: 0,
                    offsetY: 0,
                    color: '#000',
                    blur: 4,
                    stroke: true,
                    fill: false
                }
            },
            text: text,
            align: "top-center",
            parentObject: object,
            animation: animation, // "smoke", "explode", "fade", "up"
            animationEase: "Linear",
            timeToLive: 500,
            animationDistance: 50,
            fixedToCamera: false,
        });
    }

    regeneration() {
        this.scene.time.addEvent({
            delay: 10000,
            callbackScope: this,
            loop: true,
            callback: function () {
                if (Player.regenerate) {
                    this.heal(Player.vitality);
                }
            }.bind(this)
        });
    }

    static addSkill(skill) {
        const index = Player.skills.findIndex(o => o.name === skill.name);
        if (index > -1) {
            Player.skills[index] = skill;
        } else {
            Player.skills.push(skill);
        }
    }
}