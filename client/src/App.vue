<template>
    <lobby />
</template>

<script lang="ts">
import lobby from '@components/home/index.vue';

export default {
    components: {
        lobby,
    },
};
</script>

<style lang="scss">
body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #333;
}
</style>
