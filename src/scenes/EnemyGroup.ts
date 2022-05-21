import Enemy from './Enemy.js'

interface EnemyGroupConfig {
    texture: string,
    bodySize: { width: number, height: number }
}

export default class EnemyGroup extends Phaser.Physics.Arcade.Group {
    private readonly texture: string
    private readonly fire: Phaser.GameObjects.Particles.ParticleEmitterManager
    private readonly smoke: Phaser.GameObjects.Particles.ParticleEmitterManager
    private readonly temp: Phaser.GameObjects.Particles.ParticleEmitterManager
    private readonly booms = ['boom0', 'boom1', 'boom2', 'boom3', 'boom4']

    constructor(
        world: Phaser.Physics.Arcade.World,
        scene: Phaser.Scene,
        config: EnemyGroupConfig) {
        super(world, scene, {
            classType: Enemy,
            maxSize: -1,
            active: false,
            visible: false,
            createCallback: (obj: Enemy) => {
                obj.setBodySize(config.bodySize.width, config.bodySize.height)
            }
        })
        this.texture = config.texture
        this.fire = this.scene.add.particles('yellow')
        this.smoke = this.scene.add.particles('smoke')
        this.temp = this.scene.add.particles('red')
    }

    spawn(x: number, y: number): Enemy {
        const spawnExisting = this.countActive(false) > 0
        const enemy: Enemy = this.get(x, y, this.texture)
        if (!enemy) {
            return
        }
        if (spawnExisting) {
            enemy.setActive(true)
            enemy.setVisible(true)
            this.world.add(enemy.body)
        }
        enemy.once(Enemy.OUT_OF_BOUNDS, (obj: Enemy) => {
            this.scene.tweens.killTweensOf(obj)
            this.world.remove(obj.body)
            obj.body.reset(-1000, -1000)
            obj.setActive(false)
            obj.setVisible(false)
        })
        enemy.once(Enemy.DESTROYED, (obj: Enemy) => {
            this.explode(obj)
        })
        return enemy
    }

    private explode(obj: Enemy) {
        const boom = this.booms[Phaser.Math.Between(0, 4)]
        this.scene.sound.play(boom, {
            volume: 0.5,
        })
        this.explodeFire(obj)
        this.explodeSmoke(obj)

        const count = Phaser.Math.Between(10, 50)
        const lifespan = Phaser.Math.Between(300, 400)
        const emitter = this.temp.createEmitter({
            speed: { min: -400, max: 400 },
            scale: { start: 0.2, end: 0 },
            quantity: 1,
            blendMode: Phaser.BlendModes.ADD,
            lifespan: lifespan,
        })
        emitter.explode(count, obj.x, obj.y)
        this.scene.time.delayedCall(lifespan, () => {
            this.fire.removeEmitter(emitter)
        })
    }

    private explodeFire(obj: Enemy) {
        const count = Phaser.Math.Between(10, 50)
        const lifespan = Phaser.Math.Between(500, 800)
        const emitter = this.fire.createEmitter({
            speed: { min: -200, max: 200 },
            scale: { start: 0.3, end: 0 },
            blendMode: Phaser.BlendModes.ADD,
            lifespan: lifespan,
        })
        emitter.explode(count, obj.x, obj.y)
        this.scene.time.delayedCall(lifespan, () => {
            this.fire.removeEmitter(emitter)
        })
    }

    private explodeSmoke(obj: Enemy) {
        const count = Phaser.Math.Between(3, 5)
        const speed = Phaser.Math.Between(10, 50)
        const lifespan = Phaser.Math.Between(800, 1000)
        const emitter = this.smoke.createEmitter({
            speed: { min: -speed, max: speed },
            scale: { start: 0.1, end: 0.5 },
            blendMode: Phaser.BlendModes.SCREEN,
            rotate: { min: 0, max: 360 },
            lifespan: lifespan,
        })
        emitter.setAlpha((p, k, t: number) => 0.8 - 2 * Math.abs(t - 0.4))
        emitter.explode(count, obj.x, obj.y)
        this.scene.time.delayedCall(lifespan, () => {
            this.smoke.removeEmitter(emitter)
        }) 
    }
}