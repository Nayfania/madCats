class Spawn {
    scene;
    player;
    enemies;
    wave;

    spawnNumber = 0;
    spawns = [
        {name: 'rat', quantity: 50, pack: 10, health: 1, damage: 20, experience: 1},
        {name: 'boss', quantity: 1, pack: 1, health: 300, damage: 50, experience: 10},
        {name: 'rat2', quantity: 50, pack: 10, health: 30, damage: 7, experience: 2},
        {name: 'rat3', quantity: 50, pack: 10, health: 50, damage: 10, experience: 3},
        {name: 'rat4', quantity: 50, pack: 10, health: 50, damage: 10, experience: 3},
        {name: 'rat5', quantity: 50, pack: 10, health: 50, damage: 10, experience: 3},
    ];

    static speed = Phaser.Math.GetSpeed(10000, 1) * 10;

    movable = true;

    constructor(scene, player) {
        this.scene = scene.scene;
        this.player = player;

        this.wave = this.scene.add.text(1600, 30, 'Wave: 1', {fontSize: '32px', fill: '#06ad0d'});
        this.wave.setScrollFactor(0, 0);
        this.wave.setShadow(2, 2);

        this.enemiesText = this.scene.add.text(16, 350, 'Enemies: ', {fontSize: '32px', fill: '#cccccc'});
        this.enemiesText.setScrollFactor(0, 0);
        this.enemiesText.setShadow(2, 2);

        this.enemies = this.scene.physics.add.group();
    }

    next() {
        const spawn = this.spawns[this.spawnNumber];
        for (let i = 0; i < spawn.pack && spawn.quantity > 0; i++) {
            spawn.quantity--;

            const enemy = this.scene.physics.add.image(this.getRandomX(), this.getRandomY(), spawn.name);
            enemy.fullHealth = spawn.health;
            enemy.health = spawn.health;
            enemy.damage = spawn.damage;
            enemy.experience = spawn.experience;
            enemy.getHealthPercentage = function () {
                return (this.health / this.fullHealth) * 100;
            };
            enemy.bar = new HealthBar(this.scene, enemy);
            enemy.animateDie = function() {
                enemy.setVelocity(0, 0);
                let soul = this.scene.add.image(enemy.x, enemy.y, 'soul');
                this.scene.tweens.add({
                    targets: [soul],
                    duration: 2000,
                    y: {from: enemy.y, to: enemy.y - 300},
                    alpha: {from: 1, to: 0},
                    ease: 'Power1',
                    onComplete: function () {
                        soul.destroy();
                    }
                });
            }.bind(this);

            this.enemies.add(enemy);
        }

        if (spawn.quantity === 0) {
            this.spawnNumber++;
        }

        this.wave.text = 'Wave: ' + (this.spawnNumber + 1);
        this.enemiesCount();

        return this.enemies;
    }

    hasNext() {
        return this.spawnNumber in this.spawns;
    }

    enemiesCount() {
        this.enemiesText.text = 'Enemies: ' + this.enemies.getTotalUsed();
    }

    getRandomX() {
        const minX = this.player.get().x - (this.scene.sys.game.config.width / 2);
        let x = minX + (Math.random() * this.scene.sys.scale.width);

        if (this.player.get().x <= x - 200 || this.player.get().x >= x + 200) {
            return x;
        }

        return this.getRandomX();
    }

    getRandomY() {
        const minY = this.player.get().y - (this.scene.sys.game.config.height / 2);
        let y = minY + (Math.random() * this.scene.sys.scale.height);

        if (this.player.get().y <= y - 200 || this.player.get().y >= y + 200) {
            return y;
        }

        return this.getRandomY();
    }
}