import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { vLazy } from './directives/lazy';
import { vTrack } from './directives/track';
import './styles/global.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.directive('lazy', vLazy);
app.directive('track', vTrack);
app.mount('#app');
