class Village extends Phaser.Scene {
    constructor() {
        super({
            key: 'VillageScene',
            pack: {
                files: [{
                    type: 'plugin',
                    key: 'rexscripttagloaderplugin',
                    url: '/dist/rexscripttagloaderplugin.js',
                    start: true
                }]
            }
        });
    }

    preload() {
        this.plugins.get('rexscripttagloaderplugin').addToScene(this);
        this.load.rexScriptTag('js/lib/tooltips.js');
        this.load.rexScriptTag('js/achieves/crit.js');
        this.load.rexScriptTag('js/achieves/critPower.js');
        this.load.rexScriptTag('js/achieves/knockBack.js');
        this.load.image('crit', 'img/crit.png');
        this.load.image('crit_2', 'img/crit_2.png');
        this.load.image('lock', 'img/lock.png');
        this.load.image('reborn', 'img/reborn.jpg');
    }

    create() {
        console.log(this.scene.key);

        this.switchScene();

        this.tt = new Tooltip(this);

        const crit = new Crit(this);
        crit.create();
        this.addPerk(crit);

        // let graphics = this.add.graphics({lineStyle: {width: 2, color: 0xdc9835}});
        // graphics.lineBetween(crit.x, crit.y - 25, crit.x, crit.y - 75).setDepth(100);

        const critPower = new CritPower(this);
        critPower.create();
        this.addPerk(critPower);

        const knockBack = new KnockBack(this);
        knockBack.create();
        this.addPerk(knockBack);
    }

    switchScene() {
        this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height - 100, 'reborn')
            .setInteractive()
            .on('pointerdown', function () {
            this.switch('GameScene', 'VillageScene');
        }, this);

        this.events.on('sleep', () => {
            console.log('VillageScene slept');
        });

        this.events.on('wake', (e) => {
            console.log('VillageScene wake');
        });
    }

    switch(to, data) {
        const sceneA = game.scene.getScene('VillageScene');
        const sceneB = game.scene.getScene(to);

        if (sceneA && sceneB && sceneA !== sceneB) {
            this.scene.sleep('VillageScene');

            if (this.scene.isSleeping(to)) {
                this.scene.wake(to, data);
            } else {
                this.scene.start(to, data);
            }
        }
    }

    addPerk(perk) {
        const icon = perk.getIcon();
        if (!perk.available) {
            const lock = this.add.image(icon.x + 15, icon.y - 20, 'lock');
        }

        const tooltipID = perk.id;
        let tooltip = this.tt.createTooltip({
            x: icon.x,
            y: icon.y,
            text: {title: perk.title, description: perk.description, condition: perk.condition},
            id: tooltipID
        });
        this.tt.hideTooltip(tooltipID);
        icon.on('pointerover', function (pointer, item) {
            this.tt.showTooltip(tooltipID, true);
        }, this);
        icon.on('pointerout', function (pointer, item) {
            this.tt.hideTooltip(tooltipID, true);
        }, this);
        icon.on('pointerdown', function (pointer, item) {
            perk.activate();
        }, this);
    }
}