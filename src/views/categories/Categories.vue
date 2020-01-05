<template>
  <div>
    <!-- 头部面区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template v-slot:isok="prop">
          <i v-if="prop.row.cat_deleted === false" class="el-icon-success" style="color:lightgreen"></i>
          <i v-else class="el-icon-error" style="color:red"></i>
        </template>

        <template v-slot:order="prop">
          <el-tag size="min" v-if="prop.row.cat_level === 0">一级</el-tag>
          <el-tag size="min" v-if="prop.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag size="min" v-if="prop.row.cat_level === 2" type="warning">三级</el-tag>
        </template>

        <template v-slot:action="prop">
          <el-button icon="el-icon-delete" type="danger" size="mini" @click="deleteCate(prop.row)">删除</el-button>
          <el-button icon="el-icon-edit" type="primary" size="mini" @click='showEditCateDialog(prop.row)'>编辑</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3,5,10,15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateVisible" width="50%" @close="addCateHandleClose">
      <!-- 添加分类表单 -->
      <el-form ref='addCateFormRef' :model="addCateForm" :rules="addCateFormRule" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑分类" :visible.sync='editCateVisible' width="50%"
    >
        <el-form ref="editFormRef" :model='editForm' :rules='editFormRule' label-width="80px">
            <el-form-item label="分类名称" prop='cat_name'>
            <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
        </el-form>
        
    <span slot="footer" class="dialog-footer">
        <el-button @click="editCateVisible= false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import ZkTable from "vue-table-with-tree-grid";
export default {
  created() {
    //获取商品分类的数据
    this.getCates();
  },
  components: {
    treeTable: ZkTable
  },
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRule: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "action",
          width: "200px"
        }
      ],
      addCateVisible: false,
      parentCateList: [],
      cascaderProps:{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',children:'children',checkStrictly: true },
      selectedKeys:[],
      editCateVisible: false,
      curId:0,
      editForm:{
          cat_name:''
      },
      editFormRule:{
          cat_name:[
              {required:true,message:'请输入分类名称',trigger:'blur'}
          ]
      }
    };
  },
  methods: {
    async getCates() {
      //发送请求
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.cateList = res.data.result;
      console.log(this.cateList);
      this.total = res.data.total;
    },
    //pagesize变化
    handleSizeChange(newPagesize) {
      this.queryInfo.pagesize = newPagesize;
      this.getCates();
    },
    //pagenum变化
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum;
      this.getCates();
    },
    //添加分类对话框
    showAddCateDialog() {
      //获取父级分类的列表
      this.getParentsCateList();
        //console.log(this.parentCateList)
      this.addCateVisible = true;
    },
    //添加分裂
    addCate() {
        console.log(this.addCateForm)
    //添加新分类
    this.$refs.addCateFormRef.validate(async valid => {
        if(valid){
            //发送请求
            
            const {data: res} = await this.$http.post('categories',this.addCateForm);
            if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
            this.$message.success(res.meta.msg);
            //刷新列表
            this.getCates();
             this.addCateVisible = false;
        }else{
            this.$message.success('添加数据失败')
        }
    })
    //console.log(this.addCateForm);
     
    },
    //添加分类 关闭
    addCateHandleClose() {
      //重置数据项
     this.$refs.addCateFormRef.resetFields();
     this.selectedKeys = []
     this.addCateForm.cat_pid = 0;
    this.addCateForm.cat_level = 0;
    },
    async getParentsCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.parentCateList = res.data;
    },
    //选择项改变 
    handleChange(){
        if(this.selectedKeys.length > 0){
            //console.log(this.selectedKeys[length - 1])
            this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1];
            this.addCateForm.cat_level = this.selectedKeys.length;
        }else{
            this.addCateForm.cat_pid = 0;
            this.addCateForm.cat_level = 0;
        }
        
    },
    //删除分类
    async deleteCate(cate){
        //弹出提示框
        const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if(confirmRes === 'confirm'){
            //确认删除
            const {data: res} = await this.$http.delete(`categories/${cate.cat_id}`)
            //更新列表 当前的一行
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.$message.success(res.meta.msg);
            this.getCates();
            // 关闭对话框
            this.editCateVisible = false;
        }
    },
    //显示弹出框
    showEditCateDialog(cate){
        this.editCateVisible = true;
        //当前选中的数据
        this.curId = cate.cat_id;
        this.editForm.cat_name = cate.cat_name;
       
    },
    //编辑分类
    editCate(){
        //表单验证
        this.$refs.editFormRef.validate(async valid => {
            if(valid){
                //console.log(this.editForm.cat_name)
                const {data: res} = await this.$http.put(`categories/${this.curId}`,this.editForm);
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.$message.success(res.meta.msg);
                //更新数据
                this.getCates();
                //关闭
                this.editCateVisible = false;
            }
        })
    },
  }
};
</script>

<style lang='scss' scoped>
.treeTable {
  margin: 15px 0;
}
.el-cascader{
    width: 100%;
}
</style>