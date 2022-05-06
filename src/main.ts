import generatedRoutes from 'virtual:generated-pages';
import { setupLayouts } from 'virtual:generated-layouts';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import App from './App.vue';
import { initToken } from '~/utils/token';

import '@unocss/reset/tailwind.css';
import './styles/main.css';
import 'uno.css';

export const routes = setupLayouts(generatedRoutes);
export const fakeRoutes = setupLayouts(generatedRoutes);

const pinia = createPinia();
const app = createApp(App);
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
app.use(router).use(pinia);
app.mount('#app');
initToken();
