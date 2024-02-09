class KnockBack {
    static completed = false;
    static count = 0;
    static activated = false;

    id = 3;
    title = 'Knock Back';
    description = 'Knock enemies back';
    condition = 'Unlock: get 10 Strengths';
    available = KnockBack.completed;

    imageLearned;
    imageUnlearned;

    constructor(scene) {
        this.scene = scene;
    }

    create() {
        this.imageUnlearned = this.scene.add.image(game.config.width / 2 + 100, game.config.height - 400, 'crit')
            .setInteractive();
        this.imageLearned = this.scene.add.image(game.config.width / 2 + 100, game.config.height - 400, 'crit_2')
            .setInteractive()
            .setVisible(false);

        if (KnockBack.activated) {
            this.imageLearned.setVisible(true);
            this.imageUnlearned.setVisible(false);
        }
    }

    getIcon() {
        return KnockBack.activated ? this.imageLearned : this.imageUnlearned;
    }

    static update(scene) {
        if (!KnockBack.completed) {
            if (Player.strength >= 1) {
                KnockBack.completed = true;

                var text = scene.add.text(game.config.width / 2 - 200, game.config.height / 2 - 350, 'Congratulations! KnockBack is unlocked!', {
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

                console.log('Achievement: KnockBack: completed');
            }
        }
    }

    activate() {
        if (KnockBack.completed && !KnockBack.activated) {
            console.log('Add KnockBack skill');
            KnockBack.activated = true;
            this.imageLearned.setVisible(true);
            this.imageUnlearned.setVisible(false);
            SkillManager.addSkill('KNOCK_BACK', 'Knock Back', '+10% Chance to Knock Back', function (scene) {
                Player.knockBackChance += 10;
            });
        }
    }
}