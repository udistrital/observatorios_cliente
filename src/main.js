import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia';
import SweetAlertPlugin from './plugins/sweetAlert';
import vuetify from './plugins/vuetify'
import 'vuetify/styles';
import './style.css'

const pinia = createPinia();
const app = createApp(App)

app.use(SweetAlertPlugin);
app.use(vuetify)

app.use(router);
app.use(pinia);

app.mount('#app')

// createApp(App).mount('#app')
