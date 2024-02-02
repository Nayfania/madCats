class Heart {
    heart;
    health;
    overlay;

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

        let empty = (Player.maxHealth - Player.currentHealth) * (this.heart.height / Player.maxHealth);
        let damage = (this.heart.height / Player.maxHealth);
        let height = empty + damage + 10;

        if (this.overlay === undefined) {
            this.overlay = this.scene.add.graphics();
        } else {
            this.overlay.destroy();
            this.overlay = this.scene.add.graphics();
        }

        this.overlay.fillStyle(0x000000).fillRect(0, 0, 250, height);
        this.overlay.setMask(this.heart.mask);
        this.overlay.setScrollFactor(0, 0);

        this.health.text = 'Health: ' + Player.currentHealth;
    }
}