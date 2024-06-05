import MainLayout from "layouts/MainLayout.vue";
import Home from "pages/Home.vue";
import UserList from "pages/UserList.vue";
import ProductList from "pages/ProductList.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", component: Home },
      { path: "users", component: UserList },
      { path: "products", component: ProductList },
    ],
  },
];

export default routes;
