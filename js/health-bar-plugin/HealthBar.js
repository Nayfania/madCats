class HealthBar extends Phaser.GameObjects.Graphics {

    constructor(scene, gameObject) {
        super(scene);
        this.gameObject = gameObject;
        this.x = this.gameObject.x - (this.gameObject.width / 2);
        this.y = this.gameObject.y - (this.gameObject.height / 2);
        this.scene = scene;
        this.options = {
            x: -80,
            y: -100,
            width: 130,
            height: 10,
            foreground: 0x8fff00,
            background: 0x000000,
        };

        this.boot();
        this.setDepth(10);
        this.scene.add.existing(this);
        this.setActive(true);
    }

    boot() {
        this.clear();

        this.fillStyle(this.options.background);
        this.fillRect(this.options.x-4, this.options.y, this.options.width, this.options.height);

        this.fillStyle(this.options.foreground);
        this.fillRect(this.options.x-2, this.options.y+2, this.options.width - 4, this.options.height - 4);
    }

    update() {
        if (!this.gameObject) {
            return;
        }

        if (this.gameObject.getHealthPercentage() === this.oldHealth) {
            return;
        }

        this.updateBar();

        this.oldHealth = this.gameObject.getHealthPercentage();
        if (this.gameObject.getHealthPercentage() <= 0) {
            this.destroy();
        }
    }

    updateBar() {
        this.clear();

        this.fillStyle(this.options.background);
        this.fillRect(this.options.x-4, this.options.y, this.options.width, this.options.height);

        if (this.gameObject.getHealthPercentage() < 50) {
            this.fillStyle(0xff0000);
        } else {
            this.fillStyle(0x00ff00);
        }

        var d = Math.floor(((this.options.width - 4) / 100) * this.gameObject.getHealthPercentage());

        this.fillRect(this.options.x-2, this.options.y+2, d, this.options.height - 4);
    };

    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy() {
        console.log('Health Bar: destroy');
        this.clear();
        this.scene = undefined;
    }
}