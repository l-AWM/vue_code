<template>
  <div>
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="handleClear">
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addGood">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="goodsList" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" width="400px" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
            <template slot-scope="prop">
                {{prop.row.add_time|dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width='120px'>
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click='showEditGoodDialog(scope.row)'></el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="deleteGood(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 编辑商品对话框 -->
    <el-dialog title="修改商品" :visible.sync="editGoodVisible" width='50%'>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editGoodVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGood">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    //获取商品列表数据
    this.getGoodsList();
  },
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      editGoodVisible: false
    };
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      console.log(res);
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    //pagenum更新
    handleCurrentChange(val) {
      //获取数据
      this.queryInfo.pagenum = val;
      this.getGoodsList();
    },
    //pagesize更新
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getGoodsList();
    },
    //搜索按钮
    handleSearch() {
      if (this.queryInfo.query.trim().length !== 0) {
        //发起请求
        this.getGoodsList();
      }
    },
    //输入框 清空
    handleClear() {
      this.queryInfo.query = "";
      //重新获取数据
      this.getGoodsList();
    },
    //显示修改对话框
    showEditGoodDialog(row){
        this.editGoodVisible = true;
    },
    //确认修改
    editGood(){

    },
    //添加商品
    addGood(){
        //路由跳转 页面
        this.$router.push({path:'/goods/add'});
    },
    //删除商品
    async deleteGood(row){
        //提示确认框
       let res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)

        if(res === 'confirm'){
            //删除服务器数据
            const {data: res} = await this.$http.delete(`goods/${row.goods_id}`);
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.$message.success(res.meta.msg)
            //更新数据
            this.getGoodsList();
        }
    }
  }
};
</script>

<style lang='scss' scoped>
.el-table {
  margin: 15px 0;
}
</style>