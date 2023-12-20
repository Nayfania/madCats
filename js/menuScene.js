class Menu extends Phaser.Scene {
    constructor() {
        super({key: 'MenuScene'});
    }

    create() {
        console.log(this.scene.key)

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', function (event) {
            console.log('ESC');
            // game.scene.getScene('MenuScene').scene.scene.input.keyboard.removeKey('ESC');
            // game.scene.getScene('GameScene').scene.scene.input.keyboard.addKey('ESC');
            game.scene.switch('MenuScene', 'GameScene');
        });

        this.events.on('sleep', () => {
            console.log('MenuScene slept');
        });

        this.events.on('wake', () => {
            console.log('MenuScene wake');
        });
    }
}