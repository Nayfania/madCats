let player = new Player();

class Scene extends Phaser.Scene {
    enemies;
    lastFired = 0;
    timeline;
    heart;
    static battleGround = {width: 1280 * 2, height: 1024 * 2};

    constructor() {
        super({key: 'GameScene'});
    }

    preload() {
        this.load.spritesheet('player', 'img/cat.png', {frameWidth: 117, frameHeight: 147});
        this.load.image('bg', 'img/background.jpeg');
        this.load.image('cat', 'img/cat.png');
        this.load.image('rat', 'img/rat.png');
        this.load.image('waran', 'img/waran.png');
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

        player.setScene(this.scene);
        player.create();

        this.spawn = new Spawn(this.scene, player);
        this.enemies = this.spawn.next();
        // this.physics.add.collider(player.get(), this.enemies);
        this.physics.add.overlap(player.get(), this.enemies, this.damagePlayer, null, this);

        this.score = this.add.text(16, 16, 'Health: 0', {fontSize: '32px', fill: '#cb1414'});
        this.score.setScrollFactor(0, 0);
        this.score.setShadow(2, 2);

        this.experience = this.add.text(16, 250, 'Exp: 0', {fontSize: '32px', fill: '#06ad0d'});
        this.experience.setScrollFactor(0, 0);
        this.experience.setShadow(2, 2);

        this.cameras.main.setSize(this.scale.width, this.scale.height);
        this.cameras.main.startFollow(player.get(), true, 0.05, 0.05);
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

    }

    update(time, delta) {
        player.get().setVelocity(0);

        this.score.text = 'Health: ' + player.get().currentHealth;
        this.experience.text = 'Exp: ' + player.get().experience;

        if (player.get().currentHealth <= 0) {
            this.gameOver();
            return;
        }

        player.playerMovement();

        if (this.input.activePointer.isDown) {
            const bullet = this.bullets.get();
            // console.log(time, this.lastFired);
            if (bullet && time > (this.lastFired + 300)) {
                this.lastFired = time;
                bullet.hit = false;
                bullet.setPosition(player.get().x - 50, player.get().y - 5);
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.damage = player.get().damage;
                const worldPoint = this.cameras.main.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);
                this.physics.moveTo(bullet, worldPoint.x, worldPoint.y, player.get().speed * 5);
                bullet.rotation = Math.atan2(player.get().y - worldPoint.y, player.get().x - worldPoint.x);
            }
        }

        this.enemies.children.each(function (enemy) {
            this.physics.moveTo(enemy, player.get().x, player.get().y, player.get().speed / 2);
        }, this);

        this.scoreText.text = 'Health: ' + this.player.get().currentHealth;
        // console.log('time: ' + time + ' delta: ' + delta);
    }

    damagePlayer(player, enemy) {

        player.currentHealth -= enemy.damage;
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

        console.log('damagePlayer');
        console.log('player.currentHealth: ' + player.currentHealth);
    }

    damageEnemy(bullet, enemy) {

        enemy.setTint(0xff0000);
        this.timeline.add({
            in: 100, once: false, run: () => {
                enemy.setTint();
            }
        });

        enemy.health -= bullet.damage;
        if (enemy.health <= 0) {
            enemy.disableBody(true, true);
            player.get().experience += enemy.experience;
            console.log('experience: ' + player.get().experience);
        }
        bullet.hit = true;
        console.log('damageEnemy');
        // console.log('enemy health: ' + enemy.health);
        // console.log('bullet.damage: ' + bullet.damage);
    }

    gameOver() {
        this.physics.pause();
        game.scene.pause('GameScene');

        var gameOver = this.add.text(player.get().x - 500, player.get().y - 100, 'YOU DIED', {
            fontSize: '210px',
            fill: '#cb1414'
        });
        gameOver.setShadow(3, 3);
    }
}