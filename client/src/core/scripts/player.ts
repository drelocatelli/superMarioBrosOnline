import Canvas from './canvas';

interface IPlayerAttrib {
    position?: { x: number; y: number };
    velocity?: { x: number; y: number };
}

class Player extends Canvas {
    id;
    position;
    private width;
    private height;
    velocity;
    element?: HTMLDivElement;

    static defaultProps = {
        gravity: 0.5,
        position: {
            x: 100,
            y: 100,
        },
    };

    constructor(id: string, props?: IPlayerAttrib) {
        super();
        this.id = id;
        this.position = props?.position ?? {
            x: 100,
            y: 100,
        };
        this.velocity = props?.velocity ?? {
            x: 0,
            y: 0,
        };
        this.width = 100;
        this.height = 100;
    }

    draw() {
        const element = document.createElement('div');
        element.dataset.id = this.id;
        this.canvas.appendChild(element);
        element.style.cssText = `
            position: absolute;
            z-index:1;
            background: red;
            top: ${this.position.y}px;
            left: ${this.position.x}px;
            width: ${this.width}px;
            height: ${this.height}px;
        `;
        this.element = element;
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y <= this.canvas.offsetHeight) this.velocity.y += Player.defaultProps.gravity;
        else this.velocity.y = 0;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        let elements = this.canvas.querySelectorAll(`[data-id="${this.id}"]`);
        // remove avoiding last
        Array.from(elements)
            .slice(0, -1)
            .forEach((element) => {
                element.remove();
            });

        this.update();
        this.draw();
    }

    static movement() {
        document.addEventListener('keydown', ({ code }) => {
            switch (code) {
                case 'ArrowUp':
                    console.log('up');
                    break;
                case 'ArrowDown':
                    console.log('Down');
                    break;
            }
        });
    }
}

export default Player;
