class SkillManager {
    grid;
    static availableSkills;

    static skills = [{
        name: 'FATTY',
        title: 'Fatty',
        description: '+50 HP -10 Speed',
        lvl: 1,
        maxLVL: 5,
        apply: function (scene) {
            Player.addHealth(50);
            Player.baseSpeed -= 10;
        }
    }, {
        name: 'STRONG_PAW',
        title: 'Strong Paw',
        description: '+10 Damage -10 Attack Speed',
        lvl: 1,
        maxLVL: 5,
        apply: function (scene) {
            Player.baseDamage += 10;
            Player.baseAttackSpeed += 10;
        }
    }, {
        name: 'SPRY',
        title: 'Spry',
        description: '+30 Speed',
        lvl: 1,
        maxLVL: 5,
        apply: function (scene) {
            Player.baseSpeed += 30;
        }
    }, {
        name: 'SPEEDY',
        title: 'Speedy',
        description: '+20 Attack Speed',
        lvl: 1,
        maxLVL: 5,
        apply: function (scene) {
            Player.baseAttackSpeed -= 20;
        }
    }, {
        name: 'GREEDY',
        title: 'Greedy',
        description: '+10% Exp gain',
        lvl: 1,
        maxLVL: 5,
        apply: function (scene) {
            Player.expPercent += 10;
        }
    }];

    constructor(scene) {
        this.scene = scene;
    }

    static addSkill(name, title, description, apply, lvl = 1, maxLVL = 5) {
        SkillManager.skills.push({
            name: name,
            title: title,
            description: description,
            apply: apply,
            lvl: lvl,
            maxLVL: maxLVL,
        });
    }

    static getSkillRandom() {
        console.log('getSkillRandom');
        const index = Phaser.Math.Between(0, SkillManager.availableSkills.length-1);
        // let index = Phaser.Math.RND.pick(SkillManager.availableSkills);
        if (SkillManager.availableSkills.length === 0) {
            return null;
        }

        const skill = SkillManager.availableSkills[index];

        if (SkillManager.availableSkills.length > 1) {
            SkillManager.availableSkills.splice(index, 1);
        } else {
            SkillManager.availableSkills = [];
        }

        return skill;
    }

    addPanel() {
        if (!Player.needToChooseSkill) {
            return;
        }

        console.log('addPanel');
        SkillManager.availableSkills = SkillManager.skills.filter((skill) => skill.lvl < skill.maxLVL);

        this.grid = this.scene.rexUI.add.gridSizer({
            x: 1400, y: 370,
            width: 300, height: 400,
            column: 1, row: 4,
            columnProportions: 1, rowProportions: 1,
            space: {
                top: 20, bottom: 20, left: 10, right: 10,
                column: 4, row: 10
            },

            createCellContainerCallback: function (scene, column, row, config) {

                config.expand = true;
                const skill = SkillManager.getSkillRandom();
                if (skill === null) {
                    return null;
                }

                const skillButton = SkillManager.createButton(scene, skill.name, skill.title + ' (LVL '+skill.lvl+')', skill.description)
                    .setInteractive();

                skillButton.on('pointerdown', function () {
                    if (Player.needToChooseSkill) {
                        Player.needToChooseSkill = false;

                        skill.apply(scene);
                        skill.lvl++;
                        scene.updatePoints();
                        this.grid.visible = false;
                    }
                }.bind(this));

                return skillButton;
            }.bind(this)
        }).layout();

        this.update();
    }

    update() {
        this.grid.visible = Player.needToChooseSkill;
    }

    static createButton(scene, name, title, text) {
        return scene.rexUI.add.titleLabel({
            name: name,
            layoutMode: 0,
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10).setStrokeStyle(2, 0xcb1414),
            title: scene.add.text(0, 0, title, {fontSize: 24, fill: '#06ad0d'}),
            separator: scene.rexUI.add.roundRectangle({height: 4, color: 0xBEBEBE}),
            // icon: iconGameObject,
            iconMask: false,
            text: scene.add.text(0, 0, text, {fontSize: 20, fill: '#000000'}),
            align: {
                title: 'left',
                text: 'left',
            },
            space: {
                left: 10, right: 10, top: 0, bottom: 0,
                innerLeft: 0, innerRight: 0, innerTop: 0, innerBottom: 0,

                title: 0, titleLeft: 0, titleRight: 0,
                icon: 0, iconTop: 0, iconBottom: 0,
                text: 0, textLeft: 0, textRight: 0,
                separator: 0, separatorLeft: 0, separatorRight: 0,
                actionTop: 0, actionBottom: 0,
            }
        });
    }

    static getSkillByName(name) {
        for (let i = 0; i < SkillManager.skills.length; i++) {
            if (SkillManager.skills[i].name === name) {
                return SkillManager.skills[i];
            }
        }

        return null;
    }
}