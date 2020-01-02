<template>
  <div>
    <!-- 头部导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-button type="primary" disabled>添加角色</el-button>
      <!-- 表格区域 -->
      <el-table :data="rolesList" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <!-- <pre>
              {{props.row}}
            </pre>-->
            <el-row
              v-for="(item1,i1) in props.row.children"
              :key="item1.id"
              :class="['bdbootom',i1===0?'bdtop':'','center']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(props.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级三级权限 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row v-for="(item2,i2) in item1.children" :key="i1+'_'+item2.id"
                  :class="[i2===0?'':'bdtop','center']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(props.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="i1+i2+item3.id"
                      closable
                      @close="removeRightById(props.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{props.row}}
            </pre>-->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)"
              disabled
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="showDeleteDialog(scope.row)"
              disabled
            >删除</el-button>
            <!-- 分配角色按钮 -->
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="showSetRightDialog(scope.row)"
              >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分配权限" :visible.sync="setRightVisible" width="50%" @close='setDefault'>
      <el-tree ref='TreeRef' :data='rightList' :props='treeProps' show-checkbox  default-expand-all
      :default-checked-keys='defaultKeys'
      node-key='id'
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    //获取角色列表
    this.getRoleList();
  },
  data() {
    return {
    rolesList: [],
     setRightVisible: false,
     rightList:[],
     treeProps:{
        children: 'children',
        label: 'authName'
     },
     //默认勾选数组
     defaultKeys:[],
     //即将分配角色的id
     roleId:''
    };
  },
  methods: {
    async getRoleList() {
      const {data: res} = await this.$http.get('roles');
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      console.log(res)
      this.rolesList = res.data;
    },
    //删除权限
    async removeRightById(role,rightId){
     //弹框删除
     const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if(confirmRes !== 'confirm') {
        return this.$message.info('取消了删除');
      }
      //发起请求
      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      console.log('确认了删除');
      //刷新数据列表
      role.children = res.data;
      //this.getRoleList();
    },
    //展开分配权限的面板
    async showSetRightDialog(role){
      this.roleId = role.id;
      //console.log(role)
      //获取所有的全选数据
      const {data: res} = await this.$http.get('rights/tree');
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rightList = res.data;
      //获取当前 选中的权限
     
      this.getLeafKeys(role,this.defaultKeys)
      console.log(this.defaultKeys)
      //树形控件
      this.setRightVisible = true;
    },
    //获取所有权限的id
    getLeafKeys(data,arr=[]){
     if(data.children){
       data.children.forEach(el => {
         this.getLeafKeys(el,arr)
       });
     }else{
       return arr.push(data.id);
     }
    },
    //清空已选数组
    setDefault(){
       this.defaultKeys = [];
    },
    //权限分配确认
    async allotRight(){
      //获取所有选中的keys
      let keys = [
        ...this.$refs.TreeRef.getCheckedKeys(),
      ...this.$refs.TreeRef.getHalfCheckedKeys()
      ]
     console.log(keys);
     let keysStr = keys.join(',');
     const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`,{
       rids:keysStr
     });
     if(res.meta.status !== 200) return this.$message.success(res.meta.msg);
     console.log(res.data)
     //提示更新成功
     this.$message.error(res.meta.msg);
     //更新 列表数据
     this.getRoleList();
     //关闭dialog
     this.setRightVisible = false;
    }
  }
};
</script>

<style lang='scss' scoped>
.el-btn {
  margin-bottom: 8px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbootom {
  border-bottom: 1px solid #eee;
}
.center {
  display: flex;
  align-items: center;
}
</style>