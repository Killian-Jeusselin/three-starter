import {Experience} from "./Experience";
import {Camera} from "./Camera";
import {Scene} from "three";
import {Sizes} from "./Utils/Sizes";
import * as THREE from "three";

export class Renderer {
    private experience: Experience;
    private readonly canvas: HTMLCanvasElement;
    private sizes: Sizes;
    private readonly scene: Scene;
    private camera: Camera;
    private instance: THREE.WebGLRenderer | undefined;
    private context: WebGLRenderingContext | WebGL2RenderingContext;

    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.setInstance()
    }

    setInstance() {

        this.instance = new THREE.WebGLRenderer({
            antialias: true,
            canvas: this.canvas,
        })

        this.instance.physicallyCorrectLights = true
        this.instance.outputEncoding = THREE.sRGBEncoding
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
        this.context = this.instance.getContext()

    }

    update() {
        this.instance
            ? this.instance.render(this.scene, this.camera.instance)
            : console.error('forgot to set instance before render in update')
    }

    resize() {
        if (!this.instance) {
            console.error('forgot to set instance before render in resize');
            return
        }
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }
}