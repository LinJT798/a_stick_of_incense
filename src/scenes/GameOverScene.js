class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.incenseCount = data.incenseCount || 0;
    }

    create() {
        // 添加背景图
        this.add.image(0, 0, 'bg_main').setOrigin(0, 0).setDisplaySize(1512, 982);

        // 添加装饰图1（更大尺寸）
        this.add.image(121, 213, 'img_decor_1').setOrigin(0, 0).setDisplaySize(475, 397);

        // 添加装饰图2（更大尺寸）
        this.add.image(620, 149, 'img_decor_2').setOrigin(0, 0).setDisplaySize(401, 401);

        // 添加装饰图3
        this.add.image(723, 610, 'img_decor_3').setOrigin(0, 0).setDisplaySize(268, 268);

        // 显示结果文本
        const resultText = this.getResultText();
        this.add.text(988, 412, resultText, {
            fontFamily: 'GameFont, Arial',
            fontSize: '64px',
            color: '#000000'
        }).setOrigin(0, 0);

        // 添加重新开始按钮
        const restartBtn = this.add.image(904, 690, 'btn_restart')
            .setOrigin(0, 0)
            .setDisplaySize(218, 145)
            .setInteractive({ useHandCursor: true });

        // 记录原始显示大小
        const originalWidth = 218;
        const originalHeight = 145;

        // 按钮悬停效果
        restartBtn.on('pointerover', () => {
            restartBtn.setDisplaySize(originalWidth * 1.05, originalHeight * 1.05);
            restartBtn.setTint(0xffffcc);
        });

        restartBtn.on('pointerout', () => {
            restartBtn.setDisplaySize(originalWidth, originalHeight);
            restartBtn.clearTint();
        });

        // 按钮点击事件
        restartBtn.on('pointerdown', () => {
            restartBtn.setDisplaySize(originalWidth * 0.95, originalHeight * 0.95);
        });

        restartBtn.on('pointerup', () => {
            restartBtn.setDisplaySize(originalWidth, originalHeight);
            // 直接返回主游戏场景，从倒计时开始
            this.scene.start('MainScene');
        });

        // 添加一些动画效果
        this.createAnimations();
    }

    getResultText() {
        if (this.incenseCount === 0) {
            return '未满一炷香';
        } else if (this.incenseCount === 1) {
            return '一炷香';
        } else {
            const chineseNum = ChineseNumbers.toChineseNumber(this.incenseCount);
            return chineseNum + '炷香';
        }
    }

    createAnimations() {
        // 简单的淡入效果，避免复杂的索引问题
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
}