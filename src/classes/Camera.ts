import * as THREE from "three";
import {Experience} from "./Experience";
import {Sizes} from "./Utils/Sizes";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class Camera {
    private experience: Experience;
    private sizes: Sizes;
    private scene: THREE.Scene;
    private readonly canvas: HTMLCanvasElement;
    public instance: THREE.PerspectiveCamera;
    private controls: OrbitControls;

    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.controls = new OrbitControls(this.instance, this.canvas)

        this.setInstance()
        this.setControls()
    }

    setInstance() {
        this.instance.position.set(6, 4, 8)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls.enableDamping = true
    }

    update() {
        this.controls.update()
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }
}