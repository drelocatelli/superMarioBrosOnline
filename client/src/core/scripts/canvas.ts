class Canvas {
    el = document.querySelector('canvas') as HTMLCanvasElement;
    canvas = {
        el: this.el,
        context: this.el!.getContext('2d')!,
    };

    constructor() {
        this.canvas.el.width = window.innerWidth;
        this.canvas.el.height = window.innerHeight;
        this.canvas.el.style.setProperty('position', 'fixed');
    }
}

export default Canvas;
