import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { UserRoutes } from "./UserRoutes";
import { sharedRoutes } from "./SharedRoutes";
const routes: Array<RouteRecordRaw> = [...UserRoutes, ...sharedRoutes];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
