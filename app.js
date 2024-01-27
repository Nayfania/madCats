var game = new Phaser.Game({
    width: 1900,
    height: 900,
    battleGround: {width: 1280 * 2, height: 1024 * 2},
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
    },
    transparent: true,
    scene: [
        Game,
        Menu,
        Village
    ]
});