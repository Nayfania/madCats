class Scene extends Phaser.Scene {
    player;
    enemies;
    lastFired = 0;
    timeline;
    heart;
    expBar;
    static battleGround = {width: 1280 * 2, height: 1024 * 2};

    constructor() {
        super({
            key: 'GameScene',
            pack: {
                files: [{
                    type: 'plugin',
                    key: 'rexscripttagloaderplugin',
                    url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexscripttagloaderplugin.min.js',
                    start: true
                }]
            }
        });
    }

    preload() {
        this.plugins.get('rexscripttagloaderplugin').addToScene(this);

        this.load.rexScriptTag('js/health-bar-plugin/HealthBar.js');
        this.load.rexScriptTag('js/FloatingNumbersPlugin.js');
        this.load.rexScriptTag('js/bullet.js');
        this.load.rexScriptTag('js/player.js');
        this.load.rexScriptTag('js/background.js');
        this.load.rexScriptTag('js/spawn.js');

        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');

        this.load.spritesheet('player', 'img/cat.png', {frameWidth: 117, frameHeight: 147});
        this.load.spritesheet('player2', 'img/cat2.png', {frameWidth: 117, frameHeight: 147});
        this.load.spritesheet('player_run', 'img/cat_run.png', {frameWidth: 117, frameHeight: 147});
        this.load.spritesheet('player_run2', 'img/cat_run2.png', {frameWidth: 117, frameHeight: 147});

        this.load.image('bg', 'img/background.jpeg');
        this.load.image('rat', 'img/rat.png');
        this.load.image('rat2', 'img/rat2.png');
        this.load.image('rat3', 'img/rat3.png');
        this.load.image('bullet', 'img/arrow.png');
        this.load.image('heart', 'img/heart.png');
    }

    create() {

        //  Set the camera and physics bounds to be the size of 4x4 bg images
        this.cameras.main.setBounds(0, 0, Scene.battleGround.width, Scene.battleGround.height);
        this.physics.world.setBounds(0, 0, Scene.battleGround.width, Scene.battleGround.height);

        new Background(this.scene);

        this.heart = this.add.image(0, 50, 'heart').setOrigin(0);
        this.heart.setScrollFactor(0, 0);
        this.heart.mask = this.heart.createBitmapMask();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = new Player();
        this.player.setScene(this.scene);
        this.player.create();

        this.spawn = new Spawn(this.scene, this.player);
        this.enemies = this.spawn.next();
        // this.physics.add.collider(this.player.get(), this.enemies);
        this.physics.add.overlap(this.player.get(), this.enemies, this.damagePlayer, null, this);

        this.score = this.add.text(16, 16, 'Health: ' + this.player.get().currentHealth, {
            fontSize: '32px',
            fill: '#cb1414'
        });
        this.score.setScrollFactor(0, 0);
        this.score.setShadow(2, 2);

        this.cameras.main.setSize(this.scale.width, this.scale.height);
        this.cameras.main.startFollow(this.player.get(), true, 0.05, 0.05);
        // this.cameras.main.postFX.addVignette(0.5, 0.5, 0.7, 0.3);

        this.bullets = this.physics.add.group({classType: Bullet, maxSize: 100, runChildUpdate: true});
        this.physics.add.overlap(this.bullets, this.enemies, this.damageEnemy, null, this);

        this.timeline = this.add.timeline();
        this.timeline.play();

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', function (event) {
            console.log('ESC');
            // game.scene.getScene('GameScene').scene.scene.input.keyboard.removeKey('ESC');
            // game.scene.getScene('MenuScene').scene.scene.input.keyboard.addKey('ESC');
            game.scene.switch('GameScene', 'MenuScene');
        });

        this.events.on('sleep', () => {
            console.log('GameScene slept');
        });

        this.events.on('wake', () => {
            console.log('GameScene wake');
        });

        var expBar = this.rexUI.add.expBar({
            width: 1000,
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x4e342e),
            // icon: this.add.rectangle(0, 0, 20, 20, COLOR_LIGHT),
            nameText: this.add.text(0, 0, 'LEVEL 1', {fontSize: 24}),
            valueText: this.rexUI.add.BBCodeText(0, 0, '', {fontSize: 24}),
            valueTextFormatCallback: function (value, min, max) {
                value = Math.floor(value);
                return `[b]${value}[/b]/${max}`;
            },
            bar: {
                height: 10,
                barColor: 0x7b5e57,
                trackColor: 0x260e04,
                // trackStrokeColor: COLOR_LIGHT
            },
            align: {},
            space: {
                left: 20, right: 20, top: 20, bottom: 20,
                icon: 10,
                bar: 10
            },
            levelCounter: {
                table: [0, 0, 10, 20, 30, 100],
                maxLevel: 10,
                exp: 0,
            },
            easeDuration: 2000
        });
        this.expBar = expBar;
        this.expBar.setLevel(Player.level);
        this.expBar.setScrollFactor(0, 0);
        this.expBar.setPosition(1000, 50)
            .layout()
            .on('levelup.start', function (level, val) {
                console.log('levelup.start', level)
                // expBar.nameText = 'LEVEL '+level;
            })
            .on('levelup.end', function (level) {
                console.log('levelup.end', level)
                // this.expBar.setValueText(level);
                expBar.nameText = 'LEVEL ' + level;
            })
            .on('levelup.complete', function (level) {
                console.log('levelup.complete', level)
                if (Player.level !== level) {
                    Player.level++;
                    Player.points++;
                }
            });
    }

    update(time, delta) {
        this.player.get().setVelocity(0);

        if (this.player.get().currentHealth <= 0) {
            this.gameOver();
            return;
        }

        this.player.playerMovement();

        if (this.input.activePointer.isDown) {
            const bullet = this.bullets.get();
            if (bullet && time > (this.lastFired + 700)) {
                this.lastFired = time;
                bullet.hit = false;
                bullet.setPosition(this.player.get().x - 50, this.player.get().y - 5);
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.damage = this.player.get().damage;
                const worldPoint = this.cameras.main.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);
                this.physics.moveTo(bullet, worldPoint.x, worldPoint.y, this.player.get().speed * 5);
                bullet.rotation = Math.atan2(this.player.get().y - worldPoint.y, this.player.get().x - worldPoint.x);
            }
        }

        this.enemies.children.each(function (enemy) {
            this.physics.moveTo(enemy, this.player.get().x, this.player.get().y, this.player.get().speed / 3);
            enemy.bar.x = enemy.x;
            enemy.bar.y = enemy.y;
        }, this);

        if (this.enemies.getTotalUsed() === 0) {
            if (this.spawn.hasNext()) {
                this.enemies = this.spawn.next();
                this.physics.add.overlap(this.player.get(), this.enemies, this.damagePlayer, null, this);
                this.physics.add.overlap(this.bullets, this.enemies, this.damageEnemy, null, this);
            } else {
                this.win();
            }
        }
        // console.log('this.enemies: ' + this.enemies.getTotalUsed());
        // console.log('time: ' + time + ' delta: ' + delta);
    }

    damagePlayer(player, enemy) {

        player.currentHealth -= enemy.damage;
        enemy.health = 0;
        enemy.bar.update();
        enemy.disableBody(true, true);

        const overlay = this.add.graphics();
        var empty = (player.health - player.currentHealth) * (this.heart.height / player.health);
        var damage = (this.heart.height / player.health) * player.damage;
        overlay.fillStyle(0x000000).fillRect(0, 0, 250, empty + damage + 42);
        overlay.setMask(this.heart.mask);
        overlay.setScrollFactor(0, 0);

        player.setTint(0xff0000);
        this.timeline.add({
            in: 100, once: false, run: () => {
                player.setTint();
            }
        });

        this.cameras.main.shake(50, 0.005, true);
        this.showDamage(enemy.damage, player, "#ff0000");

        this.score.text = 'Health: ' + player.currentHealth;

        console.log('damagePlayer');
        // console.log('player.currentHealth: ' + player.currentHealth);
    }

    damageEnemy(bullet, enemy) {

        enemy.setTint(0xff0000);
        this.timeline.add({
            in: 100, once: false, run: () => {
                enemy.setTint();
            }
        });

        enemy.health -= Player.damage();
        enemy.bar.update();
        if (enemy.health <= 0) {
            enemy.disableBody(true, true);
            this.player.get().experience += enemy.experience;
            this.expBar.gainExp(enemy.experience);
            console.log('experience: ' + this.player.get().experience);
        }
        bullet.hit = true;

        this.showDamage(Player.damage(), enemy, "#ffffff");
        // console.log('damageEnemy');
        // console.log('enemy health: ' + enemy.health);
        // console.log('bullet.damage: ' + bullet.damage);
    }

    showDamage(text, object, color) {
        var floatingNumbers = new FloatingNumbersPlugin(this, Phaser.Plugins.BasePlugin);
        floatingNumbers.createFloatingText({
            textOptions: {
                fontFamily: 'shrewsbury',
                fontSize: 42,
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
            animation: "up", // "smoke", "explode", "fade", "up"
            animationEase: "Linear",
            timeToLive: 500,
            animationDistance: 50,
            fixedToCamera: false,
        });
    }

    gameOver() {
        this.physics.pause();
        game.scene.pause('GameScene');

        var gameOver = this.add.text(this.player.get().x - 500, this.player.get().y - 100, 'YOU DIED', {
            fontSize: '210px',
            fill: '#cb1414'
        });
        gameOver.setShadow(3, 3);
        console.log('gameOver');
    }

    win() {
        this.physics.pause();
        game.scene.pause('GameScene');

        var win = this.add.text(this.player.get().x - 500, this.player.get().y - 100, 'YOU WIN', {
            fontSize: '210px',
            fill: '#37ef0d'
        });
        win.setShadow(3, 3);
        console.log('win');
    }
}