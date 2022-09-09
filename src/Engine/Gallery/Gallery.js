import Engine from '../Engine.js';
import Events from "../EventsHandler/Events";
import {PlaneGeometry} from "three";
import Media from "../Media/Media";
import GalleryEventsHandler from "./GalleryEventsHandler";
import {lerp} from "three/src/math/MathUtils";

export default class Gallery {
    constructor() {
        this.experience = new Engine();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.createScrollObject();
        this.galleryEventsHandler = new GalleryEventsHandler(this);

        // Wait for resources
        this.resources.on(Events.Ready, () => {
            this.createGeometry();
            this.defineMediasImages();
            this.createMedias();
            this.galleryEventsHandler.activateEventListener();
        });
    }

    update() {
        this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)

        if (this.scroll.current > this.scroll.last) {
            this.direction = 'right'
        } else {
            this.direction = 'left'
        }

        if (this.medias) {
            this.medias.forEach(media => media.update(this.scroll, this.direction))
        }

        this.scroll.last = this.scroll.current
    }

    createGeometry() {
        this.planeGeometry = new PlaneGeometry(1, 1, 50, 100);
    }

    defineMediasImages() {
        this.mediasImages = [
            { image: 'Image1', text: 'New Synagogue' },
            { image: 'Image2', text: 'Paro Taktsang' },
            { image: 'Image3', text: 'Petra' },
            { image: 'Image4', text: 'Gooderham Building' },
            { image: 'Image5', text: 'Catherine Palace' },
            { image: 'Image6', text: 'Sheikh Zayed Mosque' },
            { image: 'Image7', text: 'Madonna Corona' },
            { image: 'Image8', text: 'Plaza de Espana' },
            { image: 'Image9', text: 'Saint Martin' },
            { image: 'Image10', text: 'Tugela Falls' },
            { image: 'Image11', text: 'Sintra-Cascais' },
            { image: 'Image12', text: 'The Prophet\'s Mosque' },
            { image: 'Image1', text: 'New Synagogue' },
            { image: 'Image2', text: 'Paro Taktsang' },
            { image: 'Image3', text: 'Petra' },
            { image: 'Image4', text: 'Gooderham Building' },
            { image: 'Image5', text: 'Catherine Palace' },
            { image: 'Image6', text: 'Sheikh Zayed Mosque' },
            { image: 'Image7', text: 'Madonna Corona' },
            { image: 'Image8', text: 'Plaza de Espana' },
            { image: 'Image9', text: 'Saint Martin' },
            { image: 'Image10', text: 'Tugela Falls' },
            { image: 'Image11', text: 'Sintra-Cascais' },
            { image: 'Image12', text: 'The Prophet\'s Mosque' },
        ]
    }

    createMedias() {
        this.medias = this.mediasImages.map(({ image, text }, index) => {
            return new Media({
                geometry: this.planeGeometry,
                gl: window.engine.canvas,
                image,
                index,
                length: this.mediasImages.length,
                scene: this.scene,
                screen: window.engine.screen,
                text,
                viewport: window.engine.viewport
            })
        })
    }

    createScrollObject() {
        this.scroll = {
            ease: 0.05,
            current: 0,
            target: 0,
            last: 0
        }
    }
}