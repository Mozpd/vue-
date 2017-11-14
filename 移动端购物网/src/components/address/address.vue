<template>
  <div class="s-address">
    <el-container>
      <el-header>
        <el-steps :active="0" align-center>
          <el-step title="步骤1" description="填写地址!"></el-step>
          <el-step title="步骤2" description="确认订单!"></el-step>
          <el-step title="步骤3" description="确认支付!"></el-step>
          <el-step title="步骤4" description="订单完成!"></el-step>
        </el-steps>
      </el-header>
      <el-main style="margin-top: 30px">
        <el-row>
          <el-col>
            <div style="text-align: center">
              <el-button  type="primary" icon="el-icon-plus"  @click="addDialog = true">
                添加收货地址
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col >
            <el-table style="width: 100%" :data="addressList">
              <el-table-column prop="username" label="用户" >
              </el-table-column>
              <el-table-column prop="name" label="姓名" >
              </el-table-column>
              <el-table-column prop="phone" label="电话" >
              </el-table-column>
              <el-table-column prop="address" label="地址" >
              </el-table-column>
              <el-table-column label="操作" >
                <template slot-scope="scope">
                  <el-button type="success" size="mini"  @click="setUser(scope.row)">编辑</el-button>
                  <el-button type="danger" size="mini" style="margin-left: -0.1px"  @click='deleteUser(scope.row)'>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-button type="primary" plain class="btn-next" @click="nextStep()">下一步</el-button>
      </el-main>
    </el-container>

    <el-dialog title="添加收货信息" :visible.sync="addDialog" >
      <el-form :model="addForm" :rules="addRules" ref="addForm" >
        <el-form-item label="用户" >
          <el-input  type="text" v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input type="text" v-model="addForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input type="text" v-model="addForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设置默认">
          <el-switch v-model="addForm.is_default"></el-switch>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button size="small" type="primary" @click="submitForm('addForm')">提交</el-button>
          <el-button  size="small" @click="resetForm('addForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="editDialog" @close="resetForm('editForm')">
      <el-form :model="editForm" :rules="addRules" ref="editForm" >
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input type="text" v-model.number="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="editForm.is_default"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateUser()">修改</el-button>
          <el-button @click="resetForm('editForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import axios from "axios"
  export default {
    data (){
        return {
          addForm:{
            username: '',
            name: '',
            phone:'',
            address:'',
            is_default:false
          },
          editForm:{
            _id:'',
            name: '',
            phone:'',
            address:'',
            is_default:null
          },
          addDialog:false,
          editDialog:false,
          addressList:[],

          addRules:{
              name:[
                {required:true,message:'请输入姓名',trigger:'blur'},
                {min:3,max:10,message:'请输入合法的姓名',trigger:'blur'}
              ],
            phone:[
              { required:true,message: '请输入手机号', trigger: 'blur' },
              { pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
            ],
            address:[
              {required:true,message:'请输入收货地址',trigger:'blur'}
            ]
          }
        }

    },
    created () {
      this.$store.dispatch("changeHeaderTitle", "地址"),
        this.getAddress()
    },
    monted:function () {
      this.getAddress()
    },
    computed:{},
    methods:{
      showSideBar(){
        return this.$store.dispatch("changeSideBarState" , true)
      },
      hideSideBar() {
        return this.$store.dispatch("changeSideBarState" , false)
      },
      //表单提交
      submitForm:function (formName) {
        this.$refs[formName].validate((valid)=>{
          if (valid){
            //提交
            axios.post('/users/create',this.addForm).then((response=>{
              let res = response.data;
              console.log(res)
              if (res.status == '0'){
                //显示成功消息
                this.$message.success('添加收货信息成功');
                this.resetForm('addForm');
                this.getAddress();
              }else {
                this.$message.error("添加失败")
              }
            })).catch(err=>{
              console.log(err)
            })
          }else {
            return false
          }
        })
      },
      resetForm:function (formName) {
        if (formName == 'addForm'){
          this.addDialog = false
        }
        this.$refs[formName].resetFields()
      },
      getAddress:function () {
        axios.get('/users/getAddress').then(response=>{
          let res = response.data;
          this.addressList = res.addressList
        }).catch(err=>{
          console.log(err)
        })
      },
      setUser:function (row) {
        //编辑的弹出框
        this.editDialog = true;
        //可以使用row里面的数据 ，将整行的用户输出
        this.editForm._id=row._id;
        this.editForm.name=row.name;
        this.editForm.phone=row.phone;
        this.editForm.is_default=row.is_default;
      },
      updateUser:function () {
        axios.post('/users/updateUser',this.editForm)
          .then(response=>{
            let res = response.data;
            console.log(res)
            if(res.status == '0'){
              this.$message.success('编辑用户成功');
              this.resetForm('editForm');
              this.getAddress();
            }else{
              //返回了错误的提示消息的时候
              this.$message.error('修改失败');
            }
          }).catch(err=>{
          console.log(err);
        })
      },
      deleteUser:function (row) {
        this.$confirm('此操作将永久删除用户'+ row.username +', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center:true
        }).then(() => {
          axios.post('/users/remove',row).then(data=>{
            this.$message.success('删除成功!')
            this.getAddress();
          })
        }).catch(() => {
          this.$message.info
          ('已取消删除');
        });
      },
      nextStep (){
        this.$router.push({path: '/order'})
      }
    },

  }
</script>
<style lang="scss" scope>
   .btn-next {
    float: right;
     margin: 1rem 1rem;
   }
</style>

