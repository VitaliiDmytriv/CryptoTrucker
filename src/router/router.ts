import { createRouter, createWebHistory } from "vue-router";
import Transactions from "../views/Transactions.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  { path: "/", component: Transactions },
  { name: "coin", path: "/:coin", component: Transactions },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
