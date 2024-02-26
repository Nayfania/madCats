class Game extends Phaser.Scene {
    player;
    enemies;
    lastFired = 0;
    timeline;
    heart;
    static battleGround = {width: 1280 * 2, height: 1024 * 2};

    constructor() {
        super({
            key: 'GameScene',
            pack: {
                files: [{
                    type: 'plugin',
                    key: 'rexscripttagloaderplugin',
                    url: '/dist/rexscripttagloaderplugin.js',
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
        this.load.rexScriptTag('js/achieves/knockBack.js');
        this.load.rexScriptTag('js/achieves/regeneration.js');
        this.load.rexScriptTag('js/achieves/healLvlUp.js');
        this.load.rexScriptTag('js/game/Butterflies.js');

        this.load.scenePlugin('rexuiplugin', '/dist/rexuiplugin.js', 'rexUI', 'rexUI');

        this.load.spritesheet('player', 'img/cat.png', {frameWidth: 117, frameHeight: 147});
        this.load.spritesheet('player2', 'img/cat2.png', {frameWidth: 117, frameHeight: 147});
        this.load.spritesheet('player_run', 'img/cat_run.png', {frameWidth: 117, frameHeight: 147});
        this.load.spritesheet('player_run2', 'img/cat_run2.png', {frameWidth: 117, frameHeight: 147});
        this.load.spritesheet('satiety', 'img/satiety.png', {frameWidth: 201, frameHeight: 218});

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
        this.load.image('coin', 'img/coin.png');
        this.load.image('fish', 'img/fish.png');
        this.load.image('butterfly_green', 'img/butterfly_green.png');
        this.load.image('butterfly_gold', 'img/butterfly_gold.png');
        this.load.image('butterfly_purple', 'img/butterfly_purple.png');
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

        this.player = new Player(this.scene, this.heart);
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

        this.player.exp();

        this.spawn = new Spawn(this.scene, this.player);
        let spawnEnemies = this.spawn.next();
        this.physics.add.overlap(this.player.get(), spawnEnemies, this.damagePlayerByEnemy, null, this);
        this.physics.add.overlap(this.bullets, spawnEnemies, this.damageEnemy, null, this);
        this.enemies = spawnEnemies;
        this.timer = this.time.addEvent({
            delay: 5000,
            callbackScope: this,
            loop: true,
            callback: function () {
                this.player.hunger();
                if (Player.hungry) {
                    this.damagePlayer(Player.hungerDamage);
                }

                if (!this.spawn.hasNext()) {
                    return;
                }

                let spawnEnemies = this.spawn.next();
                this.physics.add.overlap(this.player.get(), spawnEnemies, this.damagePlayerByEnemy, null, this);
                this.physics.add.overlap(this.bullets, spawnEnemies, this.damageEnemy, null, this);
                this.enemies = spawnEnemies;
            }.bind(this)
        });

        this.killed = this.add.text(16, 300, 'Killed: ' + Player.killed, {fontSize: '32px', fill: '#e0e0e0'});
        this.killed.setScrollFactor(0, 0);
        this.killed.setShadow(2, 2);

        this.spawnButterFlies();
    }

    addHeart() {
        this.heart = new Heart(this);
        this.heart.addHeart();
    }

    spawnButterFlies() {
        const butterflies = new Butterflies(this);
        this.time.addEvent({
            delay: 5000,
            callbackScope: this,
            loop: true,
            callback: function () {
                butterflies.spawn();
            }
        });
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

    damagePlayerByEnemy(player, enemy) {

        this.enemies.children.each(function (enemy) {
            let x = enemy.x <= this.player.get().x ? enemy.x - 10 : enemy.x + 10;
            let y = enemy.y <= this.player.get().y ? enemy.y - 10 : enemy.y + 10;

            this.physics.moveTo(enemy, x, y, Spawn.speed * 5);
        }, this);
        this.time.addEvent({
            delay: 200, callback: function (scene) {
                scene.spawn.movable = true;
            }, args: [this]
        });

        if (this.spawn.movable) {
            this.damagePlayer(enemy.damage);
        }

        this.spawn.movable = false;

        // console.log('damagePlayer');
    }

    damagePlayer(damage) {
        this.player.takeDamage(damage);

        if (Player.currentHealth <= 0) {
            this.gameOver();
        }

        // this.player.get().setTint(0xff0000);
        // this.timeline.add({
        //     in: 100, once: false, run: () => {
        //         this.player.get().setTint();
        //     }
        // });

        this.cameras.main.shake(50, 0.005, true);
    }

    damageEnemy(bullet, enemy) {
        console.log('damageEnemy');

        if (bullet.hit) {
            return;
        }

        if (Player.knockBackChance > 0 && (Math.random() * 100) <= Player.knockBackChance) {
            enemy.x = enemy.x <= this.player.get().x ? enemy.x - 100 : enemy.x + 100;
            enemy.y = enemy.y <= this.player.get().y ? enemy.y - 100 : enemy.y + 100;
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
            this.player.addExp(enemy.experience);
            Player.killed++;
            this.killed.text = 'Killed: ' + Player.killed;
            // console.log('experience: ' + this.player.get().experience);

            if ((Math.random() * 100) <= 2) {
                const coin = this.physics.add.image(enemy.x, enemy.y, 'coin');
                const coinPickUp = this.physics.add.overlap(coin, this.player.get(), function (coin, player) {
                    console.log('pick up Coin');
                    Player.coins++;
                    coin.destroy();
                    coinPickUp.active = false;
                }, null, this);
            }

            if ((Math.random() * 100) <= 5) {
                const fish = this.physics.add.image(enemy.x, enemy.y, 'fish');
                const fishPickUp = this.physics.add.overlap(fish, this.player.get(), function (fish, player) {
                    console.log('pick up Fish');
                    this.player.heal(30);
                    this.player.eat(30);
                    this.heart.update();
                    Regeneration.update(this)
                    fish.destroy();
                    fishPickUp.active = false;
                }, null, this);

                this.tweens.add({
                    targets: [fish],
                    duration: 300,
                    y: {from: fish.y, to: fish.y - 40},
                    yoyo: true,
                    repeat: -1
                });
            }
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