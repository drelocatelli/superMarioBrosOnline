import Platform from '@core/scripts/platform';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { defineStore } from 'pinia';
import { ref } from 'vue';

interface IGameStore {
    winPositionX: number;
    started: boolean;
    platforms: Platform[];
    stage?: Stage;
    layer?: Layer;
}

interface IUseGlobalState {
    game: IGameStore;
    setStage: (stage: Stage) => void;
    setLayer: (layer: Layer) => void;
    setGameStatus: (started: boolean) => void;
    decrementPlatformPositionX: (idx: number, value: number) => void;
}

const useGlobalState = defineStore('global', () => {
    const game = ref<IGameStore>({ winPositionX: 500, started: false, platforms: [], stage: undefined, layer: undefined });

    function setStage(stage: Stage) {
        game.value.stage = stage;
    }

    function setLayer(layer: Layer) {
        game.value.layer = layer;
    }

    function setGameStatus(started: boolean) {
        game.value.started = started;
    }

    function decrementPlatformPositionX(idx: number, value: number) {
        const currentPosX = game.value.platforms[idx].element!.x();
        game.value.platforms[idx].element!.x(currentPosX - value);
    }

    return { game, setGameStatus, decrementPlatformPositionX, setStage, setLayer };
});

export type { IUseGlobalState };
export default useGlobalState;
