class Crit {
    static completed = false;
    static count = 0;
    static activated = false;

    static hitInARow = 20;

    id = 1;
    title = 'Crit';
    description = 'Chance to hit with multiple damage';
    condition = 'Unlock: ' + Crit.hitInARow + ' Hit in a row';
    available = Crit.completed;

    icon;

    constructor(scene) {
        this.scene = scene;
    }

    create() {
        this.icon = this.scene.add.image(game.config.width / 2, game.config.height - 200, 'crit')
            .setInteractive();

        if (Crit.activated) {
            this.icon.preFX.addGlow(0x0DEF98FF);
        }
    }

    getIcon() {
        return this.icon;
    }

    static update(scene) {
        if (!Crit.completed) {
            Crit.count++;
            if (Crit.count >= Crit.hitInARow) {
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
            this.icon.preFX.addGlow(0x0DEF98FF);
            SkillManager.addSkill('CRIT', 'Crit', '+5% Crit Chance', function (scene) {
                Player.critChance += 5;
            });
        }
    }
}