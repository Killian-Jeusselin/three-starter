import * as THREE from "three";
import {Game} from "../Game";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export interface CameraPropsInterface {
    orbitControls?: boolean;
}

const cameraDefaultValues = {
    orbitControls: true
}

export class Camera {
    private game: Game;
    public instance: THREE.PerspectiveCamera;
    private controls: OrbitControls | null;

    constructor(props: CameraPropsInterface | undefined = cameraDefaultValues) {
        this.game = new Game()
        this.instance = new THREE.PerspectiveCamera(35, this.game.sizes.width / this.game.sizes.height, 0.1, 100)
        this.controls = props?.orbitControls ? new OrbitControls(this.instance, this.game.canvas) : null

        this.setInstance()

        if (this.controls) {
            this.setControls()
        }
    }

    private setInstance() {
        this.instance.position.set(6, 4, 8)
        this.game.scene.add(this.instance)
    }

    private setControls() {
        if (this.controls) this.controls.enableDamping = true
    }

    public update() {
        if (this.controls) this.controls.update()
    }

    public resize() {
        this.instance.aspect = this.game.sizes.width / this.game.sizes.height
        this.instance.updateProjectionMatrix()
    }
}