class HealLvlUp {
    static completed = false;
    static activated = false;

    id = 5;
    title = 'Heal Lvl Up';
    description = 'Heal +30 per Lvl Up';
    condition = 'Unlock: get 20 Lvl Ups';
    available = HealLvlUp.completed;

    icon;

    constructor(scene) {
        this.scene = scene;
    }

    create() {
        this.icon = this.scene.add.image(game.config.width / 2 + 100, game.config.height - 600, 'healLvlUp')
            .setInteractive();

        if (HealLvlUp.activated) {
            this.icon.preFX.addGlow(0x0DEF98FF);
        }
    }

    getIcon() {
        return this.icon;
    }

    static update(scene) {
        if (!HealLvlUp.completed) {
            if (Player.level >= 20) {
                HealLvlUp.completed = true;

                var text = scene.add.text(game.config.width / 2 - 200, game.config.height / 2 - 350, 'Congratulations! HealLvlUp is unlocked!', {
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

                console.log('Achievement: HealLvlUp: completed');
            }
        }
    }

    activate() {
        if (HealLvlUp.completed && !HealLvlUp.activated) {
            console.log('Add HealLvlUp skill');
            HealLvlUp.activated = true;
            this.icon.preFX.addGlow(0x0DEF98FF);
            Player.healLvlUp = true;
        }
    }
}