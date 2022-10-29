import {Experience} from "../classes/Experience";
import * as THREE from "three";
import {Environment} from "./Environnement";
import {Resources} from "../classes/Resources";
import {Floor} from "./Floor";
import {Character} from "./Character";
import {Dummy} from "./Dummy";


export class World {
    private experience: Experience;
    private scene: THREE.Scene;
    private environment: Environment;
    private resources: Resources;
    private floor: Floor;
    private character: Character;
    private dummy: Dummy;

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.floor = new Floor()
            //this.character = new Character()
            this.dummy = new Dummy()
            this.environment = new Environment()
        })
    }

    public update() {
        if (this.character) {
            this.character.update()
        }
        if (this.dummy) {
            this.dummy.update()
        }

    }
}