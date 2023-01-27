import {Debug} from "./GameUtils/Debug";
import {Sizes} from "./GameUtils/Sizes";
import {Time} from "./GameUtils/Time";
import * as THREE from "three";
import {Camera} from "./Level/Camera";

let gameInstance: Game | null = null

export class Game {
    canvas: HTMLCanvasElement | undefined;
    public debug: Debug;
    public sizes: Sizes;
    private time: Time;
    public scene: THREE.Scene;
    private camera: Camera;
    public level;

    constructor(canvas: string | undefined = undefined) {
        // Singleton
        if (gameInstance) {
            // only one instance of the game will be instantiated
            return gameInstance
        }
        gameInstance = this

        this.createCanvas(canvas);

        // Init of the different component
        this.debug = new Debug();
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()
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
}
