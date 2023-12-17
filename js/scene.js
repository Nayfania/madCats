class Scene extends Phaser.Scene {
    player;
    enemies;
    gameOver = false;
    lastFired = 0;
    timeline;
    heart;

    constructor() {
        super();
    }

    preload() {
        this.load.image('bg', 'img/background.jpeg');
        this.load.image('cat', 'img/cat.png');
        this.load.image('enemy', 'img/rat.png');
        this.load.image('bullet', 'img/arrow.png');
        this.load.image('heart', 'img/heart.png');
    }

    create() {
        //  Set the camera and physics bounds to be the size of 4x4 bg images
        this.cameras.main.setBounds(0, 0, config.battleGround.width, config.battleGround.height);
        this.physics.world.setBounds(0, 0, config.battleGround.width, config.battleGround.height);

        new Background(this.scene);

        this.heart = this.add.image(0, 50, 'heart').setOrigin(0);
        this.heart.setScrollFactor(0, 0);
        this.heart.mask = this.heart.createBitmapMask();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = new Player(this.scene);
        this.player.create();

        var spawn = new Spawn(this.scene);
        this.enemies = spawn.next();

        this.scoreText = this.add.text(16, 16, 'Health: 0', {fontSize: '32px', fill: '#cb1414'});
        this.scoreText.setScrollFactor(0, 0);

        this.cameras.main.setSize(this.scale.width, this.scale.height);
        this.cameras.main.startFollow(this.player.get(), true, 0.05, 0.05);

        this.physics.add.overlap(this.player.get(), this.enemies, this.damagePlayer, null, this);

        this.bullets = this.physics.add.group({classType: Bullet, maxSize: 1000, runChildUpdate: true});
        this.physics.add.overlap(this.bullets, this.enemies, this.damageEnemy, null, this);

        this.timeline = this.add.timeline();
        this.timeline.play();
    }

    update(time, delta) {
        this.player.get().setVelocity(0);
        if (this.gameOver) {
            return;
        }

        this.player.playerMovement();

        if (this.input.activePointer.isDown) {
            const bullet = this.bullets.get();
            // console.log(time, this.lastFired);
            if (bullet && time > (this.lastFired + 300)) {
                this.lastFired = time;
                bullet.hit = false;
                bullet.setPosition(this.player.get().x - 50, this.player.get().y - 5);
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.damage = this.player.get().damage;
                const worldPoint = this.cameras.main.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);
                this.physics.moveTo(bullet, worldPoint.x, worldPoint.y, this.player.get().speed * 3);
            }
        }

        this.enemies.children.each(function (enemy) {
            this.physics.moveTo(enemy, this.player.get().x, this.player.get().y, this.player.get().speed / 2);
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

        if (player.health <= 0) {
            this.physics.pause();
            this.physics.body.allowGravity = false
            this.gameOver = true;
        }
        console.log('damagePlayer');
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
        }
        bullet.hit = true;
        console.log('damageEnemy');
        console.log('enemy health: ' + enemy.health);
        console.log('bullet.damage: ' + bullet.damage);
    }
}