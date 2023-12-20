var game = new Phaser.Game({
    width: 1900,
    height: 900,
    battleGround: {width: 1280 * 2, height: 1024 * 2},
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
    },
    scene: [Scene, Menu]
});
// game.scene.getScene('Demo').setVisible(false);
