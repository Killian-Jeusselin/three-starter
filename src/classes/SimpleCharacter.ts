import {Experience} from "./Experience";
import * as dat from "lil-gui";
import * as THREE from "three";
import {Time} from "./Utils/Time";
import {Resources} from "./Resources";
import {SourceInterface} from "../experience/sources";
import {Object3D} from "three";
import {ResourceLoader} from "./Utils/ResourceLoader";

export interface SimpleCharacterInterface {
    modelResource: SourceInterface;
    name: string;
    scale?: number;
    position?: {
        x: number;
        y: number;
        z: number;
    }
}

export class SimpleCharacter {
    private experience: Experience;
    private debugFolder: dat.GUI | undefined;
    private time: Time;
    private scene: THREE.Scene;
    private resources: Resources;
    private modelResource: SourceInterface;
    private model: any;
    private isLoaded: boolean = false;
    public item;
    public name: string;
    private scale: number;
    private animation: {
        play?: (name: string) => void;
        actions?: any;
        mixer?: THREE.AnimationMixer;
        availableActions?: string[]
    };
    private position: { x: number; y: number; z: number };

    constructor({modelResource, name, scale = 1, position = {x: 0, y: 0, z: 0}}: SimpleCharacterInterface) {
        this.experience = new Experience()
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.modelResource = modelResource
        this.name = name;
        this.scale = scale;
        this.position = position;
    }

    public init() {
        // Debug
        if (this.experience.debug.active && this.experience.debug.ui) {
            this.debugFolder = this.experience.debug.ui.addFolder(this.name)
        }
        this.setModel()
    }

    private setModel() {
        const loader = new ResourceLoader(this.modelResource, () => {
            this.item = loader.item;

            if (loader.type === 'gltf') {
                this.item.scene.scale.set(this.scale, this.scale, this.scale)
                this.item.scene.position.set(this.position.x, this.position.y, this.position.z)

                this.animation = {}
                this.animation.play = (name: string) => {
                    const newAction = this.animation.actions[name]
                    const oldAction = this.animation.actions.current

                    newAction.reset()
                    newAction.play()
                    newAction.crossFadeFrom(oldAction, 1)
                    this.animation.actions.current = newAction
                }

                //Get all animation available in model and make it available on character
                this.animation.mixer = new THREE.AnimationMixer(this.item.scene)

                this.animation.actions = this.animation.mixer.clipAction(this.item.animations[0])
                this.animation.availableActions = []
                this.item.animations?.map((animation: THREE.AnimationClip) => {
                    if (this.animation.actions && this?.animation?.mixer) {
                        this.animation.actions[animation.name] = this.animation.mixer.clipAction(animation)
                        this.animation.availableActions?.push(animation.name)
                    }
                })


                if (this.animation && this.animation.availableActions) {

                    //Play the current Animation
                    this.animation.actions.current = this.animation.actions[this.animation.availableActions[0]]
                    this.animation.actions.current.play()

                    //Add the item onto the scene
                    this.experience.scene.add(this.item.scene)

                    this.item.scene.traverse((child: Object3D) => {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true
                        }
                    })
                }
                this.showDebug()
            }
        });
    }

    /**
     * Will add every animation available on 3d model on the debug
     * @private
     */
    private showDebug() {
        if (this.experience.debug.active && this.experience.debug.ui) {
            if (this?.animation?.availableActions && this.debugFolder) {

                const debugObject: any = {}
                this.animation.availableActions.map((animationName) => {
                    debugObject[animationName] = () => {
                        this.animation.play && this.animation.play(animationName)
                    }
                    this.debugFolder?.add(debugObject, animationName)
                })
            }
        }
    }

    public update() {
        if (this?.animation?.mixer) {
            this.animation.mixer?.update(this.time.delta * 0.001)
        }
    }
}