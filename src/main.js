// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VuelazyLoad from 'vue-lazyload'

import axios from 'axios' // 1、在这里引入axios

Vue.prototype.$axios = axios;   // 2、在vue中使用axios

Vue.config.productionTip = false

import "./common/scss/mixin.scss";
fastclick.attach(document.body)

//使用vue-lazyload
Vue.use(VuelazyLoad,{
  loading:require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  router,
  store
})
