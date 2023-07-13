import useGlobalState from '@core/store/global';
import Konva from 'konva';
import { Rect } from 'konva/lib/shapes/Rect';

type block = 'vertically' | 'horizontally';
interface IPlatformProps {
    block?: block;
    details?: string[];
    background?: string;
    position?: {
        x?: number;
        y?: number;
    };
    height?: number;
    width?: number;
}

class Platform {
    block: block = 'horizontally';
    element?: Rect;
    background = '#33b233';
    details: string[] = [];
    position = {
        x: 0,
        y: 0,
    };

    initialPosition = {
        x: 0,
        y: 0,
    };

    width = 200;
    height = 20;

    constructor(props?: IPlatformProps) {
        this.block = props?.block ?? this.block;
        this.position.x = props?.position?.x ?? this.position.x;
        this.position.y = props?.position?.y ?? this.position.y;
        this.initialPosition = this.position;
        this.width = props?.width ?? this.width;
        this.height = props?.height ?? this.height;
        this.background = props?.background ?? this.background;
        this.details = props?.details ?? this.details;
        this.create();
    }

    create() {
        const { game } = useGlobalState();
        let element = new Konva.Rect({
            id: `platform_${this.block}_${game.platforms.length - 1}`,
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height,
            fill: this.background,
        });
        element.setAttr('details', this.details);
        this.element = element;
    }

    draw() {
        const { game } = useGlobalState();
        this.element?.moveToTop();
        game.layer.add(this.element);
    }
}

export type { IPlatformProps };
export default Platform;
