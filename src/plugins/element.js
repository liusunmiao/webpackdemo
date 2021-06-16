// 用于引入vue的组件
import Vue from 'vue'
import {
    Button,
    Message
} from "element-ui"

Vue.use(Button)
// 挂载message组件
Vue.prototype.$message = Message
