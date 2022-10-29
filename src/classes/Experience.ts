import * as THREE from "three";
import {Sizes} from "./Utils/Sizes";
import {Time} from "./Utils/Time";
import {Camera} from "./Camera";
import {Renderer} from "./Renderer";
import {World} from "../experience/World";
import {Resources} from "./Resources";
import {SourceInterface, sources} from "../experience/sources";
import {Debug} from "./Utils/Debug";

let instance: Experience | null = null

export class Experience {
    public canvas: HTMLCanvasElement;
    public sizes: Sizes;
    public time: Time;
    public scene: THREE.Scene;
    public camera: Camera;
    private renderer: Renderer;
    private world: World;
    public resources : Resources;
    public debug: Debug;

    constructor(canvas: string | undefined = undefined) {

        // Singleton
        if (instance) {
            // only one instance of the experience will be instantiated
            return instance
        }
        instance = this

        this.resources = new Resources(sources as SourceInterface[])

        window.experience = this
        this.createCanvas(canvas);

        // Init of the different component
        this.debug = new Debug()
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
        this.world.update()
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
    private createCanvas(canvas: string | undefined): void {
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

    public destroy(): void
    {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })
        this.camera.controls.dispose()
        this.renderer.instance?.dispose()
        this.debug?.ui?.destroy()
        this.canvas.remove()
    }
}