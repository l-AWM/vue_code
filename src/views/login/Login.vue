<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="login_avatar">
        <img src="../../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules='loginFormRules'>
        <!-- 用户名 -->
        <el-form-item prop='username'>
          <el-input v-model="loginForm.username" prefix-icon='iconfont icon-user'></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop='password'>
          <el-input v-model="loginForm.password" prefix-icon='iconfont icon-3702mima' type='password'></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="restLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
        //登录表单的数据绑定对象 form :model 绑定表单数据对象 v-model绑定到对象的属性中
        loginForm:{
            username:'',
            password:''
        },
        //表单验证 form绑定验证规则对象 item的prop属性传递验证规则
        loginFormRules:{
            //验证用户名
            username:[
                {required: true, message: '请输入登录名称', trigger: 'blur'},
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
            //验证密码
            password:[
                {required: true, message: '请输入登录密码', trigger: 'blur'},
                { min: 3, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
            ]
        }
    };
  },
  methods:{
      restLoginForm(){
          this.$refs.loginFormRef.resetFields();
      },
      login(){
          //登陆前 预先验证
          this.$refs.loginFormRef.validate(async valid => {
              if(!valid) return;
              //发起登陆请求
              // this.$http({
              //   url:'login',
              //   method:'post',
              //   data:this.loginForm
              // }).then(res => {
              //   console.log(res);
              // })
              let {data:res} = await this.$http.post('login', this.loginForm);

              console.log(res);
              if(res.meta.status != 200) return this.$message.error(res.meta.msg);
              this.$message.success(res.meta.msg);
              window.sessionStorage.setItem('token',res.data.token);
              this.$router.push('/home');
              //1. 登录成功后的token保存到客户端 sessionStorage
              // 1.1 项目中除了登录之外的其它API接口，必须在登录之后访问
              // 1.2 token只应在当前网站打开期间生效 所以保存在sessionStroage
              //2.通过编程式导航跳转到后台主页 路由地址是 /home
          })
      }
  }
};
</script>

<style lang='scss' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  position: relative;
  .login_box {
    box-sizing: border-box;
    width: 400px;
    height: 300px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .login_avatar {
      height: 130px;
      width: 130px;
      border: 8px solid #fff;
      border-radius: 50%;
      overflow: hidden;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        background: #eee;
        width: 100%;
        height: 100%;
        vertical-align: middle;
      }
    }
  }
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns{
    display: flex;
    justify-content: flex-end;
}
</style>