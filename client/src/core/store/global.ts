import Platform from '@core/scripts/platform';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import _ from 'lodash';

type Direction = 'left' | 'right';

interface PlayersLeft {
    id: string;
    direction?: Direction;
}

interface IGameStore {
    winPositionX: number;
    started: boolean;
    platforms: Platform[];
    stage?: Stage;
    layer?: Layer;
    minOpacity: number;
    playersLeft: PlayersLeft[];
}

interface IUseGlobalState {
    game: IGameStore;
    setStage: (stage: Stage) => void;
    setLayer: (layer: Layer) => void;
    setGameStatus: (started: boolean) => void;
    decrementPlatformPositionX: (idx: number, value: number) => void;
    setPlayerLeft(): {
        add: (props: PlayersLeft) => void;
        remove: (props: PlayersLeft) => {
            id: string;
        }[];
    };
}

const useGlobalState = defineStore('global', () => {
    const game = ref<IGameStore>({
        winPositionX: 500,
        started: false,
        platforms: [],
        stage: undefined,
        layer: undefined,
        minOpacity: 0,
        playersLeft: [],
    });

    function setStage(stage: Stage) {
        game.value.stage = stage;
    }

    function setLayer(layer: Layer) {
        game.value.layer = layer;
    }

    function setGameStatus(started: boolean) {
        game.value.started = started;
    }

    function setPlayerLeft() {
        return {
            add: (props: PlayersLeft) => (game.value.playersLeft = _.uniqWith(game.value.playersLeft.concat(props), _.isEqual)),
            remove: (props: PlayersLeft) => (game.value.playersLeft = game.value.playersLeft.filter((details) => details.id !== props.id)),
        };
    }

    function decrementPlatformPositionX(idx: number, value: number) {
        const currentPosX = game.value.platforms[idx].element!.x();
        game.value.platforms[idx].element!.x(currentPosX - value);
    }

    return { game, setGameStatus, decrementPlatformPositionX, setStage, setLayer, setPlayerLeft };
});

export type { IUseGlobalState };
export default useGlobalState;
