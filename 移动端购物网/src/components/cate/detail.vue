<template>
  <div class="s-detail">
      <div class="ban"><img :src="detailData.brand_pic" alt="商品"></div>
      <div class="cont">
        <div class="namedesc">
          <p class="name">{{detailData.brand_name}}</p>
          <p class="desc">{{detailData.brand_desc}}</p>
        </div>
        <span class="price">￥{{detailData.brand_price}}</span>
          <div class="goods-counter">
            <a href="javascript:;" class="btn-sub" @click="changeNum(-1, detailData)"> - </a>
            <input type="text" class="goods-num" readonly="readonly" v-model="detailData.cart_num">
            <a href="javascript:;" class="btn-add" @click="changeNum(+1, detailData)"> + </a>
          </div>
        <div class="bot">
          <a class="add-cart" href="javascript:;" @click="addCart">加入购物车</a>
        </div>
      </div>
  </div>
</template>
<script>
  import Check from '../com/check'
  import '../../css/detail.scss'
  import axios from 'axios'
  export default {
    data () {
      return {
        detailData: {
          cart_num: 1,
          brand_id: '',
          brand_cate: '',
          brand_cateName: '',
          brand_status: '',
          brand_name: '',
          brand_price: '',
          brand_desc: '',
          brand_pic: ''
        },
      }
    },
    created () {
      this.$store.dispatch('changeHeaderTitle', '商品详情')
      this.getDataCart()
    },
    computed: {},
    methods: {
      showSideBar (){
        return this.$store.dispatch('changeSideBarState', true)
      },
      hideSideBar (){
        return this.$store.dispatch('changeSideBarState', false)
      },
      getDataCart () {
          axios.get('/goods/detail',{
            params:{
              brand_id: this.$route.params.id
            }
          }).then((res) => {
            let data = res.data
            if (data.code === 200) {
              //合并 cart_num
              console.log(this.detailData)
              this.detailData = Object.assign(this.detailData, data.data)
              console.log(this.detailData)
              console.log(data.data)
            } else {
              console.log(data.msg)
            }
          }).catch((err)=>{
            console.log(err)
          })
      },
      changeNum (change, detailData) {
        if (change === -1) {
          if (detailData.cart_num > 1) {
            detailData.cart_num = detailData.cart_num - 1
          }
        } else {
          detailData.cart_num = detailData.cart_num + 1
        }
      },
      addCart () {
        //判断是否登录
         this.check = new Check()
        if (this.check.locDbGet('dataLogin')) {
           this.detailData.name = this.check.locDbGet('dataLogin').name
           this.detailData.cart_isSelect = true
          axios.get('/goods/addToCart',{
            params: {
              ...this.detailData
            }
          }).then((res) =>{
             let data = res.data
            console.log(data)
            if (data.code === 200) {
               //加入购物车成功
              console.log(data.msg)
             /* alert('加入购物车成功!')*/
              this.$message.success('添加购物车成功!')
              this.$router.push({path: '/cart'})
            } else {
               console.log(data.msg)
            }
          }).catch((err)=>{
             console.log(err)
          })
        } else {
          // 弹窗未登录，去登录，router
          console.log('未登录！')
          this.$message.error('你还没有登录，请先登录')
          this.$router.push({path: '/center'})
          /*alert('你没有登录，请登录')*/

        }
      }
    }
  }
</script>
