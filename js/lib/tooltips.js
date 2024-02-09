class Tooltip {

    constructor(scene) {

        this.scene = scene;
        this.systems = scene.sys;

        this.tooltipCollection = {};
    }

    hideTooltip(id, animate) {

        if (animate) {
            let isTweening = this.scene.tweens.isTweening(this.tooltipCollection[id].container);
            if (isTweening) {
                this.scene.tweens.killTweensOf(this.tooltipCollection[id].container);
            }

            this.tween = this.scene.tweens.add({
                targets: this.tooltipCollection[id].container,
                alpha: 0,
                ease: 'Power1',
                duration: 250,
                delay: 0,
                onComplete: o => {
                    //this.tween = null;
                },
            });

        } else {
            this.tooltipCollection[id].container.visible = false;
        }
    }

    showTooltip(id, animate) {

        if (animate) {
            this.tooltipCollection[id].container.alpha = 0;
            this.tooltipCollection[id].container.visible = true;
            this.scene.children.bringToTop(this.tooltipCollection[id].container);

            let isTweening = this.scene.tweens.isTweening(this.tooltipCollection[id].container);
            if (isTweening) {
                this.scene.tweens.killTweensOf(this.tooltipCollection[id].container);
            }

            this.tween = this.scene.tweens.add({
                targets: this.tooltipCollection[id].container,
                alpha: 1,
                ease: 'Power1',
                duration: 300,
                delay: 0,
                onComplete: o => {
                    //this.tween = null;
                },
            });
        } else {
            this.tooltipCollection[id].container.visible = true;
            this.scene.children.bringToTop(this.tooltipCollection[id].container);
        }
    }

    createTooltip(options) {

        let container = this.scene.add.container(0, 0);

        let title = this.createLabel(0, 0, options.text.title, "#dc9835");
        let description = this.createLabel(0, 0, options.text.description, "#b9b9b9");
        let condition = this.createLabel(0, 0, options.text.condition, "#9fdc35");

        container.width = Math.max(title.displayWidth, description.displayWidth, condition.displayWidth);
        container.height = title.displayHeight + description.displayHeight + condition.displayHeight;

        let background = this.createBackground(container, options.x, options.y, container.width, container.height);

        title.x = background.rect.x + 10;
        description.x = background.rect.x + 10;
        condition.x = background.rect.x + 10;

        title.y = background.rect.y + 5;
        description.y = background.rect.y + 30;
        condition.y = background.rect.y + 55;

        container.width = background.rect.width;
        container.height = background.rect.height;

        container.add(title);
        container.add(description);
        container.add(condition);
        container.x = options.x;
        container.y = options.y;

        this.tooltipCollection[options.id] = {
            container: container,
            options: options
        };

        return container;
    }

    getHeight(id) {
        return this.tooltipCollection[id].container.height;
    }

    createLabel(x, y, data, color) {

        let text = this.scene.add.text(x, y, data, {fontFamily: 'new_rockerregular', fontSize: 19, color: color});

        let shadowColor = "#ffffff";
        let blur = 1;
        let shadowStroke = false;
        let shadowFill = true;
        text.setShadow(0, 0, shadowColor, blur, shadowStroke, shadowFill);

        return text;
    }

    createBackground(container, x, y, width, height) {

        var paddingTop = 12;
        var paddingBottom = 12;
        var paddingLeft = 16;
        var paddingRight = 16;
        let lineStyle = {
            width: 2,
            color: 0x000000,
            alpha: 0.9
        };
        let fillStyle = {
            color: 0x000000,
            alpha: 0.9
        };

        var graphics = this.scene.add.graphics({
            lineStyle: lineStyle,
            fillStyle: fillStyle
        });

        let _width = width + paddingLeft + paddingRight;
        let _height = height + paddingTop + paddingBottom;

        var rect = new Phaser.Geom.Rectangle(-_width / 2 + width / 2, 0, _width, _height);
        rect.width = _width;
        rect.height = _height;
        graphics.fillRectShape(rect);
        container.add(graphics);

        return {rect: rect, graphic: graphics};
    }
}