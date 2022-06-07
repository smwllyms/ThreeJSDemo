
class SceneObject {
    constructor (THREEJSComponent) {
        this.THREEJSComponent = THREEJSComponent;
        this.updateFunction = (o,c)=>{};
        this.enabled = true;
    }

    update (client) {
        if (this.updateFunction)
            this.updateFunction(this, client);
    }
}

export default SceneObject;