class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
    }

    create() {
        // 添加背景图
        this.add.image(0, 0, 'bg_main').setOrigin(0, 0).setDisplaySize(1512, 982);

        // 添加标题图
        this.add.image(355, 153, 'img_title').setOrigin(0, 0).setDisplaySize(801, 446);

        // 添加装饰图1
        this.add.image(999, 376, 'img_decor_1').setOrigin(0, 0).setDisplaySize(244, 204);

        // 添加装饰图2
        this.add.image(466, 580, 'img_decor_2').setOrigin(0, 0).setDisplaySize(268, 268);
        
        // 添加开始按钮
        const startBtn = this.add.image(647, 660, 'btn_start')
            .setOrigin(0, 0)
            .setDisplaySize(218, 145)
            .setInteractive({ useHandCursor: true });

        // 记录原始显示大小
        const originalWidth = 218;
        const originalHeight = 145;

        // 按钮悬停效果
        startBtn.on('pointerover', () => {
            startBtn.setDisplaySize(originalWidth * 1.05, originalHeight * 1.05);
            startBtn.setTint(0xffffcc);
        });

        startBtn.on('pointerout', () => {
            startBtn.setDisplaySize(originalWidth, originalHeight);
            startBtn.clearTint();
        });

        // 按钮点击事件
        startBtn.on('pointerdown', () => {
            startBtn.setDisplaySize(originalWidth * 0.95, originalHeight * 0.95);
        });

        startBtn.on('pointerup', () => {
            startBtn.setDisplaySize(originalWidth, originalHeight);
            this.scene.start('MainScene');
        });

        // 播放背景音乐（全局单例）
        if (!this.game.bgmPlaying) {
            const bgm = this.sound.add('bgm_main', { 
                loop: true, 
                volume: 0.5 
            });
            
            // 播放音乐
            bgm.play();
            
            // 标记已播放，防止重复播放
            this.game.bgmPlaying = true;
            this.game.bgm = bgm;
            
            // 确保场景切换时音乐不停止
            this.events.once('shutdown', () => {
                // 场景关闭时不停止音乐
            });
        }
    }
}