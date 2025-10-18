import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "./assets/global.css";
import "element-plus/dist/index.css";
import "@/assets/element.css";

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
app.use(ElementPlus);
app.mount("#app");
