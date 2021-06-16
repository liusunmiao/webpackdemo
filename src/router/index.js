import Vue from 'vue'
import VueRouter from "vue-router"
import Login from "../components/login/Login";
import Home from "../components/home/Home";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        // 重定向
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        //配置 Home组件的子组件
        children: []
    }
]

const router = new VueRouter({
    routes
})
// 挂载路由导航卫士  拦截器
router.beforeEach(function (to, from, next) {
    // to将要访问的路径
    // from代表从哪个路径跳转而来
    // next是一个函数 表示放行 next() next('/login') 强制跳转
    // 登录直接放行
    if (to.path === '/login') {
        return next()
    }
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
        // 跳转到登录页面
        return next('/login')
    }
    next()
})
export default router
