class Spawn {
    scene;
    player;
    enemies;
    wave;
    spawnNumber = 0;
    spawns = [
        {name: 'rat', quantity: 5, health: 1, damage: 1, experience: 1},
        {name: 'rat2', quantity: 5, health: 1, damage: 5, experience: 2},
        {name: 'rat3', quantity: 5, health: 1, damage: 5, experience: 2},
    ];

    constructor(scene, player) {
        this.scene = scene.scene;
        this.player = player;

        this.wave = this.scene.add.text(16, 250, 'Wave: 1', {fontSize: '32px', fill: '#06ad0d'});
        this.wave.setScrollFactor(0, 0);
        this.wave.setShadow(2, 2);
    }

    next() {
        const spawn = this.spawns[this.spawnNumber];
        const minX = this.player.get().x - (this.scene.sys.game.config.width / 2);
        const minY = this.player.get().y - (this.scene.sys.game.config.height / 2);

        this.enemies = this.scene.physics.add.group();
        for (let i = 0; i < spawn.quantity; i++) {
            const enemy = this.scene.physics.add.image(0, 0, spawn.name);
            enemy.setRandomPosition(minX, minY);
            enemy.fullHealth = spawn.health;
            enemy.health = spawn.health;
            enemy.damage = spawn.damage;
            enemy.experience = spawn.experience;
            enemy.getHealthPercentage = function () { return (this.health / this.fullHealth) * 100; };
            enemy.bar = new HealthBar(this.scene, enemy);
            this.enemies.add(enemy);
        }

        this.spawnNumber++;

        this.wave.text = 'Wave: '+this.spawnNumber;

        return this.enemies;
    }

    hasNext() {
        return this.spawnNumber in this.spawns;
    }
}