import Vue from 'vue'
import Index from './Index.vue'

// 载入自定义样式
require('@/css/index.css')
let vm = new Vue({
  el: '#app',
  template: '<Index/>',
  components: {
    Index
  }
})

Vue.use({
  vm
})
