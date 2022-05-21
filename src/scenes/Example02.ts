import Player from './Player.js'
import Enemy from './Enemy.js'
import Laser from './Laser.js'
import EnemyGroup from './EnemyGroup.js'
import Projectile from './Projectile.js'

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
        this.load.image('yellow', 'assets/yellow.png')
        this.load.image('smoke', 'assets/smoke_01.png')
        this.load.audio('boom0', 'assets/explosionCrunch_000.ogg')
        this.load.audio('boom1', 'assets/explosionCrunch_001.ogg')
        this.load.audio('boom2', 'assets/explosionCrunch_002.ogg')
        this.load.audio('boom3', 'assets/explosionCrunch_003.ogg')
        this.load.audio('boom4', 'assets/explosionCrunch_004.ogg')
        this.load.audio('laser', 'assets/laserSmall_004.ogg')

    }

    create() {
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE) 
        const weapon1 = new Laser(this.physics.world, this, {
            texture: 'laser',
            bodySize: { width: 4, height: 16 },
            rate: 5,
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
        this.time.delayedCall(1000, () => {
            for (let i = 0; i < 10; i++) {
                this.time.delayedCall(i * 500, () => {
                    this.enemies
                        .spawn(0 + 32, -32)
                        .setAngle(90 - 20)
                        .setSpeed(20)
                })
            }          
        })
        this.time.delayedCall(4000, () => {
            for (let i = 0; i < 10; i++) {
                this.time.delayedCall(i * 500, () => {
                    this.enemies
                        .spawn(480 - 32, -32)
                        .setAngle(90 + 20)
                        .setSpeed(20)
                })
            }          
        })
        this.time.delayedCall(8000, () => {
            const interval = 8000 / 20
            for (let i = 0; i < 20; i++) {
                this.time.delayedCall(i * interval, () => {
                    const x = Phaser.Math.Between(0 + 32, 480 - 32)
                    const dx = this.player.x - x
                    const dy = this.player.y + 32
                    const angle = new Phaser.Math.Vector2(dx, dy).angle()
                    this.enemies
                        .spawn(x, -32)
                        .setRotation(angle)
                        .setSpeed(20)
                })
            }
        })
        this.time.delayedCall(18000, () => {
            const interval = 10000 / 30
            for (let i = 0; i < 30; i++) {
                this.time.delayedCall(i * interval, () => {
                    const x = Phaser.Math.Between(0 + 32, 480 - 32)
                    const dx = this.player.x - x
                    const dy = this.player.y + 32
                    const angle = new Phaser.Math.Vector2(dx, dy).angle()
                    this.enemies
                        .spawn(x, -32)
                        .setRotation(angle)
                        .setSpeed(20)
                })
            }
        })
        this.status = this.add.text(16, 16, "TILT")
        this.physics.add.collider(this.weapon, this.enemies, (projectile: Projectile, enemy: Enemy) => {
            if(!projectile.active) {
                return
            }
            if(!enemy.active) {
                return
            }
            projectile.kill()
            enemy.kill()
        });
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