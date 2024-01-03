class Player {
    scene;
    player;
    isRunning = false;

    static level = 1;
    static points = 0;

    static strength = 1;
    static agility = 1;
    static vitality = 1;

    static damage = function () {
        return Player.strength * 2;
    };

    setScene(scene) {
        this.scene = scene.scene;
    }

    create() {
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('player2', { frames: [ 0, 1, 2, 2, 1, 0 ], end: 0 }),
            frameRate: 8,
        });
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNumbers('player_run2', { frames: [ 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0 ], end: 0 }),
            frameRate: 16,
        });

        this.player = this.scene.physics.add.sprite(this.scene.sys.game.canvas.width / 2, this.scene.sys.game.canvas.height / 2);
        this.player.preFX.addGlow();

        this.player.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
            this.isRunning = false;
        }, this);

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
        this.player.speed = Phaser.Math.GetSpeed(300, 1) * 700;
        this.player.damage = 2;
        this.player.experience = 0;
    }

    animateIdle(){
        if (!this.isRunning) {
            this.player.play('idle');
        }
    }

    animateRun() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.player.play('run');
        }
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
            this.player.setVelocity(-this.player.speed, this.player.speed);
            this.player.flipX = false;
        } else if (this.scene.cursors.left.isDown && this.scene.cursors.up.isDown) { // Up and Left
            this.player.setVelocity(-this.player.speed, -this.player.speed);
            this.player.flipX = false;
        } else if (this.scene.cursors.right.isDown && this.scene.cursors.up.isDown) { // Up and Right
            this.player.setVelocity(this.player.speed, -this.player.speed);
            this.player.flipX = true;
        } else if (this.scene.cursors.right.isDown && this.scene.cursors.down.isDown) { // Down and Right
            this.player.setVelocity(this.player.speed, this.player.speed);
            this.player.flipX = true;
        }

        if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) {
            this.animateRun();
        }
    }
}