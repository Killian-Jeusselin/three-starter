import * as THREE from "three";
import {Sizes} from "./Utils/Sizes";
import {Time} from "./Utils/Time";
import {Camera} from "./Camera";
import {Renderer} from "./Renderer";
import {World} from "./World";

let instance: Experience | null = null

export class Experience {
    public canvas: HTMLCanvasElement;
    public sizes: Sizes;
    private time: Time;
    public scene: THREE.Scene;
    public camera: Camera;
    private renderer: Renderer;
    private world: World;

    constructor(canvas: string | undefined = undefined) {

        // Singleton
        if (instance) {
            // only one instance of the experience will be instantiated
            return instance
        }
        instance = this

        window.experience = this
        this.createCanvas(canvas);

        // Init of the different component
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.world = new World()
        this.renderer = new Renderer()

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })
    }

    /**
     * Handle the update of the canvas
     * @private
     */
    private update(): void {
        this.camera.update()
        this.renderer.update()
    }

    /**
     * Handle the resize of the canvas
     * @private
     */
    private resize(): void {
        this.camera.resize()
        this.renderer.resize()
    }

    /**
     * Make sure a canvas will exist
     * @param {string | undefined} canvas
     * @private
     */
    private createCanvas(canvas: string | undefined) {
        // Check if canvas element is a canvas or exist
        if (document.getElementById(canvas!) instanceof HTMLCanvasElement) {
            const el = document.getElementById(canvas!);
            this.canvas = el as HTMLCanvasElement;
        } else {
            // if element doesn't exist we return
            if (!canvas || !document.getElementById(canvas)) {
                console.log('Missing canvas with the id of canvas inside your dom')
                return;
            }
            // if element exist but isn't a canvas we create a canvas as child
            const canvasElement = document.createElement('canvas')
            canvasElement.id = "canvas";
            document.getElementById(canvas!)!.appendChild(canvasElement)
            this.canvas = canvasElement
        }
    }
}