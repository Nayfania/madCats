class Scene extends Phaser.Scene {
    player;
    enemies;
    gameOver = false;
    lastFired = 0;
    timeline;

    constructor() {
        super();
    }

    preload() {
        this.load.image('bg', 'img/seamless-texture-cracked-old-stone-tiles.jpg');
        this.load.image('cat', 'img/cat.png');
        this.load.image('enemy', 'img/Swordsman_Cat.webp');
        this.load.image('bullet', 'img/arrow.png');
    }

    create() {
        //  Set the camera and physics bounds to be the size of 4x4 bg images
        this.cameras.main.setBounds(0, 0, config.battleGround.width, config.battleGround.height);
        this.physics.world.setBounds(0, 0, config.battleGround.width, config.battleGround.height);

        //  Mash 4 images together to create our background
        this.add.image(0, 0, 'bg').setOrigin(0);
        this.add.image(1800, 0, 'bg').setOrigin(0).setFlipX(true);
        this.add.image(0, 900, 'bg').setOrigin(0).setFlipY(true);
        this.add.image(1800, 900, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = this.physics.add.image(950, 350, 'cat');
        this.player.setCollideWorldBounds(true);
        this.player.health = 10;
        this.player.speed = Phaser.Math.GetSpeed(400, 1) * 1000;

        this.enemies = this.physics.add.group({
            key: 'enemy',
            repeat: 2,
            setXY: {x: 120, y: 150, stepX: 270}
        });
        this.enemies.children.each(function (enemy) {
            enemy.health = 5;
        }, this);

        this.scoreText = this.add.text(16, 16, 'Health: 0', {fontSize: '32px', fill: '#cb1414'});
        this.scoreText.setScrollFactor(0, 0);

        this.cameras.main.setSize(this.scale.width, this.scale.height);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        this.physics.add.collider(this.player, this.enemies);
        this.physics.add.overlap(this.player, this.enemies, this.damagePlayer, null, this);

        this.bullets = this.physics.add.group({classType: Bullet, maxSize: 1000, runChildUpdate: true});
        this.physics.add.overlap(this.bullets, this.enemies, this.damageEnemy, null, this);

        this.timeline = this.add.timeline();
        this.timeline.play();
    }

    update(time, delta) {
        this.player.setVelocity(0);
        // if (this.gameOver) {
        //     return;
        // }

        this.playerMovement();

        if (this.input.activePointer.isDown) {
            const bullet = this.bullets.get();
            // console.log(time, this.lastFired);
            if (bullet && time > (this.lastFired + 300)) {
                this.lastFired = time;
                bullet.hit = false;
                bullet.setPosition(this.player.x - 50, this.player.y - 5);
                bullet.setActive(true);
                bullet.setVisible(true);
                const worldPoint = this.cameras.main.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y);
                this.physics.moveTo(bullet, worldPoint.x, worldPoint.y, this.player.speed * 3);
                // console.log(this.input.activePointer.x, this.input.activePointer.y);
                // console.log(this.cameras.main.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y));
            }
        }

        this.enemies.children.each(function (enemy) {
            this.physics.moveTo(enemy, this.player.x, this.player.y, this.player.speed / 2);
        }, this);

        this.scoreText.text = 'Health: ' + this.player.health;
        // console.log('time: ' + time + ' delta: ' + delta);
    }

    playerMovement() {
        if (this.cursors.left.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) { // Left
            this.player.setVelocityX(-this.player.speed);
            this.player.flipX = false;
        } else if (this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) { // Right
            this.player.setVelocityX(this.player.speed);
            this.player.flipX = true;
        } else if (this.cursors.up.isDown && !this.cursors.right.isDown && !this.cursors.left.isDown) { // Up
            this.player.setVelocityY(-this.player.speed);
        } else if (this.cursors.down.isDown && !this.cursors.right.isDown && !this.cursors.left.isDown) { // Down
            this.player.setVelocityY(this.player.speed);
        } else if (this.cursors.left.isDown && this.cursors.down.isDown) { // Down and Left
            this.player.setVelocityX(-this.player.speed);
            this.player.setVelocityY(this.player.speed);
            this.player.flipX = false;
        } else if (this.cursors.left.isDown && this.cursors.up.isDown) { // Up and Left
            this.player.setVelocityX(-this.player.speed);
            this.player.setVelocityY(-this.player.speed);
            this.player.flipX = false;
        } else if (this.cursors.right.isDown && this.cursors.up.isDown) { // Up and Right
            this.player.setVelocityX(this.player.speed);
            this.player.setVelocityY(-this.player.speed);
            this.player.flipX = true;
        } else if (this.cursors.right.isDown && this.cursors.down.isDown) { // Down and Right
            this.player.setVelocityX(this.player.speed);
            this.player.setVelocityY(this.player.speed);
            this.player.flipX = true;
        }
    }

    damagePlayer(player, enemy) {
        player.health--;
        enemy.disableBody(true, true);

        player.setTint(0xff0000);
        this.timeline.add({
            in: 100, once: false, run: () => {
                player.setTint();
            }
        });

        if (player.health === 0) {
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

        enemy.health -= 1;
        if (enemy.health === 0) {
            enemy.disableBody(true, true);
        }
        bullet.hit = true;
        console.log('damageEnemy');
        console.log('enemy health: ' + enemy.health);
    }
}