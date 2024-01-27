class Player {
    scene;
    player;
    isRunning = false;

    static level = 1;
    static points = 0;
    static pointsPerLVLUp = 1;

    static health = 100;
    static currentHealth = 1;

    static strength = 1; // Damage
    static agility = 1; // Speed
    static vitality = 1; // Health
    static dexterity = 1; // Attack Speed

    static baseDamage = 1;
    static baseSpeed = 100;
    static baseAttackSpeed = 500; // ms

    static critChance = 0; // %
    static isCrit = false;

    static killed = 0;

    static addHealth(value) {
        Player.health += value;
        Player.currentHealth += value;
    }

    static damage() {
        let damage = Player.baseDamage + Player.strength * 2;

        if (Player.critChance > 0 && (Math.random() * 100) <= Player.critChance) {
            Player.isCrit = true;
            return damage * 2;
        }

        Player.isCrit = false;

        return damage;
    };

    takeDamage(enemy) {
        this.showDamage(enemy.damage, this.player, "#ff0000");
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

        this.scene.input.on('pointermove', (pointer) => {
            this.player.flipX = this.player.x <= pointer.worldX;
        });
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
        } else if (this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) { // Right
            this.player.setVelocityX(Player.speed());
        } else if (this.cursors.up.isDown && !this.cursors.right.isDown && !this.cursors.left.isDown) { // Up
            this.player.setVelocityY(-Player.speed());
        } else if (this.cursors.down.isDown && !this.cursors.right.isDown && !this.cursors.left.isDown) { // Down
            this.player.setVelocityY(Player.speed());
        } else if (this.cursors.left.isDown && this.cursors.down.isDown) { // Down and Left
            this.player.setVelocity(-Player.speed(), Player.speed());
        } else if (this.cursors.left.isDown && this.cursors.up.isDown) { // Up and Left
            this.player.setVelocity(-Player.speed(), -Player.speed());
        } else if (this.cursors.right.isDown && this.cursors.up.isDown) { // Up and Right
            this.player.setVelocity(Player.speed(), -Player.speed());
        } else if (this.cursors.right.isDown && this.cursors.down.isDown) { // Down and Right
            this.player.setVelocity(Player.speed(), Player.speed());
        }

        if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) {
            this.animateRun();
        }
    }

    showDamage(text, object, color, fontSize = 42, animation = 'up') {
        let floatingNumbers = new FloatingNumbersPlugin(this.scene, Phaser.Plugins.BasePlugin);
        floatingNumbers.createFloatingText({
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
}