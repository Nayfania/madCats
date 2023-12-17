class Spawn {
    scene;
    enemies;
    spawn = 1;

    constructor(scene) {
        this.scene = scene.scene;
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

        this.spawn++;

        return this.enemies;
    }
}