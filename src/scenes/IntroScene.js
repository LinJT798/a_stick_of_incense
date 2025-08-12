class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    create() {
        // 添加背景图
        this.add.image(0, 0, 'bg_intro').setOrigin(0, 0).setDisplaySize(1512, 982);

        // 创建继续按钮组，设置中心点用于缩放
        // 计算按钮组的中心位置
        const groupCenterX = 1240 + 90; // 1240是最左侧，180是宽度的一半
        const groupCenterY = 80 + 50;   // 80是最顶部，100是高度的一半
        const buttonGroup = this.add.container(groupCenterX, groupCenterY);
        
        // 添加按钮背景矩形（相对于容器中心的位置）
        const buttonBg = this.add.rectangle(1241 - groupCenterX, 83 - groupCenterY, 158, 52, 0xF3ECDF)
            .setOrigin(0, 0);
        
        // 添加继续文字（居中在按钮背景内）
        // 按钮背景中心位置：1241 + 79 = 1320, 83 + 26 = 109
        const continueText = this.add.text(1320 - groupCenterX, 109 - groupCenterY, '继续', {
            fontFamily: 'GameFont, Arial',
            fontSize: '48px',
            color: '#000000'
        }).setOrigin(0.5, 0.5);  // 使用中心对齐
        
        // 添加装饰图（相对于容器中心的位置）- 最后添加，层级最高
        const decor = this.add.image(1183 - groupCenterX, 61 - groupCenterY, 'img_intro_decor')
            .setOrigin(0, 0)
            .setDisplaySize(115, 96);
        
        // 将所有元素添加到容器组（顺序决定层级）
        buttonGroup.add([buttonBg, continueText, decor]);
        
        // 记录原始位置和大小
        const originalScale = 1;
        
        // 创建交互区域（覆盖整个按钮组）
        const hitArea = this.add.rectangle(1240, 80, 180, 100, 0x000000, 0)
            .setOrigin(0, 0)
            .setInteractive({ useHandCursor: true });
        
        // 按钮悬停效果
        hitArea.on('pointerover', () => {
            buttonGroup.setScale(1.02);
            continueText.setTint(0xffffcc);
        });
        
        hitArea.on('pointerout', () => {
            buttonGroup.setScale(originalScale);
            continueText.clearTint();
        });
        
        // 按钮点击事件
        hitArea.on('pointerdown', () => {
            buttonGroup.setScale(0.98);
        });
        
        hitArea.on('pointerup', () => {
            buttonGroup.setScale(originalScale);
            // 进入主游戏场景
            this.scene.start('MainScene');
        });
    }
}