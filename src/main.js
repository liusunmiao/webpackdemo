import Vue from 'vue'
import App from '../App.vue'
import router from "./router"
import './plugins/element.js'
// 引入全局样式表
import './assets/css/global.css'
import axios from "axios"
//配置请求base路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//拦截 设置请求头
axios.interceptors.request.use(function (config) {
    //添加请求头信息  Authorization对应的header key
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
// 挂载到vue的原型对象上
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount("#app")
