import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import App from '../App.vue'
import Index from '../components/page/index.vue'
import Cate from '../components/cate/cate.vue'
import Detail from '../components/cate/detail.vue'
import Cart from '../components/cart/cart.vue'
import Center from '../components/center/center.vue'
import Address from '../components/address/address.vue'
import Order from '../components/address/order.vue'
import Finish from '../components/address/finish.vue'
export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/index',
      component: App,
      children:[
        {path:'index',name:'index',component:Index},
        {path:'cate',name:'cate',component:Cate},
        {path: 'detail/:id', name: 'detail', component: Detail},
        {path:'cart',name:'cart', component:Cart},
        {path:'center',name:'center', component:Center},
        {path:'address',name:'address',component:Address},
        {path:'order',name:'order',component:Order},
        {path:'finish',name:'finish',component:Finish}
      ]
    }
  ],
  linkActiveClass: 'footer-act'
})
