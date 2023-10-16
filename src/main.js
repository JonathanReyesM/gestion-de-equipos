import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import 'bootstrap/dist/css/bootstrap.css';
import  '@/assets/bootstrap.min.css'
import  '@/assets/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App);
app.use(router);
app.mount('#app');
