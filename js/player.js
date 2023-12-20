class Player {
    scene;
    player;

    setScene(scene) {
        this.scene = scene.scene;
    }

    create() {
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('player', { frames: [ 0, 1, 2, 2, 1, 0 ], end: 0 }),
            frameRate: 8,
        });
        this.player = this.scene.physics.add.sprite(1280, 1300);
        this.player.preFX.addGlow();
        // this.player.preFX.addShadow();
        // this.player.postFX.addShadow();
        this.animateIdle();
        this.scene.time.addEvent({
            callback: this.animateIdle,
            callbackScope: this,
            delay: 5000, // 1000 = 1 second
            loop: true
        });

        // this.player = this.scene.physics.add.image(1280, 1024, 'cat');
        this.player.setCollideWorldBounds(true);
        this.player.health = 100;
        this.player.currentHealth = 100;
        this.player.speed = Phaser.Math.GetSpeed(300, 1) * 1000;
        this.player.damage = 1;
        this.player.experience = 0;
    }

    animateIdle(){
        this.player.play('idle');
    }

    get() {
        return this.player;
    }

    playerMovement() {
        if (this.scene.cursors.left.isDown && !this.scene.cursors.up.isDown && !this.scene.cursors.down.isDown) { // Left
            this.player.setVelocityX(-this.player.speed);
            this.player.flipX = false;
        } else if (this.scene.cursors.right.isDown && !this.scene.cursors.up.isDown && !this.scene.cursors.down.isDown) { // Right
            this.player.setVelocityX(this.player.speed);
            this.player.flipX = true;
        } else if (this.scene.cursors.up.isDown && !this.scene.cursors.right.isDown && !this.scene.cursors.left.isDown) { // Up
            this.player.setVelocityY(-this.player.speed);
        } else if (this.scene.cursors.down.isDown && !this.scene.cursors.right.isDown && !this.scene.cursors.left.isDown) { // Down
            this.player.setVelocityY(this.player.speed);
        } else if (this.scene.cursors.left.isDown && this.scene.cursors.down.isDown) { // Down and Left
            this.player.setVelocityX(-this.player.speed);
            this.player.setVelocityY(this.player.speed);
            this.player.flipX = false;
        } else if (this.scene.cursors.left.isDown && this.scene.cursors.up.isDown) { // Up and Left
            this.player.setVelocityX(-this.player.speed);
            this.player.setVelocityY(-this.player.speed);
            this.player.flipX = false;
        } else if (this.scene.cursors.right.isDown && this.scene.cursors.up.isDown) { // Up and Right
            this.player.setVelocityX(this.player.speed);
            this.player.setVelocityY(-this.player.speed);
            this.player.flipX = true;
        } else if (this.scene.cursors.right.isDown && this.scene.cursors.down.isDown) { // Down and Right
            this.player.setVelocityX(this.player.speed);
            this.player.setVelocityY(this.player.speed);
            this.player.flipX = true;
        }
    }
}