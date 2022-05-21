export default class Explosive extends Phaser.GameObjects.GameObject {
    private readonly fire: Phaser.GameObjects.Particles.ParticleEmitterManager
    private readonly smoke: Phaser.GameObjects.Particles.ParticleEmitterManager
    private readonly sparks: Phaser.GameObjects.Particles.ParticleEmitterManager
    private readonly booms = ['boom0', 'boom1', 'boom2', 'boom3', 'boom4']

    constructor(scene: Phaser.Scene) {
        super(scene, 'explosive')
        this.fire = this.scene.add.particles('yellow')
        this.smoke = this.scene.add.particles('smoke')
        this.sparks = this.scene.add.particles('red')
    }

    explode(obj: Phaser.Physics.Arcade.Sprite) {
        const boom = this.booms[Phaser.Math.Between(0, 4)]
        this.scene.sound.play(boom, {
            volume: 0.5,
        })
        this.explodeSparks(obj)
        this.explodeFire(obj)
        this.explodeSmoke(obj)
    }

    private explodeSparks(obj: Phaser.Physics.Arcade.Sprite) {
        const count = Phaser.Math.Between(5, 10)
        const lifespan = Phaser.Math.Between(300, 400)
        const emitter = this.sparks.createEmitter({
            speed: { min: -400, max: 400 },
            scale: { start: 0.2, end: 0 },
            blendMode: Phaser.BlendModes.ADD,
            lifespan: lifespan,
        })
        emitter.explode(count, obj.x, obj.y)
        this.scene.time.delayedCall(lifespan, () => {
            this.fire.removeEmitter(emitter)
        })
    }

    private explodeFire(obj: Phaser.Physics.Arcade.Sprite) {
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

    private explodeSmoke(obj: Phaser.Physics.Arcade.Sprite) {
        const count = Phaser.Math.Between(3, 5)
        const speed = Phaser.Math.Between(10, 50)
        const lifespan = Phaser.Math.Between(1000, 2000)
        const emitter = this.smoke.createEmitter({
            speed: { min: -speed, max: speed },
            scale: { start: 0.1, end: 0.7 },
            blendMode: Phaser.BlendModes.SCREEN,
            rotate: { min: 0, max: 280 },
            gravityX: 200,
            gravityY: -100,
            lifespan: lifespan,
        })
        emitter.setAlpha((p, k, t: number) => 0.8 - 2 * Math.abs(t - 0.4))
        emitter.explode(count, obj.x, obj.y)
        this.scene.time.delayedCall(lifespan, () => {
            this.smoke.removeEmitter(emitter)
        }) 
    }
}