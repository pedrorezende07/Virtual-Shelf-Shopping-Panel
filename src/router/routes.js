import MainLayout from "layouts/MainLayout.vue";
import Home from "pages/Home.vue";
import UserList from "pages/UserList.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", component: Home },
      { path: "users", component: UserList },
    ],
  },
];

export default routes;
