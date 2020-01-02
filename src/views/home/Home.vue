<template>   
    <el-container class="home-container">
        <!-- 头部区域 -->
      <el-header class="home-header">
          <div class="home-logo">
              <span>后台管理系统</span>
          </div>
           <el-button type="danger" @click="loginout">退 出</el-button>
      </el-header>
      <!-- 主题区域 -->
      <el-container>
          <!-- 侧边栏 -->
        <el-aside :width="!collapse?'200px':'64px'" class="home-aside" :style="{transition: !collapse?'all 1s':'none'}" >
            <div class="toggle-btn" @click="toggleHandle">|||</div>
            <Menu :menuList='menuList' :toggle='collapse' :active='this.$route.path.substr(1)'></Menu>
        </el-aside>
        <!-- 主体 -->
        <el-main>Main
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import Menu from './Menu.vue'
export default {
  name: "home",
  created(){
    this.getMenuList();
  },
  components:{
      Menu
  },
  data() {
    return {
        menuList:[],
        collapse:false
    };
  },
  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList(){
       const {data: res} = await this.$http.get('menus');
       console.log(res)
       if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
       this.menuList = res.data;
    },
    //切换菜单的折叠
    toggleHandle(){
        this.collapse = !this.collapse;

    }
  }
};
</script>

<style lang='scss' scoped>
    .home-container{
        height: 100%;
    }
    .home-header{
        margin-bottom: 10px;
    }
    .home-aside{
        margin-right: 10px;
        .toggle-btn{
            background: #557b94;
            font-size: 14px;
            line-height: 24px;
            text-align: center;
            letter-spacing: 0.2em;
            cursor: pointer;
            user-select: none;
        }
    }
    .el-header{
        background: #557b94;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        .home-logo{
            color: white;
            font-size: 36px;
        }
    }
    .el-aside{
        background: #595586;
    }
    .el-main{
        background: #eeeeee;
    }
</style>