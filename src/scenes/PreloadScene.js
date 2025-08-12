class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(456, 450, 600, 50);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: '加载中...',
            style: {
                font: '30px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 25,
            text: '0%',
            style: {
                font: '24px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(466, 460, 580 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        // 加载图片资源
        this.load.image('bg_main', 'assets/images/backgrounds/bg_main.png');
        this.load.image('bg_intro', 'assets/images/backgrounds/bg_intro.png');
        this.load.image('img_title', 'assets/images/ui/img_title.png');
        this.load.image('btn_start', 'assets/images/ui/btn_start.png');
        this.load.image('btn_restart', 'assets/images/ui/btn_restart.png');
        this.load.image('img_intro_decor', 'assets/images/ui/img_intro_decor.png');
        this.load.image('img_decor_1', 'assets/images/decorations/img_decor_1.png');
        this.load.image('img_decor_2', 'assets/images/decorations/img_decor_2.png');
        this.load.image('img_decor_3', 'assets/images/decorations/img_decor_3.png');
        this.load.image('img_field', 'assets/images/gameplay/img_field.png');
        this.load.image('player', 'assets/images/gameplay/player.png');
        this.load.image('arrow', 'assets/images/gameplay/arrow.png');
        this.load.image('leaf', 'assets/images/decorations/leaf.png');

        // 加载精灵表 - 新尺寸：8704×3072，6行×17列
        this.load.spritesheet('incense_sprite', 'assets/images/sprites/incense_spritesheet.png', {
            frameWidth: 512,
            frameHeight: 512,
            startFrame: 0,
            endFrame: 99,  // 只使用前100帧（0-99）
            margin: 0,
            spacing: 0
        });

        // 加载背景音乐
        this.load.audio('bgm_main', ['assets/audio/bgm/main_bgm.mp3']);
    }

    create() {
        // 调试：检查精灵表是否加载成功
        const texture = this.textures.get('incense_sprite');
        console.log('香炉精灵表加载状态:', texture);
        console.log('精灵表帧数:', texture.frameTotal);
        
        // 创建香炉动画
        try {
            this.anims.create({
                key: 'incense_burn',
                frames: this.anims.generateFrameNumbers('incense_sprite', { start: 0, end: 99 }),
                frameRate: 10,
                repeat: -1
            });
            console.log('香炉动画创建成功');
            
            // 验证动画
            const anim = this.anims.get('incense_burn');
            console.log('动画信息:', anim);
        } catch (error) {
            console.error('创建香炉动画失败:', error);
        }

        // 跳转到首页场景
        this.scene.start('HomeScene');
    }
}