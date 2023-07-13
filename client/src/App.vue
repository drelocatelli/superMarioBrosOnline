<template>
    <div id="edge">
        <splash />
        <div id="screen">a</div>
        <div id="canvas"></div>
    </div>
</template>

<script lang="ts">
import Game from '@core/scripts/game';
import splash from './components/splash.vue';

export default {
    components: { splash },
    mounted() {
        new Game();
    },
};
</script>

<style lang="scss">
body {
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
