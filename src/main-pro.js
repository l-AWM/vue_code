import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import './plugins/element.js'

//导入全局样式表
import './assets/css/base.css';
//导入字体图标
import './assets/fonts/iconfont.css';

import NProgress from 'nprogress';

import 'nprogress/nprogress.css';

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  NProgress.start();
  return config;
})
axios.interceptors.response.use(config => {

  NProgress.done();
  return config;
})
Vue.prototype.$http = axios;

Vue.filter('dateFormat', function (oValue) {
  const dt = new Date(oValue);
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');

  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')