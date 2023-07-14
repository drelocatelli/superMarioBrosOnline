import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import VueKonva from 'vue-konva';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(VueKonva);
app.mount('#app');
