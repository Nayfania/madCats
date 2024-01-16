class Bullet extends Phaser.GameObjects.Image {
    hit = false;
    static speed = Phaser.Math.GetSpeed(1000000, 1);

    constructor(scene) {
        super(scene, 0, 0, 'bullet');
    }

    update(time, delta) {
        if (this.hit || this.y <= 0 || this.y > Scene.battleGround.height || this.x <= 0 || this.x > Scene.battleGround.width) {
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
        // console.log('this.y: ' + this.y + ' this.x: ' + this.x);
    }
}