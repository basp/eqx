import Explosive from "./Explosive.js"

export default class Player extends Phaser.Physics.Arcade.Sprite {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys
    explosive: Explosive
    speed = 20

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.cursors = scene.input.keyboard.createCursorKeys()
        this.explosive = new Explosive(scene)
    }

    die(): void {
        this.setActive(false)
        this.setVisible(false)
        this.explosive.explode(this)
    }

    protected preUpdate(time: number, delta: number): void {
        this.setVelocity(0)
        if (this.cursors.left.isDown) {
            this.setVelocityX(-this.speed * 10)
        }
        else if (this.cursors.right.isDown) {
            this.setVelocityX(this.speed * 10)
        }
        if (this.cursors.up.isDown) {
            this.setVelocityY(-this.speed * 10)
        }
        else if (this.cursors.down.isDown) {
            this.setVelocityY(this.speed * 10)
        }
    }
}