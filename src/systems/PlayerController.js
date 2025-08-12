class PlayerController {
    constructor(scene, x, y) {
        this.scene = scene;
        this.startX = x;
        this.startY = y;
        
        // 椭圆活动范围参数
        this.ellipseCenterX = 596.74;
        this.ellipseCenterY = 471.345;
        this.ellipseRadiusX = 698.14 / 2;
        this.ellipseRadiusY = 620.33 / 2;
        
        this.speed = 300;
        this.createPlayer();
        this.setupControls();
    }

    createPlayer() {
        this.player = this.scene.physics.add.sprite(this.startX, this.startY, 'player');
        this.player.setDisplaySize(92, 83);
        this.player.setCollideWorldBounds(false);
        this.player.body.setSize(80, 70); // 略小于显示尺寸，保证擦弹感
    }

    setupControls() {
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.wasd = this.scene.input.keyboard.addKeys('W,S,A,D');
    }

    update() {
        if (!this.player || !this.player.active) return;

        let velocityX = 0;
        let velocityY = 0;

        // 处理输入
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            velocityX = -this.speed;
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            velocityX = this.speed;
        }

        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            velocityY = -this.speed;
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            velocityY = this.speed;
        }

        // 计算新位置
        const newX = this.player.x + velocityX * this.scene.game.loop.delta / 1000;
        const newY = this.player.y + velocityY * this.scene.game.loop.delta / 1000;

        // 检查是否在椭圆范围内
        if (this.isInsideEllipse(newX, newY)) {
            this.player.setVelocity(velocityX, velocityY);
        } else {
            // 计算到椭圆边界的最近点
            const constrainedPos = this.constrainToEllipse(newX, newY);
            this.player.x = constrainedPos.x;
            this.player.y = constrainedPos.y;
            this.player.setVelocity(0, 0);
        }
    }

    isInsideEllipse(x, y) {
        const dx = (x - this.ellipseCenterX) / this.ellipseRadiusX;
        const dy = (y - this.ellipseCenterY) / this.ellipseRadiusY;
        return (dx * dx + dy * dy) <= 1;
    }

    constrainToEllipse(x, y) {
        const dx = x - this.ellipseCenterX;
        const dy = y - this.ellipseCenterY;
        
        const angle = Math.atan2(dy, dx);
        
        // 计算椭圆边界上的点
        const boundaryX = this.ellipseCenterX + this.ellipseRadiusX * Math.cos(angle) * 0.95;
        const boundaryY = this.ellipseCenterY + this.ellipseRadiusY * Math.sin(angle) * 0.95;
        
        // 如果在椭圆内，返回原位置；否则返回边界点
        if (this.isInsideEllipse(x, y)) {
            return { x, y };
        }
        
        return { x: boundaryX, y: boundaryY };
    }

    reset() {
        this.player.setPosition(this.startX, this.startY);
        this.player.setVelocity(0, 0);
        this.player.setActive(true);
        this.player.setVisible(true);
    }

    disable() {
        this.player.setVelocity(0, 0);
        this.player.setActive(false);
    }

    getPosition() {
        return { x: this.player.x, y: this.player.y };
    }

    getPlayer() {
        return this.player;
    }
}