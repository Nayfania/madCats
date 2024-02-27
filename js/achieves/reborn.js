class Reborn {
    static completed = false;
    static activated = false;

    id = 6;
    title = 'Reborn';
    description = 'New Avatar!';
    condition = 'Unlock: rich 100 lvl';
    available = Reborn.completed;

    constructor(scene) {
        this.scene = scene;
    }

    create() {
        const x = game.config.width / 2 + 100;
        const y = game.config.height - 700;
        this.icon = this.scene.add.image(x, y, 'reborn').setInteractive();

        if (Reborn.activated) {
            this.icon.preFX.addGlow(0x0DEF98FF);
        }
    }

    getIcon() {
        return this.icon;
    }

    activate() {
        if (Reborn.completed && !Reborn.activated) {
            console.log('Reborn!');
            Reborn.activated = true;
            this.icon.preFX.addGlow(0x0DEF98FF);
            Player.reborn = true;
        }
    }

    static update(scene) {
        if (!Reborn.completed) {
            if (Player.level >= 1) {
                Reborn.completed = true;

                const text = scene.add.text(game.config.width / 2 - 200, game.config.height / 2 - 350, 'Congratulations! Reborn is unlocked!', {
                    fontSize: '25px',
                    fill: '#0def98'
                });
                text.setShadow(2, 1);

                scene.tweens.add({
                    targets: [text],
                    duration: 10000,
                    alpha: {from: 1, to: 0},
                    ease: 'Power1',
                    onComplete: function () {
                        text.destroy();
                    }
                });

                console.log('Achievement: Reborn: completed');
            }
        }
    }
}