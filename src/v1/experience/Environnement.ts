import {Experience} from "../classes/Experience";
import * as THREE from "three";
import {Resources} from "../classes/Resources";
import {Floor} from "./Floor";

export class Environment
{
    private experience: Experience;
    private scene: THREE.Scene;
    private light: THREE.DirectionalLight;
    private resources: Resources;
    private environmentMap: any;
    private floor: Floor;
    private environment: Environment;
    private debugFolder: any;

    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Debug
        if(this.experience.debug.active)
        {
            this.debugFolder = this.experience.debug.ui?.addFolder('environment')
        }

        this.resources.on('ready', () =>
        {
            // Setup
            this.floor = new Floor()
            this.environment = new Environment()
        })
        
        // Setup
        this.setLight()
        this.setEnvironmentMap()
    }

    /**
     * To change the light properties
     * simply change the values below
     */
    private setLight()
    {
        this.light = new THREE.DirectionalLight('#ffffff', 4)
        this.light.castShadow = true
        this.light.shadow.camera.far = 15
        this.light.shadow.mapSize.set(1024, 1024)
        this.light.shadow.normalBias = 0.05
        this.light.position.set(3, 3, - 2.25)
        this.scene.add(this.light)

        // Debug
        if(this.experience.debug.active)
        {
            this.debugFolder
                .add(this.light, 'intensity')
                .name('LightIntensity')
                .min(0)
                .max(10)
                .step(0.001)

            this.debugFolder
                .add(this.light.position, 'x')
                .name('LightX')
                .min(- 5)
                .max(5)
                .step(0.001)

            this.debugFolder
                .add(this.light.position, 'y')
                .name('LightY')
                .min(- 5)
                .max(5)
                .step(0.001)

            this.debugFolder
                .add(this.light.position, 'z')
                .name('LightZ')
                .min(- 5)
                .max(5)
                .step(0.001)
        }
    }

    private setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.encoding = THREE.sRGBEncoding

        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()

        // Debug
        if(this.experience.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}