import {SourceInterface} from "../../experience/sources";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import * as THREE from "three";

export class ResourceLoader {
    public resource: SourceInterface;
    private loaders: any;
    public isLoaded: boolean = false;
    public item: any;
    private onLoaded: () => void;
    type: 'gltf' | 'texture' | 'cubeTexture' | 'fbx';

    constructor(resource: SourceInterface, onLoaded: () => void) {
        this.resource = resource;
        this.onLoaded = onLoaded
        this.setLoaders()
        this.startLoading()
    }

    private startLoading(): void {

        if (this.resource.type === 'gltfModel') {
            this.loaders.gltfLoader.load(
                this.resource.path,
                (file: GLTF) => {
                    this.type = 'gltf'
                    this.isLoaded = true
                    this.item = file
                    this.onLoaded()
                }
            )
        } else if (this.resource.type === 'texture') {
            this.loaders.textureLoader.load(
                this.resource.path,
                (file: any) => {
                    this.type = 'texture'
                    this.isLoaded = true
                    this.item = file
                    this.onLoaded()
                }
            )
        } else if (this.resource.type === 'cubeTexture') {
            this.loaders.cubeTextureLoader.load(
                this.resource.path,
                (file: any) => {
                    this.type = 'cubeTexture'
                    this.isLoaded = true
                    this.item = file
                    this.onLoaded()
                }
            )
        } else if (this.resource.type === 'fbxModel') {
            this.loaders.fbxLoader.load(
                this.resource.path,
                (file: any) => {
                    this.type = 'fbx'
                    this.isLoaded = true
                    this.item = file
                    this.onLoaded()
                }
            )
        }

    }

    private setLoaders() {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
        this.loaders.fbxLoader = new FBXLoader()
    }
}