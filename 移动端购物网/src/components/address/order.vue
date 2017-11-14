<template>
  <div>
    <el-steps :active="1" align-center>
      <el-step title="步骤1" description="填写地址!"></el-step>
      <el-step title="步骤2" description="确认订单!"></el-step>
      <el-step title="步骤3" description="确认支付!"></el-step>
      <el-step title="步骤4" description="订单完成!"></el-step>
    </el-steps>
    <p class="order-username"><span>用户:</span>{{name}}</p>
    <div><span class="order-brand">商品</span> <span class="order-price">价格</span></div>
    <div class="cart-cont tiao">
      <ul>
        <li class="cont-one" v-for="(cart, index) in carts">
          <a class="goods-a" href="javascript:;">
            <img class="goods-img" :src="cart.brand_pic" />
          </a>
          <div class="goods-info">
            <h5 class="goods-name">{{cart.brand_name}}</h5>
          </div>
          <span class="goods-price">￥{{cart.cart_num*cart.brand_price}}</span>
        </li>
        <!--<p v-if="this.carts.length === 0" class="kong">购物车为空!!</p>-->
        <p class="totalPrice-order">总计: <em class="price">￥{{totalNowPrice}}</em></p>
      </ul>
    </div>
    <el-button type="primary" plain class="btn-next" @click="nextStep()">下一步</el-button>
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
        carts:'',
        dataCart:'',
        name:''
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
    created () {
      this.$store.dispatch("changeHeaderTitle", "订单详情"),
        this.check = new Check(),
       this.name = this.check.locDbGet('dataLogin').name,
        this.getDataCart();
    },
    methods:{
      nextStep () {
        this.$router.push({path:'/finish'})
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
    }
  }
</script>
<style lang="scss" scop>
  .tiao{
    margin-left: 1rem;
  }
  .btn-next {
    float: right;
    margin: 2rem 1rem;
  }
  .order-username {
    text-align: center;
    font-size: 0.5rem;
    margin: 1rem;
    color: red;
    span{
      color:black;
      font-weight: bold;
    }
  }
  .order-brand{
    margin: 4rem;
  }
  .order-price{
    margin-left: 2rem;
  }
  .totalPrice-order{
    text-align: center;
    margin: 1rem;
    font-size: 0.5rem;
    font-weight: bold;
    .price{
      color: red;
    }
  }
</style>
