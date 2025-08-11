import { createApp } from "vue";
import App from "./App.vue";
import "./assets/global.css";
import router from "./router/router";
import { createPinia } from "pinia";

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (prefersDark) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount("#app");
