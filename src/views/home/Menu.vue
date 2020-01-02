<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    unique-opened
    :collapse='toggle'
    :collapse-transition='false'
    router
    :defaultActive="active"
  >
    <el-submenu :index="item.path" v-for="(item,i) in menuList" :key="i">
      <template slot="title">
        <i :class="'iconfont '+icons[i]"></i>
        <span>{{item.authName}}</span>
      </template>

      <el-menu-item :index="li.path" v-for="li in item.children" :key="li.id">
        <i class="el-icon-menu"></i>
        <span slot="title">{{li.authName}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    menuList: {
      type: Array,
      default: () => []
    },
    icons: {
      type: Array,
      default: () => [
        "icon-user",
        "icon-tijikongjian",
        "icon-shangpin",
        "icon-danju",
        "icon-baobiao"
      ]
    },
    toggle:{
        type:Boolean,
        default:true
    },
    active:{
        type:String,
        default:''
    }
  }
};
</script>

<style lang='scss' scoped>
.iconfont {
  margin-right: 15px;
}
.el-menu {
  border-right: none;
}
</style>