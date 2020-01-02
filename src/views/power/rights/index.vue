<template>
  <div>
    权限列表
    <!-- 头部导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 列表 -->
      <el-table :data="rightsList" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope"> 
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-if="scope.row.level == 1" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    //获取权限列表数据
    this.getRightsList();
  },
  data() {
    return {
      rightsList: []
    };
  },
  methods: {
    //获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status !== 200) this.$message.error(res.meta.msg);
      this.rightsList = res.data;
    }
  }
};
</script>

<style>
</style>