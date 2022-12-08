import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "IndexPage",
    component: () => import("pages/IndexPage/index.vue")
  },
  {
    path: "/down-excel-one",
    name: "DownExcelOne",
    component: () => import("pages/DownExcel_ONE/index.vue")
  },
  {
    path: "/down-excel-two",
    name: "DownExcelTWO",
    component: () => import("pages/DownExcel_TWO/index.vue")
  },
  {
    path: "/request",
    name: "Request",
    component: () => import("pages/Request/index.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router;
