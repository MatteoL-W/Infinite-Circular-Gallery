import Engine from '../Engine.js';
import Environment from './Environment.js';
import Floor from './Floor.js';
import Fox from './Fox.js';
import Events from "../Utils/Events";

export default class World {
    constructor() {
        this.experience = new Engine();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // Wait for resources
        this.resources.on(Events.Ready, () => {
            // Setup
            this.floor = new Floor();
            this.fox = new Fox();
            this.environment = new Environment();
        });
    }

    update() {
        if (this.fox)
            this.fox.update();
    }
}