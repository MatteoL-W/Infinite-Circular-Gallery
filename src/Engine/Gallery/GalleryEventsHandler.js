import Engine from '../Engine.js';
import NormalizeWheel from 'normalize-wheel';

export default class GalleryEventsHandler {
    constructor(gallery) {
        this.engine = new Engine();
        this.gallery = gallery;

        this.activateEventListener();
    }

    activateEventListener() {
        window.addEventListener('mousewheel', this.onWheel.bind(this))
        window.addEventListener('wheel', this.onWheel.bind(this))

        window.addEventListener('mousedown', this.onTouchDown.bind(this))
        window.addEventListener('mousemove', this.onTouchMove.bind(this))
        window.addEventListener('mouseup', this.onTouchUp.bind(this))

        window.addEventListener('touchstart', this.onTouchDown.bind(this))
        window.addEventListener('touchmove', this.onTouchMove.bind(this))
        window.addEventListener('touchend', this.onTouchUp.bind(this))
    }

    /**
     * Events.
     */
    onTouchDown (event) {
        this.isDown = true

        this.gallery.scroll.position = this.gallery.scroll.current
        this.start = event.touches ? event.touches[0].clientX : event.clientX
    }

    onTouchMove (event) {
        if (!this.isDown) return

        const x = event.touches ? event.touches[0].clientX : event.clientX
        const distance = (this.start - x) * 0.2

        this.gallery.scroll.target = this.gallery.scroll.position + distance
    }

    onTouchUp (event) {
        this.isDown = false
    }

    onWheel (event) {
        const normalized = NormalizeWheel(event)
        const speed = normalized.pixelY

        this.gallery.scroll.target += speed * 0.1
    }
}