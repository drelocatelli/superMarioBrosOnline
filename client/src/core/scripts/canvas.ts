import useGlobalState, { IUseGlobalState } from '@core/store/global';
import Konva from 'konva';
import { Rect } from 'konva/lib/shapes/Rect';

class Canvas {
    canvas = document.querySelector('#canvas') as HTMLDivElement;
    background?: Rect;
    firstPlayerMoveBgPosition = false;
    canReturnBack = true;

    constructor() {
        const globalState: IUseGlobalState = useGlobalState();
        this.createStage(globalState);
        this.createBackground(globalState);
    }

    createStage(globalState: IUseGlobalState) {
        globalState.setStage(
            new Konva.Stage({
                id: '0',
                container: '#canvas',
                width: this.canvas.offsetWidth,
                height: this.canvas.offsetHeight,
            }),
        );
        globalState.setLayer(new Konva.Layer());
    }

    createBackground(globalState: IUseGlobalState) {
        let layer = new Konva.Layer({
            id: 'background',
            width: this.canvas.offsetWidth,
            height: this.canvas.offsetHeight,
        });
        let vm = this;
        let imageObj = new Image();
        imageObj.onload = function () {
            var htmlImage = imageObj as HTMLImageElement;
            let mainBg = new Konva.Rect({
                id: 'background',
                width: vm.canvas.offsetWidth,
                height: vm.canvas.offsetHeight,
                fill: '#4fd2fe',
            });
            let bg = new Konva.Rect({
                id: 'background',
                y: vm.canvas.offsetHeight / 3.5,
                width: vm.canvas.offsetWidth,
                height: vm.canvas.offsetHeight,
                fillPatternImage: htmlImage,
                fillPatternRepeat: 'repeat-x',
            });
            bg.zIndex(-1);
            mainBg.zIndex(0);
            layer.add(mainBg);
            layer.add(bg);
            layer.draw();
            vm.background = bg;
        };
        imageObj.onerror = function () {
            console.error('Error loading image');
        };
        imageObj.src = '/background.jpg';

        globalState.setLayer(layer);
    }
}

export default Canvas;
