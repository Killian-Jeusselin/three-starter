import {Experience} from "../classes/Experience";
import * as THREE from "three";
import {Environment} from "./Environnement";
import {Resources} from "../classes/Resources";
import {Floor} from "./Floor";
import {Character} from "./Character";
import {Dummy} from "./Dummy";
import {SimpleCharacter} from "../classes/SimpleCharacter";


export class World {
    private experience: Experience;
    private scene: THREE.Scene;
    private environment: Environment;
    private resources: Resources;
    private floor: Floor;
    private character: SimpleCharacter;
    private dummy: Dummy;
    private characterSnd: SimpleCharacter;

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.floor = new Floor()
            //this.character = new Character()
            //this.dummy = new Dummy()
            this.environment = new Environment()
            this.character = new SimpleCharacter({
                modelResource: {
                    name: 'dummy',
                    type: 'gltfModel',
                    path: 'static/models/dummy_animated/dummy_animated.glb'
                },
                name: 'test',
            });
            this.character.init()

            this.characterSnd =  new SimpleCharacter({
                modelResource: {
                    name: 'dummy',
                    type: 'gltfModel',
                    path: 'static/models/dummy_animated/dummy_animated.glb'
                },
                name: 'Character2',
                position: {
                    x: 2,
                    y: 0,
                    z: 1,
                }
            });
            this.characterSnd.init()
        })
    }

    public update() {
        if (this.character) {
            this.character.update()
        }
        if (this.characterSnd) {
            this.characterSnd.update()
        }
        if (this.dummy) {
            this.dummy.update()
        }

    }
}