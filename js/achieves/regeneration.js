class Regeneration {
    static completed = false;
    static activated = false;

    static fish = 0;

    id = 4;
    title = 'Regeneration';
    description = 'Add possibility to regenerate health';
    condition = 'Unlock: collect 10 Fish';
    available = Regeneration.completed;

    icon;

    constructor(scene) {
        this.scene = scene;
    }

    create() {
        this.icon = this.scene.add.image(game.config.width / 2 + 100, game.config.height - 500, 'regen')
            .setInteractive();

        if (Regeneration.activated) {
            this.icon.preFX.addGlow(0x0DEF98FF);
        }
    }

    getIcon() {
        return this.icon;
    }

    static update(scene) {
        if (!Regeneration.completed) {
            Regeneration.fish++;
            if (Regeneration.fish >= 10) {
                Regeneration.completed = true;

                var text = scene.add.text(game.config.width / 2 - 200, game.config.height / 2 - 350, 'Congratulations! Regeneration is unlocked!', {
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

                console.log('Achievement: KnockBack: completed');
            }
        }
    }

    activate() {
        if (Regeneration.completed && !Regeneration.activated) {
            console.log('Add Regeneration skill');
            Regeneration.activated = true;
            this.icon.preFX.addGlow(0x0DEF98FF);
            Player.regenerate = true;
        }
    }
}