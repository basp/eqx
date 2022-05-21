interface EnemyConfig {
    angle: number,
    speed: number,
    escapeAngle: number,
    escapeSpeed: number,
    texture: string
}

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    static OUT_OF_BOUNDS = 'ENEMY_OUT_OF_BOUNDS'
    static DESTROYED = 'ENEMY_DESTROYED'

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

    kill(): void {
        this.emit(Enemy.DESTROYED, this)
        this.emit(Enemy.OUT_OF_BOUNDS, this)
    }

    protected escape(): boolean {
        return false
    }    

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
        if (this.isOutOfBounds(64)) {
            this.emit(Enemy.OUT_OF_BOUNDS, this)
        }
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
    }

    private isOutOfBounds(margin: number = 64): boolean {
        if (this.x < -margin) return true
        if (this.x > this.scene.scale.width + margin) return true
        if (this.y < -margin) return true
        if (this.y > this.scene.scale.height + margin) return true
        return false
    }
}