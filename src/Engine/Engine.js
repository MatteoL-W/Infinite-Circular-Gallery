import * as THREE from 'three';

import Debug from './Debugger/Debug.js';
import Sizes from './Utils/Sizes.js';
import Time from './Utils/Time.js';
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import Gallery from './Gallery/Gallery.js';
import Resources from './Utils/Resources.js';
import Events from './EventsHandler/Events';

import sources from './sources.js';

let instance = null;

export default class Engine {
    constructor(_canvas) {
        // Singleton
        if (instance) {
            return instance;
        }
        instance = this;

        // Global access
        window.engine = this;

        // Options
        this.canvas = _canvas;

        // Setup
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.gallery = new Gallery();

        // Resize event
        this.sizes.on(Events.Resize, () => {
            this.resize();
        });

        // Time tick event
        this.time.on(Events.Tick, () => {
            this.update();
        });

        this.resizeWebGL();
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
        this.resizeWebGL();
    }

    resizeWebGL() {
        this.screen = {
            height: window.innerHeight,
            width: window.innerWidth
        };

        const fov = this.camera.instance.getEffectiveFOV() * (Math.PI / 180);
        const height = 2 * Math.tan(fov / 2) * this.camera.instance.position.z;
        const width = height * this.camera.instance.aspect;

        this.viewport = {
            height,
            width
        };
    }

    update() {
        this.camera.update();
        this.gallery.update();
        this.renderer.update();
    }

    destroy() {
        this.sizes.off(Events.Resize);
        this.time.off(Events.Tick);

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key];

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function') {
                        value.dispose();
                    }
                }
            }
        });

        this.renderer.instance.dispose();

        if (this.debug.active)
            this.debug.ui.destroy();
    }
}