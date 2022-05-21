import Player from './Player.js'
import Enemy from './Enemy.js'
import Laser from './Laser.js'
import EnemyGroup from './EnemyGroup.js'
import Projectile from './Projectile.js'

export default class Example02 extends Phaser.Scene {
    space: Phaser.Input.Keyboard.Key
    crosshair: Phaser.GameObjects.Sprite
    player: Player
    weapon: Laser
    enemies: EnemyGroup
    status: Phaser.GameObjects.Text
    score = 0

    constructor() {
        super('example-02')
    }

    preload() {
        this.load.image('enemy', 'assets/ship_0015.png')
        this.load.image('player', 'assets/ship_0000.png')
        this.load.image('laser', 'assets/laser_0001.png')
        this.load.image('yellow', 'assets/yellow.png')
        this.load.image('red', 'assets/red.png')
        this.load.image('smoke', 'assets/smoke_01.png')
        this.load.image('crosshair', 'assets/crosshair042.png')
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
            rate: 20,
            velocity: 400,
        })
        const weapon2 = new Laser(this.physics.world, this, {
            texture: 'laser',
            bodySize: { width: 4, height: 16 },
            rate: 10,
            velocity: 800,
        })
        this.weapon = weapon2;
        this.player = new Player(this, 240, 600, 'player')
            .setCollideWorldBounds(true)
            .setAngle(-90)
        this.crosshair = this.add
            .sprite(this.player.x, this.player.y - 128, 'crosshair')
            .setAlpha(0.5)
            .setScale(0.5)
        this.enemies = new EnemyGroup(this.physics.world, this, {
            bodySize: { width: 32, height: 32 },
            texture: 'enemy',
        })
        this.time.delayedCall(1000, () => {
            for (let i = 0; i < 10; i++) {
                this.time.delayedCall(i * 500, () => {
                    const enemy = this.enemies
                        .spawn(0 + 32, -32)
                        .setAngle(90 - 20)
                        .setSpeed(20)
                    enemy.once(Enemy.DESTROYED, () => {
                        this.score += 1
                    });
                })
            }
        })
        this.time.delayedCall(4000, () => {
            for (let i = 0; i < 10; i++) {
                this.time.delayedCall(i * 500, () => {
                    const enemy = this.enemies
                        .spawn(480 - 32, -32)
                        .setAngle(90 + 20)
                        .setSpeed(20)
                    enemy.once(Enemy.DESTROYED, () => {
                        this.score += 1
                    });
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
                    const enemy = this.enemies
                        .spawn(x, -32)
                        .setRotation(angle)
                        .setSpeed(20)
                    enemy.once(Enemy.DESTROYED, () => {
                        this.score += 1
                    });
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
                    const enemy = this.enemies
                        .spawn(x, -32)
                        .setRotation(angle)
                        .setSpeed(20)
                    enemy.once(Enemy.DESTROYED, () => {
                        this.score += 1
                    });
                })
            }
        })
        this.time.delayedCall(30000, () => {
            for (let i = 0; i < 8; i++) {
                const x = 48 + i * 56
                console.log(x)
                const enemy = this.enemies
                    .spawn(x, -32)
                    .setAngle(90)
                    .setSpeed(12)
                enemy.once(Enemy.DESTROYED, () => {
                    this.score += 1
                });
            }
        })
        this.time.delayedCall(35000, () => {
            const interval = 15000 / 60
            for (let i = 0; i < 60; i++) {
                this.time.delayedCall(i * interval, () => {
                    const x = Phaser.Math.Between(0 + 32, 480 - 32)
                    const dx = this.player.x - x
                    const dy = this.player.y + 32
                    const angle = new Phaser.Math.Vector2(dx, dy).angle()
                    const enemy = this.enemies
                        .spawn(x, -32)
                        .setRotation(angle)
                        .setSpeed(20)
                    enemy.once(Enemy.DESTROYED, () => {
                        this.score += 1
                    });
                })
            }
        })
        this.status = this.add.text(16, 16, "TILT")
        this.physics.add.collider(this.weapon, this.enemies, (projectile: Projectile, enemy: Enemy) => {
            if (!projectile.active) {
                return
            }
            if (!enemy.active) {
                return
            }
            projectile.despawn()
            enemy.kill()
        })
        this.physics.add.collider(this.player, this.enemies, (player: Player, enemy: Enemy) => {
            if (!player.active) {
                return
            }
            if (!enemy.active) {
                return
            }
            player.die()
            this.time.delayedCall(200, () => {
                enemy.kill()
            })
        })
    }

    update(time: number, delta: number): void {
        this.updateWeapon(delta)
        this.updateCrosshair()
        const bullets = this.weapon.countActive(true)
        const enemies = this.enemies.countActive(true)
        const lines = [
            `Active bullets: ${bullets}`,
            `Active enemies: ${enemies}`,
            `Killed enemies: ${this.score}`,
        ]
        this.status.text = lines.join('\n')
    }

    private updateCrosshair(): void {
        this.crosshair.visible = this.player.active
        const x = this.player.x
        const y = this.player.y - 128
        this.crosshair.setPosition(x, y)
    }

    private updateWeapon(delta: number): void {
        if (this.space.isDown && this.player.active) {
            this.weapon.fire(this.player.x, this.player.y - 32)
        }
        this.weapon.charge(delta)
    }
}