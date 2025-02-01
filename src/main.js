import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import 'vuetify/styles';
import './style.css'
import router from './router';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App)

app.use(vuetify)
app.use(router);
app.use(pinia);

app.mount('#app')

// createApp(App).mount('#app')
