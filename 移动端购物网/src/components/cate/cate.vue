<template>
  <div class="s-cate">
     <div class="cate-nav">
       <div class="nav-out">
         <div class="nav">
         <a class="nav-a" href="javascript:;"
         v-for="(type, index) in types"
         :class="{'nav-a-act' : index==nowIndex}"
         @click="clickType(type.type_now, index)">
          {{type.type_name}}
         </a>
       </div>
       </div>
     </div>
    <div class="cate-cont">
      <ul>
        <li v-for="brand in allBrand" v-if="nowType==brand.brand_cate || nowType=='type_all'">
          <router-link :to="'detail/'+brand.brand_id" class="cont-li"href="javascript:;">
            <img class="pic" v-lazy="brand.brand_pic"/>
            <span class="name">{{brand.brand_name}}</span>
            <span class="price">{{brand.brand_price}}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
   import '../../css/cate.scss'
   import axios from 'axios'
  export default {
     data () {
        return {
          nowType: 'type_all',
          types: {},
          nowIndex: 0,
          allBrand: {}
        }
     },
    created () {
       this.$store.dispatch('changeHeaderTitle', '分类');
      this.getDataCate()
    },
    methods: {
       showSideBar () {
         return this.$store.dispatch('changeSideBarState', true)
       },
      hideSideBar () {
         return this.$store.dispatch('changeSideBarState', false)
      },
      getDataCate () {
          this.types = [
            {
              'type_name': '全部',
              'type_now' : 'type_all'
            },
            {
              'type_name': '男装',
              'type_now' : 'type_man'
            },
            {
              'type_name': '女装',
              'type_now' : 'type_girl'
            },
            {
              'type_name': '手机',
              'type_now' : 'type_phone'
            },
            {
              'type_name': '电脑',
              'type_now' : 'type_pc'
            },
          ]
          axios.get('/goods/cate').then((res)=>{
              console.log(res)
              let data = res.data
              console.log(data)
              if (data.code === 200) {
                this.allBrand = data.data
                console.log(data.data)
              } else {
                console.log(data.msg)
              }
          }).catch((err)=>{
            console.log(err)
          })
      },
      clickType (type, index){
         this.nowType = type
        this.nowIndex = index
      }
    }
  }
</script>


