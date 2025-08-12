class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.gameState = 'countdown'; // countdown, playing, gameOver
        this.countdownValue = 3;
        this.leaves = [];
    }

    create() {
        // 添加背景
        this.add.image(0, 0, 'bg_main').setOrigin(0, 0).setDisplaySize(1512, 982);
        
        // 添加场地
        this.add.image(78, 12.04, 'img_field').setOrigin(0, 0).setDisplaySize(1031, 909.96);
        
        // 创建调试图形（放在所有游戏对象之后，确保在最上层）
        this.debugGraphics = null;
        
        // 创建玩家控制器
        this.playerController = new PlayerController(this, 551, 418);
        
        // 创建香炉计时器
        this.incenseTimer = new IncenseTimer(this, 1097, 197);
        
        // 创建箭矢系统
        this.arrowSystem = new ArrowSystem(this, this.playerController);
        
        // 创建倒计时文本
        this.countdownText = this.add.text(756, 491, '三', {
            fontFamily: 'GameFont, Arial',
            fontSize: '120px',
            color: '#000000',
            stroke: '#ffffff',
            strokeThickness: 3
        });
        this.countdownText.setOrigin(0.5, 0.5);
        this.countdownText.setAlpha(0);
        
        // 创建叶子飘落效果
        this.createLeaves();
        
        // 创建调试图形层（在最上层）
        if (this.game.config.physics.arcade.debug) {
            this.debugGraphics = this.add.graphics();
            this.debugGraphics.setDepth(1000); // 确保在最上层
        }
        
        // 开始倒计时
        this.startCountdown();
    }

    startCountdown() {
        this.gameState = 'countdown';
        this.countdownValue = 3;
        this.playerController.disable();
        
        // 显示倒计时
        this.showCountdown();
    }

    showCountdown() {
        if (this.countdownValue > 0) {
            // 转换数字为中文
            const chineseNumbers = ['', '一', '二', '三'];
            this.countdownText.setText(chineseNumbers[this.countdownValue]);
            this.countdownText.setAlpha(1);
            this.countdownText.setScale(1.5);
            
            // 动画效果
            this.tweens.add({
                targets: this.countdownText,
                scale: 1,
                alpha: 0,
                duration: 900,
                ease: 'Power2'
            });
            
            // 递减并继续
            this.time.delayedCall(1000, () => {
                this.countdownValue--;
                if (this.countdownValue > 0) {
                    this.showCountdown();
                } else {
                    this.startGame();
                }
            });
        }
    }

    startGame() {
        this.gameState = 'playing';
        this.countdownText.setVisible(false);
        
        // 启动各系统
        this.playerController.reset();
        this.incenseTimer.start();
        this.arrowSystem.start();
    }

    createLeaves() {
        // 创建10片飘落的叶子
        for (let i = 0; i < 10; i++) {
            const leaf = this.add.image(
                Math.random() * 1512,
                -50 - Math.random() * 500,
                'leaf'
            );
            leaf.setDisplaySize(38, 32);
            leaf.setAlpha(0.7);
            
            // 叶子属性
            leaf.fallSpeed = 30 + Math.random() * 20;
            leaf.swayAmount = 30 + Math.random() * 20;
            leaf.swaySpeed = 1 + Math.random() * 0.5;
            leaf.initialX = leaf.x;
            leaf.time = Math.random() * Math.PI * 2;
            
            this.leaves.push(leaf);
        }
    }

    updateLeaves(delta) {
        for (let leaf of this.leaves) {
            // 垂直下落
            leaf.y += leaf.fallSpeed * (delta / 1000);
            
            // 水平摇摆
            leaf.time += leaf.swaySpeed * (delta / 1000);
            leaf.x = leaf.initialX + Math.sin(leaf.time) * leaf.swayAmount;
            
            // 轻微旋转
            leaf.rotation = Math.sin(leaf.time) * 0.2;
            
            // 重置位置
            if (leaf.y > 1032) {
                leaf.y = -50 - Math.random() * 200;
                leaf.initialX = Math.random() * 1512;
                leaf.x = leaf.initialX;
            }
        }
    }

    update(time, delta) {
        if (this.gameState === 'playing') {
            // 更新玩家控制
            this.playerController.update();
            
            // 更新箭矢系统
            this.arrowSystem.update(delta);
            
            // 调试：绘制碰撞范围
            if (this.game.config.physics.arcade.debug) {
                this.drawDebugInfo();
            }
            
            // 检查碰撞
            if (this.arrowSystem.checkCollision(this.playerController.getPlayer())) {
                this.gameOver();
            }
        }
        
        // 更新叶子飘落
        this.updateLeaves(delta);
    }
    
    drawDebugInfo() {
        if (!this.debugGraphics) return;
        
        // 清除之前的调试图形
        this.debugGraphics.clear();
        
        // 绘制椭圆边界
        this.debugGraphics.lineStyle(2, 0xff0000, 0.5);
        this.debugGraphics.strokeEllipse(596.74, 471.345, 698.14, 620.33);
        
        // 绘制玩家碰撞圆
        const player = this.playerController.getPlayer();
        this.debugGraphics.lineStyle(2, 0x00ff00, 0.8);
        this.debugGraphics.strokeCircle(player.x, player.y, 35);
        
        // 绘制箭矢碰撞线
        const arrows = this.arrowSystem.getActiveArrows();
        this.debugGraphics.lineStyle(2, 0xff00ff, 0.8);
        
        for (let arrow of arrows) {
            if (!arrow.active) continue;
            
            const arrowLength = 70;
            const arrowAngle = arrow.rotation;
            
            const x1 = arrow.x - Math.cos(arrowAngle) * arrowLength / 2;
            const y1 = arrow.y - Math.sin(arrowAngle) * arrowLength / 2;
            const x2 = arrow.x + Math.cos(arrowAngle) * arrowLength / 2;
            const y2 = arrow.y + Math.sin(arrowAngle) * arrowLength / 2;
            
            this.debugGraphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));
        }
    }

    gameOver() {
        if (this.gameState !== 'playing') return;
        
        this.gameState = 'gameOver';
        
        // 停止各系统
        this.playerController.disable();
        this.incenseTimer.stop();
        this.arrowSystem.reset();
        
        // 获取最终香数
        const incenseCount = this.incenseTimer.getIncenseCount();
        
        // 延迟后跳转到结算场景
        this.time.delayedCall(500, () => {
            this.scene.start('GameOverScene', { incenseCount: incenseCount });
        });
    }
}