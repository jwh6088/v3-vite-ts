import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'
import microApp from '@micro-zoe/micro-app'

microApp.start()
const app = createApp(App as any)
app.use(router).use(createPinia())
app.mount('#app')
