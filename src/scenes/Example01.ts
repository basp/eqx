class Enemy extends Phaser.Physics.Arcade.Sprite {
    static OUT_OF_BOUNDS = 'out-of-bounds'

    public speed = 10
    public escapeAngle = 0
    public escapeSpeed = 30

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string) {
        super(scene, x, y, texture)
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)

        const u = new Phaser.Math
            .Vector2()
            .setToPolar(this.rotation, 0.1)

        this.x += u.x * this.speed * delta * 0.1
        this.y += u.y * this.speed * delta * 0.1

        if (this.escape()) {
            this.scene.tweens.add({
                targets: [this],
                speed: this.escapeSpeed,
                angle: this.escapeAngle,
                duration: 1000,
            })
        }

        const padding = 32
        if (this.x < -padding) {
            this.emit(Enemy.OUT_OF_BOUNDS, this)
        }
        else if (this.x > this.scene.scale.width + padding) {
            this.emit(Enemy.OUT_OF_BOUNDS, this)
        }
        else if (this.y > this.scene.scale.height + padding) {
            this.emit(Enemy.OUT_OF_BOUNDS, this)
        }
    }

    setAngle(degrees?: number): this {
        super.setAngle(degrees)
        return this
    }

    setEscapeAngle(value: number): this {
        this.escapeAngle = value
        return this
    }

    setEscapeSpeed(value: number): this {
        this.escapeSpeed = value
        return this
    }

    setSpeed(value: number): this {
        this.speed = value
        return this
    }

    protected escape(): boolean {
        return false
    }
}

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player')
    }

    addToScene(): this {
        this.scene.add.existing(this)
        return this
    }

    addToWorld(): this {
        this.scene.physics.add.existing(this)
        return this
    }
}

class EnemyGroup extends Phaser.Physics.Arcade.Group {
    private readonly texture: string

    constructor(
        world: Phaser.Physics.Arcade.World,
        scene: Phaser.Scene,
        texture: string,
        config?: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupConfig) {
        const defaults: Phaser.Types.Physics.Arcade.PhysicsGroupConfig = {
            classType: Enemy,
            maxSize: -1,
        }
        super(world, scene, Object.assign(defaults, config))
        this.texture = texture
    }

    spawn(x: number, y: number) {
        const spawnExisting = this.countActive(false) > 0
        const enemy: Enemy = this.get(x, y, this.texture)
        if (!enemy) {
            return enemy
        }
        if (spawnExisting) {
            enemy.setVisible(true)
            enemy.setActive(true)
            this.world.add(enemy.body)
        }
        enemy.once(Enemy.OUT_OF_BOUNDS, x => {
            this.despawn(x)
        })
        return enemy
    }

    despawn(enemy: Enemy) {
        this.scene.tweens.killTweensOf(enemy)
        this.killAndHide(enemy)
        this.world.remove(enemy.body)
        enemy.body.reset(0, 0)
    }
}

interface IWave {
    time: number
    delay: number
    count: number
    x: { min: number, max: number }
    y: { min: number, max: number }
    angle: { min: number, max: number }
    speed: { min: number, max: number }
    escapeAngle: { min: number, max: number }
    escapeSpeed: { min: number, max: number }
}

class Wave implements IWave {
    readonly time: number
    readonly delay: number
    readonly count: number
    x: { min: number, max: number }
    y: { min: number, max: number }
    angle: { min: number, max: number }
    speed: { min: number, max: number }
    escapeAngle: { min: number, max: number }
    escapeSpeed: { min: number, max: number }

    constructor(time: number, delay: number, count: number) {
        this.time = time
        this.delay = delay
        this.count = count
        this.x = { min: 0, max: 0 }
        this.y = { min: 0, max: 0 }
        this.angle = { min: 0, max: 0 }
        this.speed = { min: 0, max: 0 }
        this.escapeAngle = { min: 0, max: 0 }
        this.escapeSpeed = { min: 0, max: 0 }
    }

    setX(value: number): this {
        this.x.min = value
        this.x.max = value
        return this
    }

    setY(value: number): this {
        this.y.min = value
        this.y.max = value
        return this
    }

    setAngle(value: number): this {
        this.angle.min = value
        this.angle.max = value
        return this
    }

    setSpeed(value: number): this {
        this.speed.min = value
        this.speed.max = value
        return this
    }

    setEscapeAngle(value: number): this {
        this.escapeAngle.min = value
        this.escapeAngle.max = value
        return this
    }

    setEscapeSpeed(value: number): this {
        this.escapeSpeed.min = value
        this.escapeSpeed.max = value
        return this
    }
}

const waves: IWave[] = [
    new Wave(1000, 500, 5)
        .setX(32)
        .setY(-32)
        .setAngle(90 - 30)
        .setSpeed(10)
        .setEscapeAngle(0)
        .setEscapeSpeed(20),
    new Wave(6000, 500, 5)
        .setX(480 - 32)
        .setY(-32)
        .setAngle(90 + 30)
        .setSpeed(10)
        .setEscapeAngle(180)
        .setEscapeSpeed(20),
    {
        time: 15000,
        delay: 1000,
        count: 20,
        x: { min: 32, max: 480 - 32 },
        y: { min: -32, max: -32 },
        angle: { min: 90, max: 90 },
        speed: { min: 20, max: 20 },
        escapeAngle: { min: 0, max: 180 },
        escapeSpeed: { min: 30, max: 30 },
    },
    new Wave(38000, 500, 5)
        .setX(32)
        .setY(-32)
        .setAngle(90 - 20)
        .setSpeed(15)
        .setEscapeAngle(0)
        .setEscapeSpeed(20),
    new Wave(42000, 500, 5)
        .setX(480 - 32)
        .setY(-32)
        .setAngle(90 + 20)
        .setSpeed(15)
        .setEscapeAngle(180)
        .setEscapeSpeed(20),
]

export default class Example01 extends Phaser.Scene {
    player: Player
    enemies: EnemyGroup

    constructor() {
        super('example-01')
    }

    preload() {
        this.load.image('enemy', 'assets/ship_0015.png')
        this.load.image('player', 'assets/ship_0000.png')
        this.load.image('laser', 'assets/laser_0001.png')
    }

    create() {
        this.player = new Player(this, 240, 600)
            .addToScene()
            .addToWorld()
            .setAngle(-90)
        this.enemies = new EnemyGroup(this.physics.world, this, 'enemy')
        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i]
            this.time.delayedCall(wave.time, () => {
                for(let i = 0; i < wave.count; i++) {
                    this.time.delayedCall(i * wave.delay, () => {
                        const x = Phaser.Math.Between(wave.x.min, wave.x.max)
                        const y = Phaser.Math.Between(wave.y.min, wave.y.max)
                        this.enemies
                            .spawn(x, y)
                            .setAngle(Phaser.Math.Between(wave.angle.min, wave.angle.max))
                            .setSpeed(Phaser.Math.Between(wave.speed.min, wave.speed.max))
                            .setEscapeAngle(Phaser.Math.Between(wave.escapeAngle.min, wave.escapeAngle.max))
                            .setEscapeSpeed(Phaser.Math.Between(wave.escapeSpeed.min, wave.escapeSpeed.max))
                    })
                }
            })
        }
    }
}