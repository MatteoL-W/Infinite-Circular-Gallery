import {LinearFilter, Mesh, ShaderMaterial} from "three";
import vertexShader from '/static/shaders/image-vertex.glsl';
import fragmentShader from '/static/shaders/image-fragment.glsl';
import Engine from "../Engine";
import {map} from "../Utils/Utils.js";

export default class {
    constructor({geometry, gl, image, index, length, renderer, scene, screen, text, viewport}) {
        this.experience = new Engine();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.geometry = geometry;
        this.gl = gl;
        this.image = image;
        this.index = index;
        this.length = length;
        this.scene = scene;
        this.screen = screen;
        this.text = text;
        this.viewport = viewport;

        this.extra = 0;

        this.createShader();
        this.createMesh();

        this.onResize();
    }

    createShader() {
        const texture = this.resources.items[this.image];
        texture.generateMipmaps = false;
        texture.magFilter = LinearFilter;
        texture.minFilter = LinearFilter;

        this.shader = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                tMap: {value: texture},
                uPlaneSizes: {value: [0, 0]},
                uImageSizes: {value: [0, 0]},
                uViewportSizes: {value: [this.viewport.width, this.viewport.height]}
            },
            transparent: true,
        });

        this.shader.uniforms.uImageSizes.value = [texture.source.data.naturalWidth, texture.source.data.naturalHeight];
    }

    createMesh() {
        this.plane = new Mesh(this.geometry, this.shader);
        this.scene.add(this.plane);
    }

    onResize({screen, viewport} = {}) {
        if (screen) {
            this.screen = screen;
        }

        if (viewport) {
            this.viewport = viewport;

            this.shader.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
        }

        this.scale = this.screen.height / 1500;

        this.plane.scale.y = this.viewport.height * (900 * this.scale) / this.screen.height;
        this.plane.scale.x = this.viewport.width * (700 * this.scale) / this.screen.width;

        this.shader.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

        // position all the rectangles in the x axis, making sure we have a small gap between them
        this.padding = 2;

        this.width = this.plane.scale.x + this.padding;
        this.widthTotal = this.width * this.length;

        this.x = this.width * this.index;
    }

    update(scroll, direction) {
        this.plane.rotation.z = map(this.plane.position.x, -this.widthTotal, this.widthTotal, Math.PI, -Math.PI)

        this.plane.position.x = this.x - scroll.current * 0.1 - this.extra;
        this.plane.position.y = Math.cos((this.plane.position.x / this.widthTotal) * Math.PI) * 75 - 75

        const planeOffset = this.plane.scale.x / 2;
        const viewportOffset = this.viewport.width;

        this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
        this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

        if (direction === 'right' && this.isBefore) {
            this.extra -= this.widthTotal;

            this.isBefore = false;
            this.isAfter = false;
        }

        if (direction === 'left' && this.isAfter) {
            this.extra += this.widthTotal;

            this.isBefore = false;
            this.isAfter = false;
        }
    }
}