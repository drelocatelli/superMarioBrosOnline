<template>
    <div id="splash">
        <button @click="startGame">Create new game</button>
    </div>
</template>

<script lang="ts">
import useGlobalState from './../core/store/global';
export default {
    setup() {
        return {
            globalStore: useGlobalState(),
        };
    },
    methods: {
        startGame() {
            console.log(this.globalStore);
        },
    },
};
</script>
../core/store/state
