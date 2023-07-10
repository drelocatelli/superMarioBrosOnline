<template>
    <canvas-area />
</template>

<script lang="ts">
import Game from '@core/scripts/game';

export default {
    mounted() {
        new Game();
    },
};
</script>
