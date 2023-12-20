class Spawn {
    scene;
    player;
    enemies;
    spawnNumber = 0;
    spawns = [
        {name: 'rat', quantity: 10, health: 5, damage: 1, experience: 1},
        {name: 'waran', quantity: 20, health: 10, damage: 5, experience: 2}
    ];

    constructor(scene, player) {
        this.scene = scene.scene;
        this.player = player;
    }

    next() {
        const spawn = this.spawns[this.spawnNumber];
        const minX = this.player.get().x - (this.scene.sys.game.config.width / 2);
        const minY = this.player.get().y - (this.scene.sys.game.config.height / 2);

        this.enemies = this.scene.physics.add.group();
        for (let i = 0; i <= spawn.quantity; i++) {
            const enemy = this.scene.physics.add.image(0, 0, spawn.name);
            enemy.setRandomPosition(minX, minY);
            enemy.health = spawn.health;
            enemy.damage = spawn.damage;
            enemy.experience = spawn.experience;
            this.enemies.add(enemy);
        }

        this.spawnNumber++;

        return this.enemies;
    }

    hasNext() {
        return this.spawnNumber in this.spawns;
    }
}