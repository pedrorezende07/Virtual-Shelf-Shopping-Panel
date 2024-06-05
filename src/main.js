import { createApp } from "vue";
import { Quasar, Dialog, Notify } from "quasar"; // Importe os plugins necessários
import "quasar/dist/quasar.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(Quasar, {
  plugins: {
    Dialog, // Adicione o plugin Dialog
    Notify, // Adicione o plugin Notify
  },
});

app.use(router);

app.mount("#app");
