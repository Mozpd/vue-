<!--<template>
   <div class="s-center">
     <div class="ban">
       <p class="uname" v-if="showState ==='logined'"> <span>用户:{{dataLogin.name}}</span> </p>
        <p class="uname" v-else-if="showState ==='register'"> <span>注册</span> </p>
       <p class="uname" v-else-if="showState ==='logining'"> <span>登录</span> </p>
     </div>
      <div class="form-item">
        <p class="form-tips">{{tips}}</p>
      </div>
     <div class="cont-center" v-if="showState ==='logined'">
        <div class="item">
          <a href="javascript:;" @click="toCart">我的购物车 <i>></i> </a>
          <a href="javascript:;">个人设置 <i> ></i> </a>
        </div>
       <div class="btn-div"><a href="javascript:;" class="btn-a" @click="clickLogout">退出登录</a> </div>
     </div>
     <div class="cont-register" v-else-if="showState ==='register'">
         <el-form :model="dataLogin" status-icon :rules="passRules" ref="dataLogin" label-width="60px" >
           <el-form-item label="手机号" prop="name">
             <el-input type="tel" v-model="dataLogin.name" auto-complete="off"></el-input>
           </el-form-item>
           <el-form-item label="密码" prop="pass">
             <el-input type="password" v-model="dataLogin.pass" auto-complete="off"></el-input>
           </el-form-item>
           <el-form-item label="确认密码" prop="checkPass">
             <el-input type="password" v-model="dataLogin.checkPass" auto-complete="off"></el-input>
           </el-form-item>
           <el-form-item>
             <el-button type="primary" @click="clickRegister('dataLogin')">提交</el-button>
             <el-button @click="resetForm('dataLogin')">重置</el-button>
           </el-form-item>
         </el-form>
       <fieldset class="">
         <legend>或</legend>
         <a href="javascript:;" class="" @click="toLogin">已有账号？快速登录</a>
       </fieldset>
     </div>
     <div class="cont-login" v-else-if="showState ==='logining'">
         <el-form :model="dataLogin" status-icon :rules="passRules" ref="dataLogin" label-width="60px" >
           <el-form-item label="手机号" prop="name">
             <el-input type="tel" v-model="dataLogin.name" auto-complete="off"></el-input>
           </el-form-item>
           <el-form-item label="密码" prop="pass">
             <el-input type="password" v-model="dataLogin.pass" auto-complete="off"></el-input>
           </el-form-item>
           <el-form-item>
             <el-button type="primary" @click=" clickLogin('dataLogin')">登录</el-button>
             <el-button @click="resetForm('dataLogin')">重置</el-button>
           </el-form-item>
         </el-form>
       <fieldset class="form-fieldset">
         <legend>或</legend>
         <a href="javascript:;" class="" @click="toRegister">未有账号？免费注册</a>
       </fieldset>
     </div>
   </div>
