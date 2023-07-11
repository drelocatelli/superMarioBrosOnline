import Server from '@core/server';
import Platform from '../platform';

class PlatformSocket extends Server {
    canvas = document.querySelector('#canvas') as HTMLDivElement;
    elements = new Set<Platform>();

    constructor() {
        super();
    }

    create() {
        this.elements.add(new Platform(this.canvas));
    }
}

export default PlatformSocket;
