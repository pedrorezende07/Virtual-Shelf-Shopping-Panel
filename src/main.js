import { createApp } from "vue";
import { Quasar } from "quasar";
import "quasar/dist/quasar.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(Quasar, {
  plugins: {}, // Import Quasar plugins and add here
});

app.use(router);

app.mount("#app");
