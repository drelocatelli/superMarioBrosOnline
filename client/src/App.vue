<template>
    <div id="edge">
        <div id="screen">
            <div id="screen-players">
                <div id="players-left" v-for="[i, player] in globalState.game.playersLeft.slice(0, 3).entries()">
                    <div>
                        <li v-if="player.direction == 'left'">Player {{ i + 1 }}</li>
                    </div>
                    <div>
                        <li v-if="player.direction == 'right'">Player {{ i + 1 }}</li>
                    </div>
                </div>
            </div>
            <div id="screen-level" style="display: none">Screen: <span id="screenLevel">0</span></div>
        </div>
        <div id="canvas"></div>
    </div>
</template>

<script lang="ts">
import useGlobalState from '@core/store/global';
import Game from '@core/scripts/game';

export default {
    setup() {
        return {
            globalState: useGlobalState(),
        };
    },
    mounted() {
        new Game();
    },
};
</script>

<style lang="scss">
#screen {
    z-index: 100;
    color: #000;
    position: relative;
    top: 0;
    width: -webkit-fill-available;
    height: -webkit-fill-available;
    padding: 10px;
}

#players-left {
    display: flex;
    justify-content: space-between;

    div {
        li {
            list-style: none;
            background: #fff;
            border-radius: 5px;
            padding: 2px 1rem;
            box-shadow: inset 0px 0px 6px #4e4e4e;
            color: #333;
            text-shadow: 1px 1px 0px #ccc;
            margin-bottom: 3px;
        }
    }

    div:nth-child(1):not(:empty) {
        position: relative;
        li {
            padding-left: 28px;
        }

        &::after {
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-60%);
            content: '\25C2';
            display: inline-block;
            width: 10px;
            height: fit-content;
            padding: 2px;
            border-radius: 5px;
            color: #333;
            font-weight: bold;
            text-align: center;
        }
    }

    div:nth-child(2):not(:empty) {
        position: relative;
        li {
            padding-right: 28px;
        }

        &::after {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-60%);
            content: '\25B8';
            display: inline-block;
            width: 10px;
            height: fit-content;
            padding: 2px;
            border-radius: 5px;
            color: #333;
            font-weight: bold;
            text-align: center;
        }
    }
}

#screen * {
    user-select: none;
}

#screen-level {
    position: absolute;
    right: 15px;
}

body {
    font-family: cursive, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #000;
}

#edge {
    display: flex;
    width: 800px;
    height: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    contain: content;
    transform: translate(-50%, -50%);
}

#canvas {
    position: absolute;
    width: -webkit-fill-available;
    height: -webkit-fill-available;
}
</style>
