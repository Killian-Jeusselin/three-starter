import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Clock} from "three";

document.addEventListener("DOMContentLoaded", async function() {
    const clock = new Clock();
    // Création de la scène
    const scene = new THREE.Scene();
    const glbLoader = new GLTFLoader()

    const avatar = await glbLoader.loadAsync('static/v2/avatar_naked.glb')

    //const skeleton =  avatar.scene.getObjectByName( "Armature" )!;
    const skeleton = avatar.scene.children[0]
    const helper = new THREE.SkeletonHelper( skeleton );
    console.log(avatar.scene)

    scene.add( helper );
    scene.add(avatar.scene)

    const jacket = await glbLoader.loadAsync('static/v2/jacket.glb')

    const jacketSkinned = new THREE.SkinnedMesh(jacket.scene.children[1]);
    const staticModel = jacket.scene.getObjectByName( "Armature" )!;

    console.log(staticModel)
    //const staticModel = jacket.scene.children[0];
    staticModel.matrixAutoUpdate = false;
    staticModel.matrixWorldNeedsUpdate= true
    skeleton.add(staticModel);

    // Création de la caméra
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    camera.position.z = 5;


    const ambient = new THREE.AmbientLight('#ffffff')
    scene.add(ambient)

    const light = new THREE.DirectionalLight('#ffffff', 4)
    scene.add(light)


    // Récupération de l'animation
    const animation = avatar.animations[0]
    // Création du mixeur d'animation
    var mixer = new THREE.AnimationMixer(avatar.scene);

    const animation2 = jacket.animations[0]
    var mixer2 = new THREE.AnimationMixer(jacket.scene);

    if(animation){
        // Ajout de l'animation au mixeur
        const action = mixer.clipAction(animation);
        const action2 = mixer2.clipAction(animation2);

        // Démarrage de l'animation
        action.play();
        action2.play();
    }


    // Création du renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xffffff );

    const controls = new OrbitControls( camera, renderer.domElement );
    document.body.appendChild( renderer.domElement );

    controls.update();


    staticModel.matrixAutoUpdate = false
    staticModel.matrixWorldNeedsUpdate = true
    console.log(staticModel)

// Boucle d'animation
    function animate() {
        const delta = clock.getDelta()
        requestAnimationFrame( animate );

        // Mise à jour de l'animation
        mixer.update(delta);
        mixer2.update(delta);

        skeleton.updateMatrixWorld();
        //staticModel.applyMatrix4(skeleton.matrix);

        controls.update();
        renderer.render( scene, camera );

    }
    animate();

});