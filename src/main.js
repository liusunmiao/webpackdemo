import Vue from 'vue'
import App from '../App.vue'
import router from "./router";

Vue.config.productionTip = false
console.log('这是main.js文件')
new Vue({
    router,
    render: h => h(App)
}).$mount("#app")
