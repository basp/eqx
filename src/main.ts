import Game from './scenes/Example02.js'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: [Game]
}

export default new Phaser.Game(config)