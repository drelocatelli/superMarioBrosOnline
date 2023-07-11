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
    animId?: number;
    color: string;
    currentPlayer: boolean;

    keys = {
        right: {
            pressed: false,
        },
        left: {
            pressed: false,
        },
    };

    static defaultProps = {
        gravity: 0.5,
        position: {
            x: 100,
            y: 100,
        },
        velocity: 20,
        stop_velocity: 5,
    };

    constructor(id: string, color: string, currentPlayer: boolean, props?: IPlayerAttrib) {
        super();
        this.color = color;
        this.id = id;
        this.currentPlayer = currentPlayer;
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
        console.dir(this.canvas);
    }

    draw() {
        const element = document.createElement('div');
        element.dataset.id = this.id;
        this.canvas.appendChild(element);

        element.style.cssText = `
            position: absolute;
            z-index:1;
            background: ${this.color};
            top: ${this.position.y}px;
            left: ${this.position.x}px;
            width: ${this.width}px;
            height: ${this.height}px;
        `;
        this.element = element;
    }

    remove() {
        if (this.animId) {
            let removeAnim = requestAnimationFrame(this.remove.bind(this));
            let containers = this.canvas.querySelectorAll(`[data-id="${this.id}"]`);
            containers.forEach((container) => container.remove());
            cancelAnimationFrame(this.animId);
            if (containers.length == 0) {
                cancelAnimationFrame(removeAnim);
            }
        }
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y <= this.canvas.offsetHeight) this.velocity.y += Player.defaultProps.gravity;
        else this.velocity.y = 0;
    }

    animate() {
        this.animId = requestAnimationFrame(this.animate.bind(this));
        let elements: NodeListOf<HTMLDivElement> = this.canvas.querySelectorAll(`[data-id="${this.id}"]`);
        // remove avoiding last
        Array.from(elements)
            .slice(0, -1)
            .forEach((element) => {
                element.remove();
            });

        this.update();

        const currentPosition = {
            x: elements[elements.length - 1]?.getBoundingClientRect().x,
            y: elements[elements.length - 1]?.getBoundingClientRect().y,
        };

        if (this.keys.right.pressed && currentPosition.x <= this.canvas.getBoundingClientRect().width - 120) {
            this.velocity.x = Player.defaultProps.stop_velocity;
        } else if (this.keys.left.pressed && currentPosition.x >= Player.defaultProps.velocity) {
            this.velocity.x = -Player.defaultProps.stop_velocity;
        } else this.velocity.x = 0;
    }
}

interface IPlayerProps {
    container: NodeListOf<HTMLDivElement>;
}

export type { IPlayerProps };
export default Player;
