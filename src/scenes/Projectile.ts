export default class Projectile extends Phaser.Physics.Arcade.Sprite {
    static OUT_OF_BOUNDS = 'PROJECTILE_OUT_OF_BOUNDS'

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)
    }    

    public fire(velocity: number): void {
        this.body.reset(this.x, this.y)
        this.setActive(true)
        this.setVisible(true)
        this.setVelocityY(-velocity)
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)        
        if (this.isOutOfBounds(32)) {
            this.emit(Projectile.OUT_OF_BOUNDS, this)
        }
    }

    private isOutOfBounds(margin: number = 32): boolean {
        if (this.x < -margin) return true
        if (this.x > this.scene.scale.width + margin) return true
        if (this.y < -margin) return true
        if (this.y > this.scene.scale.height + margin) return true
        return false
    }
}