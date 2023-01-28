import {Game} from "../Game";
import GUI from "lil-gui";
import {HasResource} from "../GameUtils/HasResource";
import {SourceInterface} from "../../experience/sources";
import * as THREE from "three";
import {Floor} from "./Floor";

export interface LevelDesignPropsInterface {
    resources: SourceInterface[];
    onLoaded: () => void
}

export class LevelDesign extends HasResource{
    private game : Game;
    private debugFolder: GUI | undefined;
    private light: THREE.DirectionalLight | undefined;
    private levelMap: any;
    private floor: Floor | null = null;

    constructor(props: LevelDesignPropsInterface) {
        super(props)
        this.game = new Game();

        // Debug
        if(this.game.debug.active)
        {
            this.debugFolder = this.game.debug.ui?.addFolder('environment')
        }
    }

    public onReady() {
        // Setup
        this.setLight()
        const environmentTexture = new THREE.Texture(this.items[0]);
        this.setEnvironmentMap(environmentTexture)
        this.floor = new Floor()
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
        this.game.scene.add(this.light)

        // Debug
        if(this.game.debug.active && this.debugFolder)
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

    private setEnvironmentMap(environmentTexture : THREE.Texture)
    {
        this.levelMap = {}
        this.levelMap.intensity = 0.4
        this.levelMap.texture = environmentTexture
        this.levelMap.texture.encoding = THREE.sRGBEncoding

        this.game.scene.environment = environmentTexture

        this.levelMap.updateMaterials = () =>
        {
            this.game.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.levelMap.texture
                    child.material.envMapIntensity = this.levelMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.levelMap.updateMaterials()

        // Debug
        if(this.game.debug.active)
        {
            this.debugFolder
                ?.add(this.levelMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.levelMap.updateMaterials)
        }
    }
}