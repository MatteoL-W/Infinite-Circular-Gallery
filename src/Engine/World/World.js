import Engine from '../Engine.js';
import Events from "../Utils/Events";

export default class World {
    constructor() {
        this.experience = new Engine();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // Wait for resources
        this.resources.on(Events.Ready, () => {
            // Setup
        });
    }

    update() {
    }
}