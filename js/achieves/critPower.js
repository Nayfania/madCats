class CritPower {
    static completed = false;
    static count = 0;
    static activated = false;

    id = 2;
    title = 'Crit Power';
    description = 'Empower crit hit damage';
    condition = 'Unlock: 10 Crit Hit in a row';
    available = CritPower.completed;

    imageLearned;
    imageUnlearned;

    constructor(scene) {
        this.scene = scene;
    }

    create() {
        this.imageUnlearned = this.scene.add.image(game.config.width / 2, game.config.height - 300, 'crit')
            .setInteractive();
        this.imageLearned = this.scene.add.image(game.config.width / 2, game.config.height - 200, 'crit_2')
            .setVisible(false);

        if (CritPower.activated) {
            this.imageLearned.setVisible(true);
            this.imageUnlearned.setVisible(false);
        }
    }

    getIcon() {
        return CritPower.activated ? this.imageLearned : this.imageUnlearned;
    }
}