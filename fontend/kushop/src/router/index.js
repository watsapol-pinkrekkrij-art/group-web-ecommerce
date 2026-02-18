import { createRouter, createWebHistory } from "vue-router";
import TheProduct from "@/components/TheProduct.vue";
import TheLogin from "@/components/TheLogin.vue";

import TheRegister from "@/components/TheRegister.vue";
import PageMember from "@/components/PageMember.vue";
import ProductShow from "@/components/ProductShow.vue";
import CartShow from "../components/CartShow.vue";
import CartList from "../components/CartList.vue";
import ListMemberShow from "../components/ListMemberShow.vue";
import AddProduct from "../components/AddProduct.vue";

const routes = [
  {
    path: "/",
    name: "product",
    component: TheProduct,
  },

  {
    path: "/login",
    name: "Login",
    component: TheLogin,
  },
  {
    path: "/register",
    name: "Register",
    component: TheRegister,
  },
  {
    path: "/pagemember",
    name: "PageMember",
    component: PageMember,
  },
  {
    path: "/ProductShow/:pdId",
    name: "ProductShow",
    component: ProductShow,
  },
  {
    // กำหนดว่า route นี้รับ parameter ต้องระบุให้ตรงกันด้วย
    path: "/cartShow/:cartId",
    name: "CartShow",
    component: CartShow,
  },
  {
    path: "/cartList/",
    name: "CartList",
    component: CartList,
  },
  {
    path: "/admin/members",
    name: "AdminMembers",
    component: ListMemberShow,
  },
  {
    path: "/admin/products",
    name: "AdminProducts",
    component: TheProduct, // ใช้ TheProduct component ที่มีอยู่แล้ว
  },
  {
    path: "/admin/orders",
    name: "AdminOrders",
    component: CartList, // ใช้ CartList component ที่มีอยู่แล้ว
  },
  {
    path: "/admin/addproducts",
    name: "AddProduct",
    component: AddProduct,
  },

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
