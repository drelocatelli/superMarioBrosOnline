import Platform from './platform';

class Canvas {
    canvas = document.querySelector('#canvas') as HTMLDivElement;
    platforms: Platform[] = [];

    constructor() {
        this.platforms.push(new Platform(this.canvas, { position: { y: 200, x: 500 } }));
        console.log(this.platforms);
    }
}

export default Canvas;