</template>
<script>
   import '../../css/center.scss'
   import Jam from '../com/jam'
    import axios from 'axios'
   import Vue from 'vue'
   import VueRouter from 'vue-router'
   const router = new VueRouter()
   Vue.use(VueRouter)
   import 'element-ui/lib/theme-chalk/index.css'
   import ElementUI from 'element-ui'
   Vue.use(ElementUI)
   export default {
     data () {
       var validatePass = (rule, value, callback) => {
         if (value === '') {
           callback(new Error('请输入密码'));
         } else {
           if (this.dataLogin.checkPass !== '') {
             this.$refs.dataLogin.validateField('checkPass');
           }
           callback();
         }
       };
       var validatePass2 = (rule, value, callback) => {
         if (value === '') {
           callback(new Error('请再次输入密码'));
         } else if (value !== this.dataLogin.pass) {
           callback(new Error('两次输入密码不一致!'));
         } else {
           callback();
         }
       };
        return {
          tips:'',
          showState: 'logined',
          dataLogin: {
            name: '',
            pass: '',
            checkPass: ''
          },
          passRules:{
            pass: [
              { validator: validatePass, trigger: 'blur' }
            ],
            checkPass: [
              { validator: validatePass2, trigger: 'blur' }
            ],
          }
        }
     },
     created () {
       this.$store.dispatch('changeHeaderTitle', '我的')
       this.jam = new Jam()
       let lDataLogin = this.jam.locDbGet('dataLogin')
        if (lDataLogin === undefined || lDataLogin ===null){
          this.showState = 'logining'
        }else {
          this.dataLogin = this.jam.locDbGet('dataLogin')
          this.showState = 'logined'//显示当前用户名
        }
     },
     methods: {
       showSideBar () {
         return this.$store.dispatch('changeSideBarState', true)
       },
       hideSideBar () {
         return this.$store.dispatch('changeSideBarState', false)
       },
       toCart () {
         router.push({ path: '/cart' })
       },
       clickLogin () {
          //验证一下
         if (this.jam.isPhone(this.dataLogin.name)){
           if (this.jam.isPass(this.dataLogin.pass)){
             axios.get('/users/login',{
               params:{name: this.dataLogin.name,
                       pwd: this.dataLogin.pass}
             }).then((res)=>{
               let data = res.data
               console.log(data)
               if (data.code === 200) {
                 this.jam.locDbGet('dataLogin',{name:this.dataLogin.name, pass:this.dataLogin.pass})
                 this.showState = 'logined'
                 this.tips = 'hello!'
               }else {
                 console.log(data.msg)
                 this.tips = data.msg
               }
             }).catch((err)=>{
               console.log(err)
             })
           }else {
             this.tips = '请输入由字母数字组成的6位密码!'
           }
         }else {
           this.tips = '请输入正确的手机号!'
         }
       },
       clickRegister(formName) {
         /*this.$refs[formName].validate((valid) => {
           if (valid) {
             alert('submit')
           }else {
             console.log('error submit!!')
             return false
           }
         })*/
         console.log(this.dataLogin)
         if (this.jam.isPhone(this.dataLogin.name)){
           if (this.jam.isPass(this.dataLogin.pass)){
             axios.get('/users/register',{
               params:{name:this.dataLogin.name,
                       pwd:this.dataLogin.pass}
             }).then((res)=>{
                let data = res.data
                console.log(data)
               if (data.code === 200) {
                  //登陆成功
                 this.jam.locDbGet('dataLogin',{name:this.dataLogin.name,pass:this.dataLogin.pass})
                 this.showState = 'logined'
                 this.tips = 'hello!'
               }
             }).catch((err)=>{
               console.log(err)
             })
           } else {
             this.tips = '请输入由字母数字组成的六位密码'
           }
         }else {
            this.tips = '请输入正确的手机号!'
         }
       },
       resetForm(formName) {
         this.$refs[formName].resetFields();
       },
       clickLogout () {
         localStorage.removeItem('dataLogin')
         this.showState = 'logining'
         this.dataLogin.name = ''
         this.dataLogin.pass = ''
       },
       toRegister () {
         this.showState = 'register'
         this.tips = ''
       },
       toLogin () {
         this.showState = 'logining'
         this.tips = ''
       }
     }
   }
</script>-->

