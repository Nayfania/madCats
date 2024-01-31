class Game extends Phaser.Scene {
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
        this.load.rexScriptTag('js/skillManager.js');
        this.load.rexScriptTag('js/heart.js');
        this.load.rexScriptTag('js/achieves/crit.js');

        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');

        this.load.spritesheet('player', 'img/cat.png', {frameWidth: 117, frameHeight: 147});
        this.load.spritesheet('player2', 'img/cat2.png', {frameWidth: 117, frameHeight: 147});
        this.load.spritesheet('player_run', 'img/cat_run.png', {frameWidth: 117, frameHeight: 147});
        this.load.spritesheet('player_run2', 'img/cat_run2.png', {frameWidth: 117, frameHeight: 147});

        this.load.image('bg', 'img/background.jpeg');
        this.load.image('rat', 'img/rat.png');
        this.load.image('rat2', 'img/rat2.png');
        this.load.image('rat3', 'img/rat3.png');
        this.load.image('rat4', 'img/rat4.png');
        this.load.image('rat5', 'img/rat5.png');
        this.load.image('boss', 'img/boss.png');
        this.load.image('bullet', 'img/arrow.png');
        this.load.image('heart', 'img/heart.png');
        this.load.image('lvlup', 'img/lvlup.png');
        this.load.image('soul', 'img/soul.png');
    }

    init() {
        console.log('init');
    }

    create() {

        //  Set the camera and physics bounds to be the size of 4x4 bg images
        this.cameras.main.setBounds(0, 0, Game.battleGround.width, Game.battleGround.height);
        this.physics.world.setBounds(0, 0, Game.battleGround.width, Game.battleGround.height);

        new Background(this.scene);

        this.addHeart();

        this.player = new Player();
        this.player.setScene(this.scene);
        this.player.create();

        this.cameras.main.setSize(this.scale.width, this.scale.height);
        this.cameras.main.startFollow(this.player.get(), true, 0.05, 0.05);
        // this.cameras.main.postFX.addVignette(0.5, 0.5, 0.7, 0.3);

        this.bullets = this.physics.add.group({classType: Bullet, maxSize: 100, runChildUpdate: true});

        this.timeline = this.add.timeline();
        this.timeline.play();

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', function (event) {
            game.scene.switch('GameScene', 'MenuScene');
        });

        this.events.on('sleep', () => {
            console.log('GameScene slept');
        });

        this.events.on('wake', (system, data) => {
            console.log('GameScene wake');
            if (data === 'VillageScene') {
                this.scene.restart();
                Player.reset();
                console.log(Player.strength);
            }
            this.heart.update();
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
                barColor: 0xa57829,
                trackColor: 0x260e04,
                trackStrokeColor: 0x000000
            },
            align: {},
            space: {
                left: 20, right: 20, top: 20, bottom: 20,
                icon: 10,
                bar: 10
            },
            levelCounter: {
                table: [0, 0, 1, 10, 20, 30, 40, 50, 70, 90, 100],
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
                // console.log('levelup.start', level)
                // expBar.nameText = 'LEVEL '+level;
            })
            .on('levelup.end', function (level) {
                // console.log('levelup.end', level)
                // this.expBar.setValueText(level);
                expBar.nameText = 'LEVEL ' + level;
            })
            .on('levelup.complete', function (level) {
                // console.log('levelup.complete', level)
                if (Player.level !== level) {
                    Player.level++;
                    Player.points += Player.pointsPerLVLUp;

                    this.player.animateLvlUp();

                    game.scene.switch('GameScene', 'MenuScene');
                }
            }, this);

        this.spawn = new Spawn(this.scene, this.player);
        let spawnEnemies = this.spawn.next();
        this.physics.add.overlap(this.player.get(), spawnEnemies, this.damagePlayer, null, this);
        this.physics.add.overlap(this.bullets, spawnEnemies, this.damageEnemy, null, this);
        this.enemies = spawnEnemies;
        this.timer = this.time.addEvent({
            delay: 5000,
            callbackScope: this,
            loop: true,
            callback: function () {
                if (!this.spawn.hasNext()) {
                    return;
                }

                let spawnEnemies = this.spawn.next();
                this.physics.add.overlap(this.player.get(), spawnEnemies, this.damagePlayer, null, this);
                this.physics.add.overlap(this.bullets, spawnEnemies, this.damageEnemy, null, this);
                this.enemies = spawnEnemies;
            }.bind(this)
        });

        this.killed = this.add.text(16, 300, 'Killed: ' + Player.killed, {fontSize: '32px', fill: '#e0e0e0'});
        this.killed.setScrollFactor(0, 0);
        this.killed.setShadow(2, 2);
    }

    addHeart() {
        this.heart = new Heart(this);
        this.heart.addHeart();
    }

    update(time, delta) {
        this.player.get().setVelocity(0);

        this.player.playerMovement();

        if (this.input.activePointer.isDown && time > (this.lastFired + Player.attackSpeed())) {
            const bullet = this.bullets.get();
            if (bullet) {
                this.lastFired = time;
                bullet.hit = false;
                if (this.player.get().flipX) {
                    bullet.setPosition(this.player.get().x + 50, this.player.get().y - 5);
                } else {
                    bullet.setPosition(this.player.get().x - 55, this.player.get().y - 5);
                }
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.damage = this.player.get().damage;
                const worldPoint = this.cameras.main.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);
                this.physics.moveTo(bullet, worldPoint.x, worldPoint.y, Bullet.speed);
                bullet.rotation = Math.atan2(this.player.get().y - worldPoint.y, this.player.get().x - worldPoint.x);
            }
        }

        this.enemies.children.each(function (enemy) {
            if (this.spawn.movable) {
                this.physics.moveTo(enemy, this.player.get().x, this.player.get().y, Spawn.speed);
            }
            enemy.bar.x = enemy.x;
            enemy.bar.y = enemy.y;
        }, this);

        if (this.enemies.getTotalUsed() === 0 && !this.spawn.hasNext()) {
            this.win();
        }
        // console.log('this.enemies: ' + this.enemies.getTotalUsed());
        // console.log('time: ' + time + ' delta: ' + delta);
        // console.log('timeInSeconds: ' + this.timeInSeconds);
    }

    damagePlayer(player, enemy) {

        this.enemies.children.each(function (enemy) {
            let x = enemy.x <= this.player.get().x ? enemy.x - 100 : enemy.x + 100;
            let y = enemy.y <= this.player.get().y ? enemy.y - 100 : enemy.y + 100;

            this.physics.moveTo(enemy, x, y, Spawn.speed * 5);
        }, this);
        this.time.addEvent({
            delay: 500, callback: function (scene) {
                scene.spawn.movable = true;
            }, args: [this]
        });

        if (this.spawn.movable) {
            Player.currentHealth -= enemy.damage;
            if (Player.currentHealth <= 0) {
                this.gameOver();
                return;
            }
        }

        this.spawn.movable = false;

        this.heart.update();

        player.setTint(0xff0000);
        this.timeline.add({
            in: 100, once: false, run: () => {
                player.setTint();
            }
        });

        this.cameras.main.shake(50, 0.005, true);

        this.player.takeDamage(enemy);
        // console.log('damagePlayer');
    }

    damageEnemy(bullet, enemy) {
        console.log('damageEnemy');

        if (bullet.hit) {
            return;
        }

        enemy.setTint(0xff0000);
        this.timeline.add({
            in: 100, run: () => {
                enemy.setTint();
            }
        });

        this.player.damageEnemy(enemy);

        enemy.bar.update();
        if (enemy.health <= 0) {

            this.enemies.remove(enemy);

            enemy.animateDie();
            enemy.disableBody(true, true);

            this.spawn.enemiesCount();
            this.player.get().experience += enemy.experience;
            this.expBar.gainExp(enemy.experience);
            Player.killed++;
            this.killed.text = 'Killed: ' + Player.killed;
            // console.log('experience: ' + this.player.get().experience);
        }
        bullet.hit = true;

        Crit.update(this);

        // console.log('enemy health: ' + enemy.health);
        // console.log('bullet.damage: ' + bullet.damage);
        // console.log('Player.damage: ' + Player.damage());
    }

    gameOver() {
        this.physics.pause();
        // game.scene.pause('GameScene');

        var gameOver = this.add.text(this.player.get().x - 500, this.player.get().y - 100, 'YOU DIED', {
            fontSize: '210px',
            fill: '#cb1414'
        });
        gameOver.setShadow(3, 3);

        this.timeline.add({
            in: 1000, run: () => {
                game.scene.switch('GameScene', 'VillageScene');
            }
        });

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