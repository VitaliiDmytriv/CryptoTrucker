import { createRouter, createWebHistory } from "vue-router";
import Transactions from "../views/Transactions.vue";
import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  { name: "coin", path: "/:coin", component: Transactions },
  { path: "/", component: Home },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
