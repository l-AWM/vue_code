<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 开片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="handleClear">
            <el-button slot="append" icon="el-icon-search" @click="hadnleSearch"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table border stripe :data="userList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch @change="handleStateChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="showDeleteDialog(scope.row)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                size="small"
                icon="el-icon-setting"
                @click="showEditRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 对话框 添加用户 -->
    <el-dialog title="添加用户信息" :visible.sync="dialogFormVisible">
      <!-- 表单区域 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleAddUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框  修改用户-->
    <el-dialog title="修改用户" :visible.sync="editFormVisible">
      <!-- 表单区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户姓名">
          <el-input disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleEditCancel">取 消</el-button>
        <el-button type="primary" @click="handleEditUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 角色管理 对话框 -->
    <el-dialog title="角色管理" :visible.sync="rolesFormVisible" @close="handleRolesCancel">
      <div>
        <p>当前用户: {{editForm.username}}</p>
        <p>当前的角色: {{editForm.role_name}}</p>
        <p>
          分配角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <!-- 底部区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleRolesCancel">取 消</el-button>
        <el-button type="primary" @click="handleEditRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from "@/lib/deepClone.js";
export default {
  data() {
    //验证邮箱
    var checkEmail = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-])+/;
      if (reg.test(value)) return callback();
      callback(new Error("请输入正确的邮箱"));
    };
    var checkMobile = (rule, value, callback) => {
      let reg = /^1[^0][\d]{9}/;
      if (reg.test(value)) return callback();
      callback(new Error("请输入正确的手机号"));
    };
    return {
      //获取用户列表的参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      usersChanged: false,
      dialogFormVisible: false,
      editFormVisible: false,
      rolesFormVisible: false,
      rolesList: [], //所有角色列表
      selectedRoleId:'',//分配角色选择的值
      editForm: {},
      editFormRules: {
        email: [
          { validator: checkEmail, trigger: "blur" },
          { required: true, message: "请输入邮箱", trigger: "blur" }
        ],
        mobile: [
          { validator: checkMobile, trigger: "blur" },
          {
            required: true,
            message: "请输入 11位 手机号",
            trigger: "blur"
          }
        ]
      },
      addForm: {
        //新增用户数据
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addFormRules: {
        //表单验证规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { validator: checkEmail, trigger: "blur" },
          { required: true, message: "请输入邮箱", trigger: "blur" }
        ],
        mobile: [
          { validator: checkMobile, trigger: "blur" },
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          { min: 11, max: 11, message: "长度在 11 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //修改按钮
    showEditDialog(info) {
      //console.log(info);
      this.editFormVisible = true;
      //引用传递 克隆
      this.editForm = deepClone(info);
      //console.log(this.editForm);
      //修改完成后 重新获取数据
    },
    handleEditUser(id) {
      //表单验证 发送请求
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            `users/${this.editForm.id}`,
            {
              id: this.editForm.id,
              email: this.editForm.email,
              mobile: this.editForm.mobile
            }
          );
          //请求成功
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg);
          //更新表格中的数据
          this.getUserList();
        }
      });
      //关闭dialog
      this.editFormVisible = false;
    },
    handleEditCancel() {
      this.editFormVisible = false;
      //表单重置
      this.$refs.editFormRef.resetFields();
    },
    //删除按钮
    showDeleteDialog(info) {
      //弹出警告框
      this.$confirm(`此操作将永久删除 ${info.username} , 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //确定删除
          const { data: res } = await this.$http.delete(`users/${info.id}`);
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          //更新列表
          this.getUserList();
          //提示成功
          this.$message({
            type: "success",
            message: res.meta.msg
          });
        })
        .catch(() => {
          //取消删除
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //分配角色
    async showEditRoleDialog(info) {
      this.editForm = info;
      //获取所有的角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rolesList = res.data;
      this.rolesFormVisible = true;
    },
    async handleEditRole() {
      if(!this.selectedRoleId) return this.$message.error('请选择分配的角色');
      //服务端更新数据
      const {data: res} = await this.$http.put(`users/${this.editForm.id}/role`,{
        rid: this.selectedRoleId
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.$message.success(res.meta.msg)
      //刷新列表
      this.getUserList();
      //关闭对话弹框
      this.rolesFormVisible = false;
    },
    handleRolesCancel() {
      this.selectedRoleId = ''
      this.rolesFormVisible = false;
    },
    //获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      //console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.userList = res.data.users;
      this.total = res.data.total;
      //console.log(this.userList);
    },
    // 监听 pagesize 更变
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      //重新发起请求
      this.getUserList();
    },
    //监听 pagenum 改变
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      //重新发起请求
      this.getUserList();
    },
    //状态改变
    async handleStateChange(data) {
      //更新后台的数据
      //console.log(data)
      const { id: uId, mg_state: type } = data;

      const { data: res } = await this.$http.put(`users/${uId}/state/${type}`);

      if (res.meta.status !== 200) {
        data.mg_state = !data.mg_state;
        return this.$message.error(res.meta.msg);
      }

      this.$message.success(res.meta.msg);
    },
    //搜索按钮
    async hadnleSearch() {
      if (!this.queryInfo.query) return;
      //防止按钮暴力点击 flag
      let query = {
        query: this.queryInfo.query,
        pagenum: 1,
        pagesize: this.queryInfo.pagesize
      };

      const { data: res } = await this.$http.get("users", { params: query });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      if (res.data.total) {
        this.userList = res.data.users;
        this.queryInfo = query;
        this.total = res.data.total;
        this.usersChanged = true;
      } else {
        this.$message.error("不存在记录");
      }
    },
    //清空input框
    async handleClear() {
      //是否数据发生改变
      if (this.usersChanged) {
        //重新获取所有数据
        let query = {
          query: this.queryInfo.query,
          pagenum: 1,
          pagesize: this.queryInfo.pagesize
        };

        const { data: res } = await this.$http.get("users", { params: query });
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.userList = res.data.users;
        this.queryInfo = query;
        this.total = res.data.total;
        this.usersChanged = false;
      }
    },
    //添加用户
    addUser() {
      this.dialogFormVisible = true;
    },
    //确定添加用户
    handleAddUser() {
      //表单 登录前校验
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid);
        if (valid) {
          //服务器请求更新数据
          const { data: res } = await this.$http.post("users", this.addForm);

          if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg);
          this.dialogFormVisible = false;
        } else {
          //提示用户确定关闭
          this.$alert("有表单数据不完整", "请求失败", {
            confirmButtonText: "确定",
            callback: action => {
              this.$message({
                type: "error",
                message: `action: error`
              });
            }
          });
        }
      });
      //this.dialogFormVisible = false;
    },
    //取消按钮 表单重置
    handleCancel() {
      this.dialogFormVisible = false;
      this.$refs.addFormRef.resetFields();
    }
  }
};
</script>

<style lang='scss' scoped>
.el-table {
  margin-top: 15px;
}
</style>