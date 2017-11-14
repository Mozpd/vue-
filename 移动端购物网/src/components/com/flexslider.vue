
<template>
   <div class="block">
       <el-carousel height="8rem" >
         <el-carousel-item v-for='(image,index) in img' :key='index' v-show='index===mark' >
            <img :src="image">
         </el-carousel-item>
       </el-carousel>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        mark:0,
        img: [
              "../../../static/img/1.jpg",
              "../../../static/img/2.jpg",
               "../../../static/img/3.jpg",
               "../../../static/img/4.jpg",
        ]
      }
    }
  }
  </script>
<style>
  .block{
    margin-top: -2.2rem;
  }
  .block img{
    width: 100%;
    height: 8rem;
    max-width: 100%;
    display: block;
  }

</style>
