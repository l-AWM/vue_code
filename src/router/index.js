import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

import routes from './routes.js';

const router = new VueRouter({
  routes
})

//路由导航守卫
router.beforeEach((to,from,next) => {
  //to 将要访问的路径 from 当前离开的路径 next 放行 强制跳转到的路径
  if(to.path === '/login') return next();
  //判断是否有 token token是否有效
  let token = window.sessionStorage.getItem('token');
  //没有token 或 token失效强制跳转到登录页
  if(!token) return next('/login');
  
  next();

})

export default router
