import { Rect } from 'konva/lib/shapes/Rect';
import Canvas from '../canvas';
import Collision from './collision';
import Movement from './movement';
import Visual from './visual';

interface IPlayerAttrib {
    position?: { x: number; y: number };
    speed?: { x: number; y: number };
}

class Player extends Canvas {
    id;
    screenLevel = 0;
    position;
    scrollOffset = 0;
    screenPosX = 0;
    width;
    height;
    speed;
    element?: Rect;
    elements: Rect[] = [];
    animId?: number;
    color: string;
    currentPlayer: boolean;
    currentPosition?: {
        x: number;
        y: number;
    };

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
        speed: 10,
        stop_speed: 5,
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
        this.speed = props.attr?.speed ?? {
            x: 0,
            y: 0,
        };
        this.width = 100;
        this.height = 100;
    }

    draw() {
        Visual.call(this).create();
        Visual.call(this).track();
    }

    remove() {
        Visual.call(this).remove();
    }

    update() {
        this.draw();
        Movement.call(this).gravity();
    }

    animate() {
        Movement.call(this).animate();
        Collision.call(this);
    }
}

interface IPlayerProps {
    container: NodeListOf<HTMLDivElement>;
}

export type { IPlayerProps };
export default Player;
