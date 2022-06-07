import * as THREE from './three.module.js';
import Camera from './camera.js';

class Scene {

    constructor() {

        this.scene = new THREE.Scene();
        this.cameras = [];
        this.sceneObjects = [];

    }

    render (client, newAspect) {
        this.sceneObjects.forEach(sceneObject=>{
            if (sceneObject.enabled) {
                sceneObject.update(client);
            }
        });

        this.cameras.forEach(camera=>{
            if (camera.enabled) {

                let tjsCamera = camera.THREEJSCamera;

                tjsCamera.aspect = newAspect;
                tjsCamera.updateProjectionMatrix();

                client.renderer.render(this.scene, tjsCamera);
            }
        });
    }

    addCamera (camera) {
        this.cameras.push(new Camera(camera));
    }

    removeCamera (camera) {
        for (var i = 0; i < this.cameras.length; i++) {
            let cam = this.cameras[i];
            if (camera == cam.THREEJSCamera) {
                this.cameras = this.cameras.splice(i, 1);
                break;
            }
        }
    }

    addSceneObject (sceneObject) {
        this.sceneObjects.push(sceneObject);
        this.scene.add(sceneObject.THREEJSComponent);
    }

    removeSceneObject (sceneObject) {
        let i = this.sceneObjects.indexOf(sceneObject);

        if (i > -1) {
            this.sceneObjects = this.sceneObjects.splice(i, 1);
            this.scene.remove(sceneObject.THREEJSComponent);
        }
    }
}

export default Scene;