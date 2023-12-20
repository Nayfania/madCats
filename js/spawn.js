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
        const span = 200;
        this.enemies = this.scene.physics.add.group();
        for (let i = 0; i <= 5; i++) {
            const enemy = this.scene.physics.add.image(1120 + (span*i), 500, 'enemy');
            enemy.health = 50;
            enemy.damage = 10;
            this.enemies.add(enemy);
        }

        this.spawnNumber++;

        return this.enemies;
    }

    hasNext() {
        return this.spawnNumber in this.spawns;
    }
}