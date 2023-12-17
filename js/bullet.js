class Bullet extends Phaser.GameObjects.Image {
    hit = false;
    constructor(scene) {
        super(scene, 0, 0, 'bullet');
    }

    update(time, delta) {
        if (this.hit || this.y < 0 || this.y > config.battleGround.height || this.x < 0 || this.x > config.battleGround.width) {
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
        // console.log('this.y: ' + this.y + ' this.x: ' + this.x);
    }
}