import Konva from 'konva';
import Player from './player';
import useGlobalState from '@core/store/global';

function Visual(this: Player) {
    const { game } = useGlobalState();

    const create = () => {
        let element = new Konva.Rect({
            id: this.id,
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height,
            fill: this.color,
        });
        game.layer.add(element);
        game.stage.add(game.layer);
        this.elements.push(element);
    };

    const remove = () => {
        if (this.animId) {
            let removeAnim = requestAnimationFrame(this.remove.bind(this));
            this.elements.forEach((container) => container.remove());
            cancelAnimationFrame(this.animId);
            if (this.elements.length == 0) {
                cancelAnimationFrame(removeAnim);
            }
        }
    };

    const track = () => {
        this.elements.slice(0, -1).forEach((element) => {
            element.remove();
        });
        this.currentPosition = {
            x: this.elements[this.elements.length - 1].position().x,
            y: this.elements[this.elements.length - 1].position().y,
        };
    };

    return {
        create,
        track,
        remove,
    };
}

export default Visual;
