class CritPower {
    static completed = false;
    static count = 0;
    static activated = false;

    id = 2;
    title = 'Crit Power';
    description = 'Empower crit hit damage';
    condition = 'Unlock: 10 Crit Hit in a row';
    available = CritPower.completed;

    icon;

    constructor(scene) {
        this.scene = scene;
    }

    create() {
        this.icon = this.scene.add.image(game.config.width / 2, game.config.height - 300, 'crit')
            .setInteractive();

        if (CritPower.activated) {
            this.icon.preFX.addGlow(0x0DEF98FF);
        }
    }

    getIcon() {
        return this.icon;
    }

    activate() {
        if (CritPower.completed && !CritPower.activated) {
            console.log('add Crit Power skill');
            CritPower.activated = true;
            this.icon.preFX.addGlow(0x0DEF98FF);
        }
    }
}