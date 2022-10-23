import {EventEmitter} from './EventEmitter.js'

export class Time extends EventEmitter {
    private start: number;
    private current: number;
    private elapsed: number;
    private delta: number;

    constructor() {
        super()
        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick() {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start
        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}