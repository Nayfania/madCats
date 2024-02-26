class Butterflies {
    constructor(scene) {
        this.scene = scene;
        this.create();
    }

    butterflies = {};

    create() {
        this.butterflies.butterfly_green = this.createLabel('butterfly_green');
        this.butterflies.butterfly_gold = this.createLabel('butterfly_gold');
        this.butterflies.butterfly_purple = this.createLabel('butterfly_purple');
        this.recalcLabelsPosition();
    }

    createLabel(type) {
        return this.scene.rexUI.add.label({
            background: this.scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0x4e342e),
            icon: this.scene.add.image(0, 0, type),
            // text: this.add.text(0, 0, '10.0'),
            iconSize: 40,
            space: {left: 10, right: 10, top: 10, bottom: 10, icon: 10}
        })
            .setScrollFactor(0, 0)
            .layout()
            .setVisible(false);
    }

    recalcLabelsPosition() {
        let labelY = 200;
        if (this.butterflies.butterfly_green.visible) {
            labelY += 100;
            this.butterflies.butterfly_green.setPosition(1850, labelY);
        }
        if (this.butterflies.butterfly_gold.visible) {
            labelY += 100;
            this.butterflies.butterfly_gold.setPosition(1850, labelY);
        }
        if (this.butterflies.butterfly_purple.visible) {
            labelY += 100;
            this.butterflies.butterfly_purple.setPosition(1850, labelY);
        }
    }

    spawn() {
        const x = Phaser.Math.Between(50, Game.battleGround.width - 50);
        const y = Phaser.Math.Between(50, Game.battleGround.width - 50);
        const image = Phaser.Math.RND.pick(['butterfly_green', 'butterfly_gold', 'butterfly_purple']);

        const butterfly = this.scene.physics.add.image(x, y, image);
        butterfly.type = image;
        const butterflyPickUp = this.scene.physics.add.overlap(butterfly, this.scene.player.get(), function (butterfly, player) {
            console.log('pick up Butterfly');
            switch (butterfly.type) {
                case 'butterfly_green':
                    if (!this.butterflies.butterfly_green.visible) {
                        Player.expPercent *= 2;
                        this.butterflies.butterfly_green.setVisible(true);
                    }
                    break;
                case 'butterfly_gold':
                    if (!this.butterflies.butterfly_gold.visible) {
                        Player.baseDamage *= 2;
                        this.butterflies.butterfly_gold.setVisible(true);
                    }
                    break;
                case 'butterfly_purple':
                    if (!this.butterflies.butterfly_purple.visible) {
                        Player.baseSpeed *= 2;
                        Player.baseAttackSpeed /= 2;
                        this.butterflies.butterfly_purple.setVisible(true);
                    }
                    break;
            }
            this.recalcLabelsPosition();

            butterfly.destroy();
            butterflyPickUp.active = false;

            this.scene.time.addEvent({
                delay: 5000,
                callbackScope: this,
                loop: false,
                callback: function () {
                    console.log('switch off Butterfly');
                    switch (butterfly.type) {
                        case 'butterfly_green':
                            Player.expPercent /= 2;
                            this.butterflies.butterfly_green.setVisible(false);
                            break;
                        case 'butterfly_gold':
                            Player.baseDamage /= 2;
                            this.butterflies.butterfly_gold.setVisible(false);
                            break;
                        case 'butterfly_purple':
                            Player.baseSpeed /= 2;
                            Player.baseAttackSpeed *= 2;
                            this.butterflies.butterfly_purple.setVisible(false);
                            break;
                    }
                    this.recalcLabelsPosition();
                }
            });
        }, null, this);
    }
}