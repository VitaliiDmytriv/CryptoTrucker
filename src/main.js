import { createApp } from "vue";
import App from "./App.vue";
import "./assets/global.css";
import router from "./router/router.js";

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (prefersDark) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createApp(App).use(router).mount("#app");
