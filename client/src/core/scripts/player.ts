import Canvas from './canvas';
import Server from '../server';
import Game from './game';

interface IPlayerAttrib {
    position?: { x: number; y: number };
    velocity?: { x: number; y: number };
}

const gravity = 0.5;

class Player extends Canvas {
    position;
    private width;
    private height;
    velocity;

    constructor(game: Game, props?: IPlayerAttrib) {
        super();
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
        game.create().player(this);
    }

    draw() {
        this.canvas.context.fillStyle = 'red';
        this.canvas.context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y <= this.canvas.el.height) this.velocity.y += gravity;
        else this.velocity.y = 0;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.canvas.context.clearRect(this.position.x, 0, this.canvas.el.width, this.canvas.el.height);
        this.update();
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
