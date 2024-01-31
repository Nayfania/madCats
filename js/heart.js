class Heart {
    heart;
    health;

    constructor(scene) {
        this.scene = scene;
    }

    addHeart() {
        this.heart = this.scene.add.image(0, 50, 'heart').setOrigin(0);
        this.heart.setScrollFactor(0, 0);
        this.heart.mask = this.heart.createBitmapMask();

        this.health = this.scene.add.text(16, 16, 'Health: ' + Player.currentHealth, {
            fontSize: '32px',
            fill: '#cb1414'
        });
        this.health.setScrollFactor(0, 0);
        this.health.setShadow(2, 2);
    }

    update() {
        const overlay = this.scene.add.graphics();
        let empty = (Player.maxHealth - Player.currentHealth) * (this.heart.height / Player.maxHealth);
        let damage = (this.heart.height / Player.maxHealth) * Player.damage();
        overlay.fillStyle(0x000000).fillRect(0, 0, 250, empty + damage + 10);
        overlay.setMask(this.heart.mask);
        overlay.setScrollFactor(0, 0);

        this.health.text = 'Health: ' + Player.currentHealth;
    }
}