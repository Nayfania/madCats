class Background {
    scene;

    constructor(scene) {
        this.scene = scene.scene;

        //  Mash 4 images together to create our background
        this.scene.add.image(0, 0, 'bg').setOrigin(0);
        this.scene.add.image(1280, 0, 'bg').setOrigin(0).setFlipX(true);
        this.scene.add.image(0, 1024, 'bg').setOrigin(0).setFlipY(true);
        this.scene.add.image(1280, 1024, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);
    }
}