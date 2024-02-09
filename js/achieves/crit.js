class Crit {
    static completed = false;
    static count = 0;
    static activated = false;

    id = 1;
    title = 'Crit';
    description = 'Chance to hit with multiple damage';
    condition = 'Unlock: 10 Hit in a row';
    available = Crit.completed;

    imageUnlearned;
    imageLearned;

    constructor(scene) {
        this.scene = scene;
    }

    create() {
        this.imageUnlearned = this.scene.add.image(game.config.width / 2, game.config.height - 200, 'crit')
            .setInteractive();
        this.imageLearned = this.scene.add.image(game.config.width / 2, game.config.height - 200, 'crit_2')
            .setVisible(false);

        if (Crit.activated) {
            this.imageLearned.setVisible(true);
            this.imageUnlearned.setVisible(false);
        }
    }

    getIcon() {
        return Crit.activated ? this.imageLearned : this.imageUnlearned;
    }

    static update(scene) {
        if (!Crit.completed) {
            Crit.count++;
            if (Crit.count >= 10) {
                Crit.completed = true;

                var text = scene.add.text(game.config.width / 2 - 200, game.config.height / 2 - 350, 'Congratulations! Crit is unlocked!', {
                    fontSize: '25px',
                    fill: '#ef150d'
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

                console.log('Achievement: Crit: completed');
            }
        }
    }

    static reset() {
        if (!Crit.completed) {
            Crit.count = 0;
        }
    }

    activate() {
        if (Crit.completed && !Crit.activated) {
            console.log('add crit skill');
            Crit.activated = true;
            this.imageLearned.setVisible(true);
            this.imageUnlearned.setVisible(false);
            SkillManager.addSkill('CRIT', 'Crit', '+5% Crit Chance', function (scene) {
                Player.critChance += 5;
            });
        }
    }
}