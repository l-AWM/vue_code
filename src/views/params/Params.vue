<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示行 -->
      <el-alert title="注意：只允许第三级商品可以设置参数" type="warning" show-icon :closable="false"></el-alert>
      <!-- 选择商品分类区 -->
      <el-row class="select">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择器 级联选择 -->
          <el-cascader
            v-model="selectedCate"
            :props="cateProps"
            :options="cateList"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页面 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态属性" name="many">
          <!-- 按钮区域 -->
          <el-row>
            <el-button
              type="primary"
              size="small"
              :disabled="isBtn"
              @click="showAddParamsDialog"
            >添加参数</el-button>
          </el-row>
          <!-- 表格区域 -->
          <el-table :data="paramsList" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- <pre>{{scope.row}}</pre> -->
                <el-tag
                  closable
                  @close="handleClose(i,scope.row)"
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                >{{item.trim()}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="商品参数" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  type="primary"
                  size="mini"
                  @click="showEditParamsDialog(scope.row)"
                >修改</el-button>
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  size="mini"
                  @click="deleteAttr(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 按钮区域 -->
          <el-row>
            <el-button
              type="primary"
              size="small"
              :disabled="isBtn"
              @click="showAddParamsDialog"
            >添加属性</el-button>
          </el-row>
          <!-- 表格区域 -->
          <el-table :data="paramsListOnly" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- <pre>{{scope.row}}</pre> -->
                <el-tag
                  closable
                  @close="handleClose(i,scope.row)"
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                >{{item.trim()}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="商品参数" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  type="primary"
                  size="mini"
                  @click="showEditParamsDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  size="mini"
                  @click="deleteAttr(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- table-表格区域 -->
    </el-card>

    <!-- 添加参数 -->
    <el-dialog
      :title="'添加'+dialogTitle"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="closeAddParamsDialog"
    >
      <el-form
        :model="addParamsForm"
        ref="addParamsFormRef"
        :rules="addParamsFormRule"
        label-width="80px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      title="'修改参数"
      :visible.sync="editParamsDialog"
      width="50%"
      @close="closeEditParamsDialog"
    >
      <el-form
        :model="addParamsForm"
        ref="addParamsFormRef"
        :rules="addParamsFormRule"
        label-width="80px"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialog = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    //获取商品分类
    this.getCates();
    //获取动态属性
    //this.getParams();
  },
  data() {
    return {
      cateList: [],
      selectedCate: [],
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      curId: 0,
      activeName: "many",
      paramsList: [],
      paramsListOnly: [],
      addParamsDialogVisible: false,
      addParamsForm: {
        attr_name: "",
        attr_sel: "",
        attr_vals: ""
      },
      addParamsFormRule: {
        attr_name: [
          { required: true, message: "请输入参数名", trigger: "blur" }
        ]
      },
      editParamsDialog: false,
      editRow: null
      // inputVisible: false,
      // inputValue:''
    };
  },
  methods: {
    handleChange() {
      //发生改变的时候
      //console.log(this.selectedCate);
      if (this.selectedCate.length < 3) {
        this.selectedCate = [];
        this.paramsList = [];
        this.paramsListOnly = [];
      } else {
        this.curId = this.selectedCate[2];
        //获取动态参数列表   await
        this.getParams(this.activeName).then(res => {
          if (this.activeName === "many") {
            this.paramsList = res;
          } else {
            this.paramsListOnly = res;
          }
          //console.log(this.paramsList);
        });
      }
      //
    },
    async getCates() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      //this.$message.success(res.meta.msg);
      this.cateList = res.data;
    },
    handleClick(tab, event) {
      //  / console.log(tab, event);
      if (tab.name === "only") {
        //静态属性
        this.getParams("only").then(res => {
          this.paramsListOnly = res;
          //console.log(this.paramsListOnly);
        });
      } else {
        //动态属性
        //获取动态参数列表   await
        this.getParams("many").then(res => {
          this.paramsList = res;
          //console.log(this.paramsList);
        });
      }
    },
    async getParams(type) {
      const { data: res } = await this.$http.get(
        `categories/${this.curId}/attributes`,
        { params: { sel: type } }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });
      return res.data;
    },
    //删除参数
    async deleteAttr(params) {
      //确认提示框
      const res = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (res === "confirm") {
        //确认删除
        const { data: res } = await this.$http.delete(
          `categories/${this.curId}/attributes/${params.attr_id}`
        );
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        //更新列表
        this.getParams(this.activeName).then(res => {
          if (this.activeName === "many") {
            this.paramsList = res;
          } else {
            this.paramsListOnly = res;
          }
          //console.log(this.paramsList);
        });
      }
    },
    //显示添加参数的面板
    showAddParamsDialog() {
      this.addParamsDialogVisible = true;
      console.log(this.addParamsForm.attr_name)
    },
    //添加参数
    addParams() {
      //表单与验证
      this.$refs.addParamsFormRef.validate(async valid => {
        if (valid) {
          //请求更新数据
          this.addParamsForm.attr_sel = this.activeName;
          const { data: res } = await this.$http.post(
            `categories/${this.curId}/attributes`,
            this.addParamsForm
          );
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg);

          this.$message.success(res.meta.msg);

          console.log(res);

          //本地刷新
           this.getParams(this.activeName).then(res => {
          if (this.activeName === "many") {
            this.paramsList = res;
          } else {
            this.paramsListOnly = res;
          }});

          this.addParamsDialogVisible = false;
        }
      });
    },
    //
    closeAddParamsDialog() {
      //关闭dialog
      //重置表单
      this.$refs.addParamsFormRef.resetFields();
    },
    //修改参数
    //输入框enter 和失去焦点是
    handleInputConfirm(row) {
      if (row.inputValue.trim().length !== 0) {
        //添加新属性
        row.attr_vals.push(row.inputValue);
        this.saveAttr(row);
      }
      row.inputValue = "";
      row.inputVisible = false;
    },
    async saveAttr(row, newName = "") {
      //发起请求保存数据
      const { data: res } = await this.$http.put(
        `categories/${this.curId}/attributes/${row.attr_id}`,
        {
          attr_name: !newName ? row.attr_name : newName,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(",")
        }
      );

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.$message.success(res.meta.msg);
    },
    //点击按钮输入文本框
    showInput(row) {
      row.inputVisible = true;
      //页面元素重新渲染后 才会执行
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      //发起请求保存数据
      this.saveAttr(row);
    },
    //显示编辑对话框
    showEditParamsDialog(row) {
      console.log(row);
      this.editParamsDialog = true;
      this.addParamsForm.attr_name = row.attr_name;
      this.editRow = row;
    },
    //确认编辑
    editParams() {
      this.$refs.addParamsFormRef.validate(valid => {
        if (valid) {
          //服务器更新
          this.saveAttr(this.editRow, this.addParamsForm.attr_name).then(
            res => {
              console.log(res);
            }
          );
          //本地刷新
           this.getParams(this.activeName).then(res => {
          if (this.activeName === "many") {
            this.paramsList = res;
          } else {
            this.paramsListOnly = res;
          }});
          //关闭对话框
          this.editParamsDialog = false;
        }
      });
    },
    closeEditParamsDialog() {
      this.$refs.addParamsFormRef.resetFields();
      this.addParamsForm.attr_name = "";
    }
  },
  computed: {
    isBtn() {
      return this.selectedCate.length > 0 ? false : true;
    },
    dialogTitle() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  }
};
</script>

<style lang='scss' scoped>
.select {
  margin: 15px 0;
}
.el-table {
  margin: 15px 0;
  .el-tag {
    margin: 8px;
  }
}
.input-new-tag {
  width: 200px;
}
</style>