class Crit {
    static completed = false;
    static count = 0;
    static activated = false;

    static update(scene) {
        if (!Crit.completed) {
            Crit.count++;
            if (Crit.count >= 10) {
                Crit.completed = true;

                var text = scene.add.text(scene.player.get().x - 200, scene.player.get().y - 350, 'Congratulations! Crit is unlocked!', {
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
            console.log('Achievement: Crit: reset');
        }
    }

    static activate() {
        if (Crit.completed) {
            Crit.activated = true;
        }
    }
}