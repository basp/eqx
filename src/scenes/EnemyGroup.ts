import Enemy from './Enemy.js'
import Explosive from './Explosive.js'

interface EnemyGroupConfig {
    texture: string,
    bodySize: { width: number, height: number }
}

export default class EnemyGroup extends Phaser.Physics.Arcade.Group {
    private readonly texture: string
    private readonly explosive: Explosive

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
        this.explosive = new Explosive(scene)
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
        enemy
            .removeListener(Enemy.OUT_OF_BOUNDS)
            .once(Enemy.OUT_OF_BOUNDS, (obj: Enemy) => {
                this.scene.tweens.killTweensOf(obj)
                this.world.remove(obj.body)
                obj.body.reset(-1000, -1000)
                obj.setActive(false)
                obj.setVisible(false)
            })
        enemy
            .removeListener(Enemy.DESTROYED)
            .once(Enemy.DESTROYED, (obj: Enemy) => {
                this.explosive.explode(obj)
            })
        return enemy
    }
}