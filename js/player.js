class Player {
    scene;
    player;
    isRunning = false;

    static level = 1;
    static points = 0;
    static pointsPerLVLUp = 1;

    static health = 100;
    static currentHealth = 100;

    static strength = 1; // Damage
    static agility = 1; // Speed
    static vitality = 1; // Health
    static dexterity = 1; // Attack Speed

    static baseDamage = 1;
    static baseSpeed = 100;
    static baseAttackSpeed = 1500; // ms

    static killed = 0;

    static addHealth(value) {
        Player.health += value;
        Player.currentHealth += value;
    }

    static damage() {
        return Player.baseDamage + Player.strength * 2;
    };

    static speed = function () {
        return Player.baseSpeed + (Player.agility * 10);
    }

    static attackSpeed = function () {
        return Player.baseAttackSpeed - (Player.dexterity * 10);
    }

    setScene(scene) {
        this.scene = scene.scene;
    }

    create() {
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('player', {frames: [0, 1, 2, 2, 1, 0], end: 0}),
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
        this.player.damage = 2;
        this.player.experience = 0;
    }

    animateIdle() {
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
        if (this.cursors.left.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) { // Left
            this.player.setVelocityX(-Player.speed());
            this.player.flipX = false;
        } else if (this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) { // Right
            this.player.setVelocityX(Player.speed());
            this.player.flipX = true;
        } else if (this.cursors.up.isDown && !this.cursors.right.isDown && !this.cursors.left.isDown) { // Up
            this.player.setVelocityY(-Player.speed());
        } else if (this.cursors.down.isDown && !this.cursors.right.isDown && !this.cursors.left.isDown) { // Down
            this.player.setVelocityY(Player.speed());
        } else if (this.cursors.left.isDown && this.cursors.down.isDown) { // Down and Left
            this.player.setVelocity(-Player.speed(), Player.speed());
            this.player.flipX = false;
        } else if (this.cursors.left.isDown && this.cursors.up.isDown) { // Up and Left
            this.player.setVelocity(-Player.speed(), -Player.speed());
            this.player.flipX = false;
        } else if (this.cursors.right.isDown && this.cursors.up.isDown) { // Up and Right
            this.player.setVelocity(Player.speed(), -Player.speed());
            this.player.flipX = true;
        } else if (this.cursors.right.isDown && this.cursors.down.isDown) { // Down and Right
            this.player.setVelocity(Player.speed(), Player.speed());
            this.player.flipX = true;
        }

        if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) {
            this.animateRun();
        }
    }
}