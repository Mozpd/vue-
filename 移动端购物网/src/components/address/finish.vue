<template>
  <div>
    <el-steps :active="3" align-center>
      <el-step title="步骤1" description="填写地址!"></el-step>
      <el-step title="步骤2" description="确认订单!"></el-step>
      <el-step title="步骤3" description="确认支付!"></el-step>
      <el-step title="步骤4" description="订单完成!"></el-step>
    </el-steps>
    <p class="conter"> 完成购物，感谢你的惠顾!!</p>
  </div>
</template>
<script>
  export default {
    created () {
     this.$store.dispatch('changeHeaderTitle' , '订单完成')
    }
  }
</script>
<style lang="scss" scop>
   .conter{
     margin: 2rem;
     color: red;
     font-size: 1rem;
     text-align: center;
   }
</style>
