import Canvas from './canvas';
import Service from './service';

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
            x: 20,
            y: 20,
        },
        maxJumpPos: 200, // less than 200 more tall, triple jump mode
        velocity: 10,
        stop_velocity: 5,
    };

    constructor(props: { id: string; color: string; socketId: string; attr?: IPlayerAttrib }) {
        super();
        this.color = props.color;
        this.id = props.id;
        this.currentPlayer = props.socketId == props.id;
        this.position = props.attr?.position ?? {
            x: 20,
            y: 20,
        };
        this.velocity = props.attr?.velocity ?? {
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
            canvas: this.canvas.getBoundingClientRect(),
        };

        if (currentPosition.y < currentPosition.canvas.y) {
            this.position.y = 0;
            this.velocity.y = 0;
        }

        if (this.keys.right.pressed) {
            this.velocity.x = Player.defaultProps.stop_velocity;
        } else if (
            this.keys.left.pressed &&
            currentPosition.x >= Player.defaultProps.velocity &&
            currentPosition.x >= currentPosition.canvas.x + 10
        ) {
            this.velocity.x = -Player.defaultProps.stop_velocity;
        } else this.velocity.x = 0;

        // move platform with keys
        Service.sockets.platforms.elements.forEach((platform) => {
            if (this.keys.right.pressed) {
                platform.position.x -= this.velocity.y;
            } else if (this.canReturnBack && this.keys.left.pressed) {
                platform.position.x += this.velocity.y;
            }
        });

        // platform colision detection
        Service.sockets.platforms.elements.forEach((platform) => {
            if (
                this.position.y + this.height <= platform.position.y &&
                this.position.y + this.height + this.velocity.y >= platform.position.y &&
                this.position.x + this.width >= platform.position.x &&
                this.position.x <= platform.position.x + platform.width
            ) {
                this.velocity.y = 0;
            }
        });
    }
}

interface IPlayerProps {
    container: NodeListOf<HTMLDivElement>;
}

export type { IPlayerProps };
export default Player;
