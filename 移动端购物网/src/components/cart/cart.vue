<template>
  <div class="s-cart">
    <div class="cart-cont">
      <ul>
        <li class="cont-one" v-for="(cart, index) in carts">
          <input type="checkbox" class="goods-checkbox" v-model="cart.cart_isSelect" @click="clickSelect(cart)">
          <a class="goods-a" href="javascript:;">
            <img class="goods-img" :src="cart.brand_pic" />
          </a>
          <div class="goods-info">
            <h5 class="goods-name">{{cart.brand_name}}</h5>
            <div class="goods-counter">
              <a href="javascript:;" class="btn-sub" @click="changeNum(-1,cart)"> - </a>
              <input type="text" class="goods-num" readonly="readonly" v-model.lazy="cart.cart_num">
              <a href="javascript:;" class="btn-add" @click="changeNum(1,cart)"> + </a>
            </div>
          </div>
          <span class="goods-price">￥{{cart.cart_num*cart.brand_price}}</span>
          <a href= "javascript:;" class="goods-delete" @click="deleteCart(index, carts, cart.brand_id)">删除</a>
        </li>
        <p v-if="this.carts.length === 0" class="kong">购物车为空!!</p>
      </ul>
    </div>
    <div class="cart-counter">
       <div class="all-checkbox">
         <input type="checkbox"name="all-goods" class="all-goods" v-model="isAllSelectState" @click="clickAllSelect">
         <label for="all-goods">全选</label>
       </div>
      <div class="all-price">
        <p class="price-p">总计: <em class="price">￥{{totalNowPrice}}</em></p>
      </div>
      <a href="javascript:;" class="btn-counter" @click="toAddress">去结算吧</a>
      <!--<router-link to="/address" class="btn-counter">去结算吧</router-link>-->
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import '../../css/cart.scss'
  import Check from '../com/check'
  import LocalDb from '../com/localDB'
  export default {
    data () {
      return {
        dataCart: {},
        carts: {},
        isAllSelectState: false,
        name: '',
      }
    },
    created () {
      this.$store.dispatch('changeHeaderTitle', '购物车')
      this.check = new Check()
      if(this.check.locDbGet('dataLogin')) {
        this.name = this.check.locDbGet('dataLogin').name
        this.getDataCart()
      } else {
        alert('未登录，请前往登录!')
        this.$router.push({path: '/center'})
      }
    },
    computed: {
      totalNowPrice () {
        let price = 0
        Array.from(this.carts).forEach(cart =>{
          if (cart.cart_isSelect) {
            price += cart.brand_price * cart.cart_num
          }
        })
        return price
      }
    },
    methods: {
      showSideBar () {
        return this.$store.dispatch('changeSideBarState', true)
      },
      hideSideBar () {
        return this.$store.dispatch('changeSideBarState', false)
      },
      getDataCart () {
        axios.get('goods/carts',{
          params: {name: this.name}
        }).then((res)=> {
          let data = res.data
          console.log(data)
          if (data.code ===200) {
            console.log(data.msg)
            this.dataCart = data
            this.carts = data.data
          } else {
            console.log(data.msg)
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      changeNum (change, cart) {
        if (change === -1) {
          if (cart.cart_num >1) {
            cart.cart_num = cart.cart_num - 1
          }
        }else {
          cart.cart_num = cart.cart_num + 1
        }
      },
      clickSelect (cart) {
        cart.cart_isSelect = !cart.cart_isSelect
        let isAllSelectState = Array.from(this.carts).every(cart => {
          return cart.cart_isSelect
        })
        this.isAllSelectState = isAllSelectState
      },
      clickAllSelect () {
        this.isAllSelectState = !this.isAllSelectState
        Array.from(this.carts).forEach(cart =>{
          cart.cart_isSelect = this.isAllSelectState
        })
      },
      deleteCart (index,carts,brandId) {
        axios.get('/goods/delectCart',{
          params:{brand_id: brandId, name:this.name}
        }).then((res)=>{
          let data = res.data
          console.log(data)
          if (data.code === 200) {
            console.log(data.msg)
            carts.splice(index,1)
            let localDB = new LocalDb('dataCart')
            this.dataCart.data.carts = this.carts
            localDB.set(this.dataCart)
          }else {
            console.log(data.msg)
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      toAddress (){
        if(this.carts.length >0){
          this.$router.push({path: '/address'})
        }
      }
    }
  }
</script>

