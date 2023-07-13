<template>
    <div id="edge">
        <div id="screen">
            <div id="screen-level">Screen: <span id="screenLevel">0</span></div>
        </div>
        <div id="canvas"></div>
    </div>
</template>

<script lang="ts">
import Game from '@core/scripts/game';

export default {
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
