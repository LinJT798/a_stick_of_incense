class Game extends Phaser.Game {
    constructor() {
        super(GameConfig);
        
        this.scene.add('PreloadScene', PreloadScene);
        this.scene.add('HomeScene', HomeScene);
        this.scene.add('IntroScene', IntroScene);
        this.scene.add('MainScene', MainScene);
        this.scene.add('GameOverScene', GameOverScene);
        
        this.scene.start('PreloadScene');
    }
}

window.onload = () => {
    window.game = new Game();
};