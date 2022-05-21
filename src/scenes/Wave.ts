export default class Wave {
    readonly delay: number
    readonly duration: number
    readonly quantity: number
    x: ({ min: number, max: number })
    y: { min: number, max: number }
    angle: { min: number, max: number }
    speed: { min: number, max: number }
    escapeAngle: { min: number, max: number }
    escapeSpeed: { min: number, max: number }

    constructor(delay: number, duration: number, quantity: number) {
        this.delay = delay
        this.duration = duration
        this.quantity = quantity
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