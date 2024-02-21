class Regeneration {
    static completed = false;
    static activated = false;

    static fish = 0;

    id = 4;
    title = 'Regeneration';
    description = 'Add possibility to regenerate health';
    condition = 'Unlock: collect 10 Fish';
    available = Regeneration.completed;

    imageLearned;
    imageUnlearned;

    constructor(scene) {
        this.scene = scene;
    }

    create() {
        this.imageUnlearned = this.scene.add.image(game.config.width / 2 + 100, game.config.height - 500, 'regen')
            .setInteractive();
        this.imageUnlearned.preFX.addGlow(0x0DEF98FF);
        this.imageLearned = this.scene.add.image(game.config.width / 2 + 100, game.config.height - 500, 'crit_2')
            .setInteractive()
            .setVisible(false);

        if (Regeneration.activated) {
            this.imageLearned.setVisible(true);
            this.imageUnlearned.setVisible(false);
        }
    }

    getIcon() {
        return Regeneration.activated ? this.imageLearned : this.imageUnlearned;
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
            this.imageLearned.setVisible(true);
            this.imageUnlearned.setVisible(false);
            Player.regenerate = true;
        }
    }
}