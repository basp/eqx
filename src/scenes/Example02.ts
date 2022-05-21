import Player from './Player.js'
import Laser from './Laser.js'
import Enemy from './Enemy.js'
import EnemyGroup from './EnemyGroup.js'

export default class Example02 extends Phaser.Scene {
    space: Phaser.Input.Keyboard.Key

    player: Player
    weapon: Laser
    enemies: EnemyGroup
    status: Phaser.GameObjects.Text

    constructor() {
        super('example-02')
    }

    preload() {
        this.load.image('enemy', 'assets/ship_0015.png')
        this.load.image('player', 'assets/ship_0000.png')
        this.load.image('laser', 'assets/laser_0001.png')
    }

    create() {
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE) 
        const weapon1 = new Laser(this.physics.world, this, {
            texture: 'laser',
            bodySize: { width: 4, height: 16 },
            rate: 10,
            velocity: 400,
        })
        const weapon2 = new Laser(this.physics.world, this, {
            texture: 'laser',
            bodySize: { width: 4, height: 16 },
            rate: 5,
            velocity: 800,
        })
        this.weapon = weapon1;
        this.player = new Player(this, 240, 600, 'player')
            .setCollideWorldBounds(true)
            .setAngle(-90)

        this.enemies = new EnemyGroup(this.physics.world, this, {
            bodySize: { width: 32, height: 32 },
            texture: 'enemy',
        })

        this.enemies
            .spawn(32, -32)
            .setAngle(90)
            .setSpeed(50)

        this.status = this.add.text(16, 16, "TILT")
    }
    
    update(time: number, delta: number): void {
        if (this.space.isDown) {
            this.weapon.fire(this.player.x, this.player.y - 32)
        }
        this.weapon.charge(delta)
        const bullets = this.weapon.countActive(true)
        const enemies = this.enemies.countActive(true)
        const lines = [
            `Active bullets: ${bullets}`,
            `Active enemies: ${enemies}`
        ]
        this.status.text = lines.join('\n')
    }
}