import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router, { registerRouterGuards } from './router'

import "./util";

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

registerRouterGuards();