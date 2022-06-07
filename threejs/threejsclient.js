import * as THREE from './three.module.js';
import Scene from './scene.js';
import { GLTFLoader } from './GLTFLoader.js';
import SceneObject from './sceneobject.js';

class THREEJSClient {

    constructor(frameDOMElement) {

        this.frameDOMElement = frameDOMElement;
        this.scenes = [];
        this.currentScene = null;
        this.deltaTime = 0.0;
        this.elapsedTime = 0.0;
        this.gltfLoader = new GLTFLoader();

        let computedFrameStyle = frameDOMElement.getBoundingClientRect();
        this.width = computedFrameStyle.width;
        this.height = computedFrameStyle.height;

        const FOV = 75;
        const clip = { near:0.1, far:1000 };
    
        const scene = new Scene();
        this.addScene(scene);
        this.currentScene = scene;

        const mainCamera = new THREE.PerspectiveCamera(FOV, this.width / this.height, clip.near, clip.far);
        this.addCamera(mainCamera);

        const renderer = new THREE.WebGLRenderer();
        this.renderer = renderer;
        renderer.physicallyCorrectLights = true;
        renderer.shadowMap.enabled = true;
        renderer.setSize(this.width, this.height);
        renderer.setPixelRatio(window.devicePixelRatio*2);


        frame.appendChild(renderer.domElement);

        let client = this;
        function animate() {

            let computedFrameStyle = frameDOMElement.getBoundingClientRect();
            client.width = computedFrameStyle.width;
            client.height = computedFrameStyle.height;
            let newAspect = client.width / client.height;
            renderer.setSize(client.width, client.height);

            client.currentScene.render(client, newAspect);

            client.deltaTime = ( performance.now() - client.elapsedTime ) / 1000;
            client.elapsedTime = performance.now();

            requestAnimationFrame(animate);

        }

        this.deltaTime = performance.now(); 
        animate();
    }

    addSceneObject (sceneObject) {
        this.currentScene.addSceneObject(sceneObject);
    }

    removeSceneObject (sceneObject) {
        this.currentScene.removeSceneObject(sceneObject);
    }

    addCamera (camera) {
        this.currentScene.addCamera(camera);
    }

    removeCamera (camera) {
        this.currentScene.removeCamera(camera);
    }

    addScene (scene) {
        this.scenes.push(scene);
    }

    removeScene (scene) {
        let i = this.scenes.indexOf(scene);

        if (i > -1) {
            this.scenes = this.scenes.splice(i, 1);
        }
    }

    async addGLTF (url) {
        let gltfResult = null;

        await new Promise(resolve => {
            this.gltfLoader.load(
                // resource URL
                url,
                // called when the resource is loaded
                function ( gltf ) {

                    gltf.scene.traverse(function (child) {
                        if (child.isMesh) {
                            child.receiveShadow = true;
                            child.castShadow = true;
                        }
                        else if (child.isLight) {
                            child.intensity = 0;
                            // child.castShadow = true;
                            // child.shadow.bias = -0.003;
                            // child.shadow.mapSize.width = 2048;
                            // child.shadow.mapSize.height = 2048;
                        }
                    })

                    let sceneObj = new SceneObject(gltf.scene);
                    sceneObj.gltf = gltf;
                    sceneObj.gltfScene = gltf.scene;
                    gltfResult = sceneObj;
                    resolve();
            
                    // scene.add( gltf.scene );
            
                    // gltf.animations; // Array<THREE.AnimationClip>
                    // gltf.scene; // THREE.Group
                    // gltf.scenes; // Array<THREE.Group>
                    // gltf.cameras; // Array<THREE.Camera>
                    // gltf.asset; // Object
            
                },
                // called while loading is progressing
                function ( xhr ) {
            
                    // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            
                },
                // called when loading has errors
                function ( error ) {
            
                    console.log( 'An error happened while loading gltf: ' + error );
                    resolve();
                }
            );
        });

        return gltfResult;
    }

}

export default THREEJSClient;