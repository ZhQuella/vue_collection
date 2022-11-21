import { createApp } from 'vue'
import App from './App.vue';
import "plugins/style.plugin";

import router from "./routers";
import "./styles/index.scss"

const app = createApp(App);
app.use(router);
app.mount('#app');
