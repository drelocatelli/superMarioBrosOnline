import { createApp } from 'vue';
import App from './App.vue';
import Canvas from '@components/canvas/canvas.vue';

const app = createApp(App);
app.component('canvas-area', Canvas);
app.mount('#app');
