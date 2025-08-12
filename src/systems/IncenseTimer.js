class IncenseTimer {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.incenseCount = 0;
        this.currentFrame = 0;
        this.isRunning = false;
        this.frameTimer = null;
        this.timer = null;
        
        this.createIncense();
        this.createCountText();
    }

    createIncense() {
        console.log('创建香炉精灵，位置:', this.x, this.y);
        
        this.incenseSprite = this.scene.add.sprite(this.x, this.y, 'incense_sprite', 0);
        this.incenseSprite.setOrigin(0, 0);
        this.incenseSprite.setDisplaySize(435, 435);
        
        // 调试信息
        console.log('香炉精灵创建后:', this.incenseSprite);
        console.log('精灵纹理:', this.incenseSprite.texture.key);
        console.log('精灵当前帧:', this.incenseSprite.frame.name);
        
        // 确保精灵正确显示第一帧
        this.incenseSprite.setFrame(0);
        
        // 设置精灵可见
        this.incenseSprite.setVisible(true);
        this.incenseSprite.setAlpha(1);
    }

    createCountText() {
        this.countText = this.scene.add.text(1276, 613, '', {
            fontFamily: 'GameFont, Arial',
            fontSize: '64px',
            color: '#000000'
        });
        this.countText.setOrigin(0, 0);
        this.updateCountText();
    }

    start() {
        console.log('启动香炉计时器');
        this.isRunning = true;
        this.incenseCount = 0;
        this.currentFrame = 0;
        this.updateCountText();
        
        // 直接使用手动动画，确保稳定运行
        this.startManualAnimation();
        
        // 创建定时器来更新香数（每10秒一炷香）
        this.timer = this.scene.time.addEvent({
            delay: 10000, // 10秒
            callback: () => {
                this.incenseCount++;
                this.updateCountText();
            },
            callbackScope: this,
            loop: true
        });
    }
    
    startManualAnimation() {
        console.log('使用手动动画作为备用方案');
        // 手动更新帧动画
        this.frameTimer = this.scene.time.addEvent({
            delay: 100, // 10fps
            callback: () => {
                if (this.isRunning) {
                    this.currentFrame = (this.currentFrame + 1) % 100;
                    this.incenseSprite.setFrame(this.currentFrame);
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    updateFrame() {
        // 不再需要手动更新帧，使用Phaser动画系统
    }

    updateCountText() {
        if (this.incenseCount === 0) {
            this.countText.setText('');
        } else {
            const chineseNum = ChineseNumbers.toChineseNumber(this.incenseCount);
            this.countText.setText(chineseNum);
        }
    }

    stop() {
        this.isRunning = false;
        if (this.timer) {
            this.timer.destroy();
        }
        if (this.frameTimer) {
            this.frameTimer.destroy();
        }
        // 停止动画播放
        if (this.incenseSprite) {
            this.incenseSprite.stop();
        }
    }

    getIncenseCount() {
        return this.incenseCount;
    }

    reset() {
        this.stop();
        this.incenseCount = 0;
        this.currentFrame = 0;
        if (this.incenseSprite) {
            this.incenseSprite.setFrame(0);
        }
        this.updateCountText();
    }
}