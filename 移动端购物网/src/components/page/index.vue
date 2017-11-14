<template>
  <div class="s-index">
    <comFlexSlider></comFlexSlider>
    <div class="cont">
      <div class="cont-head">
        <p class="gold"><span class="before"></span><span class="head-title">特卖</span><p/>
        <router-link to="/cate" class="head-right gold">更多 ></router-link>
      </div>
      <div class="cont-main cont-temai">
        <router-link class="cont-one" href="javascript:;" v-for="brand in temai" :to="'detail/'+brand.brand_id" :key="brand.id">
          <span class="name">{{brand.brand_name}}</span>
          <span class="price">￥{{brand.brand_price}}</span>
          <img class="pic" v-lazy="brand.brand_pic"/>
        </router-link>
      </div>
    </div>
    <div class="cont">
      <div class="cont-head">
        <p><span class="before"></span><span class="head-title">热销</span></p>
        <!-- <a class="head-right" >更多></a> -->
        <router-link to="/cate" class="head-right">更多 ></router-link>
      </div>
      <div class="cont-main cont-rexiao">
        <router-link :to="'detail/'+brand.brand_id" class="cont-left" href="javascript:;"
        v-for="(brand, key, index) in rexiao"
        v-if="key==0" :key="brand.id">
          <span class="name">{{brand.brand_name}}</span>
          <img  class="pic" v-lazy="brand.brand_pic" />
          <span class="decs red">{{brand.brand_desc}}</span>
        </router-link>
        <div class="cont-right">
          <router-link :to="'detail/'+brand.brand_id" class="cont-right-one" href="javascript:;"
          v-for="(brand,key,index) in rexiao"
          v-if="key>=1"
          :key="brand.id">
            <p class="text">
              <span class="name">{{brand.brand_name}}</span>
              <span class="desc">{{brand.brand_desc}}</span>
            </p>
            <img class="pic" v-lazy="brand.brand_pic"/>
          </router-link>
        </div>
      </div>
    </div>
    <div class="cont">
      <div class="cont-head">
        <p><span class="before"></span><span class="head-title">精品</span></p>
        <router-link to="/cate" class="head-right">更多 ></router-link>
      </div>
      <div class="cont-main cont-jingpin">
        <ul>
          <li v-for="brand in jingpin">
            <router-link :to="'detail/'+brand.brand_id" class="cont-li" href="javascript:;">
              <img class="pic" v-lazy="brand.brand_pic"/>
              <span class="name">{{brand.brand_name}}</span>
              <span class="price">￥{{brand.brand_price}}</span>
            </router-link>
          </li>
          <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="default">
            <span slot="no-more">
              没有更多内容了
            </span>
          </infinite-loading>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import comFlexSlider from '../com/flexslider'
  import InfiniteLoading from 'vue-infinite-loading'
  import '../../css/index.scss'
  import axios from 'axios'
  export default {
    data(){
      return{
        temai: [],
        rexiao: [],
        jingpin: []
      }
    },
    components:{
      comFlexSlider:comFlexSlider,
      InfiniteLoading:InfiniteLoading
    },
    created(){
      this.$store.dispatch('changeHeaderTitle','首页')
      this.getDataIndex()
    },
    methods:{
      showSideBar () {
        return this.$store.dispatch('changeSideBarState', true)
      },
      hideSideBar () {
        return this.$store.dispatch('changeSideBarState', false)
      },
      getDataIndex () {
          axios.get('/goods/index').then((res)=> {
             let data = res.data
            if (data.code === 200) {
              console.log(data.data)
              this.temai = data.data.temai
              this.rexiao =data.data.rexiao
              this.jingpin = data.data.jingpin
            }else {
               console.log(data.msg)
            }
          }).catch((err)=>{
            console.log(err)
          })
      },
      onInfinite () {
        axios.get('/goods/index/jingpin',{
          params:{
            nowLength: this.jingpin.length
          }
        }).then((res) => {
            let data = res.data
            let newJingpin = data.data
            console.log(data)
            if (data.code === 200) {
              // 处理数据
              this.jingpin = this.jingpin.concat(newJingpin)
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
              if (newJingpin.length === 0) {
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
              }
            } else {
              console.log(data.msg)
            }
          }).catch((err)=>{
          console.log(err)
        })
      }

    }
  }
</script>




