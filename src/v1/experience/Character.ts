import {Experience} from "../classes/Experience";
import * as THREE from "three";
import {Resources} from "../classes/Resources";
import {Time} from "../classes/Utils/Time";
import * as dat from 'lil-gui';

export class Character {
    private experience: Experience;
    private scene: THREE.Scene;
    private resources: Resources;
    private resource: any;
    private model: THREE.Scene;
    private animation: {
        play?: (name) => void;
        actions?: any;
        mixer?: THREE.AnimationMixer;
    };
    private time: Time;
    private debugFolder: dat.GUI | undefined;

    constructor() {
        this.experience = new Experience()

        // Debug
        if (this.experience.debug.active && this.experience.debug.ui) {
            this.debugFolder = this.experience.debug.ui.addFolder('character')
        }

        this.time = this.experience.time
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setModel()
        this.setAnimation()
    }

    private setModel() {
        this.model = this.resource.scene
        this.model.scale.set(0.02, 0.02, 0.02)
        this.scene.add(this.model)

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
            }
        })
    }

    private setAnimation() {
        this.animation = {}
        this.animation.play = (name) => {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)
            this.animation.actions.current = newAction
        }

        // Debug
        if (this.experience.debug.active && this.experience.debug.ui) {
            if (this.animation && this.debugFolder) {
                const debugObject = {
                    playIdle: () => {
                        this.animation.play && this.animation.play('idle')
                    },
                    playWalking: () => {
                        this.animation.play && this.animation?.play('walking')
                    },
                    playRunning: () => {
                        this.animation.play && this.animation.play('running')
                    }
                }
                this.debugFolder.add(debugObject, 'playIdle')
                this.debugFolder.add(debugObject, 'playWalking')
                this.debugFolder.add(debugObject, 'playRunning')
            }
        }

        this.animation.mixer = new THREE.AnimationMixer(this.model)
        this.animation.actions = this.animation.mixer.clipAction(this.resource.animations[0])

        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])

        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()
    }

    public update() {
        this.animation.mixer?.update(this.time.delta * 0.001)
    }
}