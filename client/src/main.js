import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { vuetify } from "./plugins/vuetify";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { store } from "./store";
import "./main.css";
const app = createApp(App);

app.use(router);
app.use(store);
app.use(vuetify);
app.use(Vue3Toastify, {
  autoClose: 3000,
});

app.mount("#app");
