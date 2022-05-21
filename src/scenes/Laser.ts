import Projectile from './Projectile.js'

interface LaserConfig {
    rate: number,
    velocity: number,
    texture: string,
    bodySize: { width: number, height: number }
}

export default class Laser extends Phaser.Physics.Arcade.Group {
    public readonly rate: number
    public readonly velocity: number
    
    private readonly texture: string
    private static MAX_CHARGE = 1000
    private currentCharge = Laser.MAX_CHARGE

    constructor(
        world: Phaser.Physics.Arcade.World,
        scene: Phaser.Scene,
        config: LaserConfig) {
        super(world, scene, {
            classType: Projectile,
            maxSize: -1,
            active: false,
            visible: false,
            createCallback: (obj: Projectile) => {
                obj.setBodySize(config.bodySize.width, config.bodySize.height)
            }
        })
        this.texture = config.texture
        this.velocity = config.velocity
        this.rate = config.rate
    }

    charge(delta: number) {
        if (this.currentCharge < Laser.MAX_CHARGE) {
            this.currentCharge += delta * this.rate
            if (this.currentCharge > Laser.MAX_CHARGE) {
                this.currentCharge = Laser.MAX_CHARGE
            }
        }
    }

    fire(x: number, y: number): Projectile {
        if (this.currentCharge < Laser.MAX_CHARGE) {
            return
        }
        this.currentCharge -= Laser.MAX_CHARGE
        const spawnExisting = this.countActive(false) > 0
        const projectile: Projectile = this.get(x, y, this.texture)
        if (!projectile) {
            return
        } 
        if (spawnExisting) {
            this.setActive(true)
            this.setVisible(true)
            this.world.add(projectile.body)
        }
        projectile.fire(this.velocity)
        projectile.once(Projectile.OUT_OF_BOUNDS, (obj: Projectile) => {
            obj.setActive(false)
            obj.setVisible(false)
            this.world.remove(obj.body)
            obj.body.reset(-1000, -1000)
            this.scene.tweens.killTweensOf(obj)
        })
        return projectile
    }
}