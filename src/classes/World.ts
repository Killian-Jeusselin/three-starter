import {Experience} from "./Experience";
import * as THREE from "three";



export class World{
    private experience: Experience;
    private scene: THREE.Scene;

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        // Test mesh
        const testMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ wireframe: true })
        )
        this.scene.add(testMesh)
    }
}