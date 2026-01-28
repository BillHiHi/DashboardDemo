import { createApp } from 'vue'
import './style.css'
import router from './router'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'

createApp(App)
  .use(router)
  .mount('#app')
