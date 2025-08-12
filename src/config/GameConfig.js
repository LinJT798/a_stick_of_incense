const GameConfig = {
    type: Phaser.AUTO,
    width: 1512,
    height: 982,
    parent: 'game-container',
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false  // 关闭调试模式
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        // 设置最大缩放为85%
        max: {
            width: 1285,  // 1512 * 0.85
            height: 835   // 982 * 0.85
        }
    }
};