<template>
  <div class="s-center">
    <div class="ban">
      <!-- <p class="uname">用户名</p> -->
      <p class="uname" v-if="showState === 'logined'"><span>用户：{{dataLogin.name}}</span></p>
      <p class="uname" v-else-if="showState === 'register'"><span>注册</span></p>
      <p class="uname" v-else-if="showState === 'logining'"><span>登录</span></p>
    </div>
    <div class="form-item">
      <p class="form-tips">{{tips}}</p>
    </div>
    <div class="cont-center" v-if="showState === 'logined'">
      <div class="item">
        <a href="javascript:;" @click="toCart">我的购物车<i>></i></a>
       <!-- <a href="javascript:;">个人设置<i>></i></a>-->
      </div>
      <div class="btn-div"><a href="javascript:;" class="btn-a" @click="clickLogout">退出登录</a></div>
    </div>

    <div class="cont-register" v-else-if="showState === 'register'">
      <div class="form-item">
        <label for="mobile">手机号</label>
        <input name="mobile" type="tel" placeholder="请输入手机号" maxlength="11" v-model="dataLogin.name">
      </div>
      <div class="form-item">
        <label for="password">密&nbsp;&nbsp;&nbsp;码</label>
        <input name="password" type="tel" placeholder="请输入密码" maxlength="6" v-model="dataLogin.pass">
      </div>
      <div class="form-item">
        <label for="code" >验证码</label>
        <input class="" name="code" type="tel" placeholder="请再次输入密码" maxlength="6" v-model="dataLogin.code">
      </div>

      <div class="btn-div"><a href="javascript:;" class="btn-a" @click="clickRegister">注册按钮</a></div>
      <fieldset class="">
        <legend>或</legend>
        <a href="javascript:;" class="" @click="toLogin">已有账号？快速登录</a>
      </fieldset>
    </div>

    <div class="cont-login" v-else-if="showState === 'logining'">
      <div class="form-item">
        <label for="username">账号</label>
        <input name="username" type="tel" placeholder="请输入手机号" maxlength="11" v-model="dataLogin.name">
      </div>
      <div class="form-item">
        <label for="password">密码</label>
        <input name="password" type="tel" placeholder="请输入密码" maxlength="6" v-model="dataLogin.pass">
      </div>
      <div class="btn-div"><a href="javascript:;" class="btn-a" @click="clickLogin">登录按钮</a></div>
      <fieldset class="form-fieldset">
        <legend>或</legend>
        <a href="javascript:;" class="" @click="toRegister">未有账号？免费注册</a>
      </fieldset>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Check from '../com/check'
  import '../../css/center.scss'
  // 进入页面判断是否已经登录,显示对应页面：登录，未登录
  // 点击注册
  // 控制显示隐藏
  export default {
    data () {
      return {
        tips: '',
        showState: 'logined',
        dataLogin: {
          name: '',
          pass: '',
          code: ''
        },
      }
    },
    created () {
      this.$store.dispatch('changeHeaderTitle', '我的')
      this.check = new Check()
      let lDataLogin = this.check.locDbGet('dataLogin')
      if (lDataLogin === undefined || lDataLogin === null) {
        this.showState = 'logining'
      } else {
        this.dataLogin = this.check.locDbGet('dataLogin')
        this.showState = 'logined'
        // 显示用户名
      }
    },
    methods: {
      showSideBar () {
        return this.$store.dispatch('changeSideBarState', true)
      },
      hideSideBar () {
        return this.$store.dispatch('changeSideBarState', false)
      },
      toCart () {
       this. $router.push({ path: '/cart' })
      },
      clickLogin () {
        // 验证
        if (this.check.isPhone(this.dataLogin.name)) {
          if (this.check.isPass(this.dataLogin.pass)) {
            this.$http({
              url: '/users/login',
              method: 'GET',
              params: {
                name: this.dataLogin.name,
                pwd: this.dataLogin.pass
              }
            })
              .then((res) => {
                let data = res.data
                console.log(data)
                if (data.code === 200) {
                  // 登录成功
                  this.check.locDbSet('dataLogin', {name: this.dataLogin.name, pass: this.dataLogin.pass})
                  this.showState = 'logined'
                  this.tips = ''
                } else {
                  console.log(data.msg)
                  this.tips = data.msg
                }
              }).catch((err)=>{
               console.log(err)
            })
          } else {
            this.tips = '请输入由字母数字组成的6位密码！'
          }
        } else {
          this.tips = '请输入正确的手机号！'
        }
      },
      clickRegister () {
        // 验证
        console.log(this.dataLogin)
        if (this.check.isPhone(this.dataLogin.name)) {
          if (this.check.isPass(this.dataLogin.pass) && this.check.isPass(this.dataLogin.code) && this.dataLogin.pass=== this.dataLogin.code) {
            // 注册登录成功
            this.$http({
              url: '/users/register',
              method: 'GET',
              params: {
                name: this.dataLogin.name,
                pwd: this.dataLogin.pass
              }
            })
              .then((res) => {
                let data = res.data
                console.log(data)
                if (data.code === 200) {
                  // 登录成功
                  this.check.locDbSet('dataLogin', {name: this.dataLogin.name, pass: this.dataLogin.pass})
                  this.showState = 'logined'
                  this.tips = ''
                } else {
                  console.log(data.msg)
                  this.tips = data.msg
                }
              }).catch((err)=>{
              console.log(err)
            })
          } else {
            this.tips = '请输入由字母数字组成的6位验证码密码！'
          }
        } else {
          this.tips = '请输入正确的手机号！'
        }
      },
      clickLogout () {
        localStorage.removeItem('dataLogin')
        this.showState = 'logining'
        this.dataLogin.name = ''
        this.dataLogin.pass = ''
      },
      toRegister () {
        this.showState = 'register'
        this.tips = ''
      },
      toLogin () {
        this.showState = 'logining'
        this.tips = ''
      }
    }
  }
</script>

