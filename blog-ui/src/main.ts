import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import "./utils/permission";

import { store } from "./store";

// import TDesign from "tdesign-vue-next";
import "tdesign-vue-next/es/style/index.css";
import "tdesign-vue-next/dist/reset.css";
import "@/style/ry.scss";

const app = createApp(App);
app.use(router);
app.use(store);
// app.use(TDesign);

app.mount("#app");
