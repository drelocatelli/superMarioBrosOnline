import Platform from '../platform';

class PlatformSocket {
    canvas = document.querySelector('#canvas') as HTMLDivElement;
    elements = new Set<Platform>();

    constructor() {}

    create() {
        this.elements.add(new Platform(this.canvas));
    }
}

export default PlatformSocket;
