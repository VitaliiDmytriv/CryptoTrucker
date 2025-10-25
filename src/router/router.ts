import { createRouter, createWebHistory } from "vue-router";
// Layouts
import DefaultLayout from "@/layout/DefaultLayout.vue";
import AuthLayout from "@/layout/AuthLayout.vue";

// Views
import NotFound from "@/views/NotFound.vue";
import PortfolioView from "@/views/PortfolioView.vue";
import TransactionsView from "@/views/TransactionsView.vue";
import Assets from "@/views/Assets.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,

    children: [
      {
        path: "",
        component: PortfolioView,
        children: [
          { path: "", component: Assets, meta: { currentTab: "Assets" } },
          {
            path: ":coin",
            name: "coin",
            component: TransactionsView,
            meta: { currentTab: "Transactions" },
          },
        ],
      },
    ],
  },
  { path: "/login", component: AuthLayout },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
