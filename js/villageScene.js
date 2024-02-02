class Village extends Phaser.Scene {
    constructor() {
        super({
            key: 'VillageScene',
            pack: {
                files: [{
                    type: 'plugin',
                    key: 'rexscripttagloaderplugin',
                    url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexscripttagloaderplugin.min.js',
                    start: true
                }]
            }
        });
    }

    preload() {
        this.plugins.get('rexscripttagloaderplugin').addToScene(this);
        this.load.rexScriptTag('js/lib/tooltips.js');
        this.load.rexScriptTag('js/achieves/crit.js');
        this.load.image('crit', 'img/crit.png');
        this.load.image('crit_2', 'img/crit_2.png');
        this.load.image('lock', 'img/lock.png');
        this.load.image('reborn', 'img/reborn.jpg');
    }

    create() {
        console.log(this.scene.key);

        this.tt = new Tooltip(this);

        this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height - 100, 'reborn')
            .setInteractive().on('pointerdown', function () {
            this.switch('GameScene', 'VillageScene');
        }, this);

        this.events.on('sleep', () => {
            console.log('VillageScene slept');
        });

        this.events.on('wake', (e) => {
            console.log('VillageScene wake');
        });

        const crit = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height - 200, 'crit').setInteractive();
        const crit2 = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height - 200, 'crit_2').setVisible(false);
        crit.id = 1;
        crit.title = 'Crit';
        crit.description = 'Chance to hit with multiple damage';
        crit.condition = 'Unlock: 10 Hit in a row';
        crit.available = Crit.completed;
        this.addPerk(crit);
        crit.on('pointerdown', function (pointer, item) {
            if (crit.available) {
                console.log('add crit skill');
                crit2.setVisible(true);
                crit.setVisible(false);
                SkillManager.addSkill('CRIT', 'Crit', '+5% Crit Chance', function (scene) {
                    Player.critChance += 5;
                });
            }
        });

        let graphics = this.add.graphics({lineStyle: {width: 2, color: 0xdc9835}});
        graphics.lineBetween(crit.x, crit.y - 25, crit.x, crit.y - 75).setDepth(100);

        const critPower = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height - 300, 'crit').setInteractive();
        critPower.id = 2;
        critPower.title = 'Crit Power';
        critPower.description = 'Empower crit hit damage';
        critPower.condition = 'Unlock: 10 Crit Hit in a row';
        critPower.available = false;
        this.addPerk(critPower);
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
        if (!perk.available) {
            const lock = this.add.image(perk.x + 15, perk.y - 20, 'lock');
        }

        const tooltipID = perk.id;
        let tooltip = this.tt.createTooltip({
            x: perk.x,
            y: perk.y,
            hasBackground: true,
            text: {title: perk.title, description: perk.description, condition: perk.condition},
            id: tooltipID,
            target: perk
        });
        this.tt.hideTooltip(tooltipID);
        perk.on('pointerover', function (pointer, item) {
            this.tt.showTooltip(tooltipID, true);
        }, this);
        perk.on('pointerout', function (pointer, item) {
            this.tt.hideTooltip(tooltipID, true);
        }, this);
    }
}