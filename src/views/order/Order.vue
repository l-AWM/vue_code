<template>
  <div>
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="handleClearSearch"
          >
            <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="150px">
          <template slot-scope="prop">
            <el-alert
              v-if="prop.row.pay_status === '0'"
              title="未付款"
              type="error"
              center
              :closable="false"
            ></el-alert>
            <el-alert v-else title="已付款" type="success" center :closable="false"></el-alert>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="80px">
          <template slot-scope="prop">
            <span v-if="prop.row.is_send === '1'">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="prop">{{prop.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="prop">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="showeditDialog(prop.row)"
            ></el-button>
            <el-button
              icon="el-icon-setting"
              type="success"
              size="mini"
              @click="showProgressDialog(prop.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改订单地址 -->
    <el-dialog title="修改订单地址" :visible.sync="editdialogVisible" width="50%" @close="handleClose">
      <el-form
        :model="addressForm"
        :rules="addressFormRule"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省/市/区县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAdress">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressdialogVisible"
      width="50%"
      @close="handleProgressClose"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "@/lib/citydata.js";
export default {
  created() {
    //获取订单列表
    this.getOrderList();
  },
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      editdialogVisible: false,
      addressForm: { address1: [], address2: "" },
      addressFormRule: {
        address1: [
          { required: true, message: "请输入地址信息", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请输入地址信息", trigger: "blur" }
        ]
      },
      cityData: cityData,
      progressdialogVisible: false,
      activities: []
    };
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      console.log(res);
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    handleSearch() {
      // 获取订单列表
      this.getOrderList();
    },
    handleClearSearch() {
      //重新获取订单列表
      this.getOrderList();
    },
    //pagesize变化
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getOrderList();
    },
    //pagenum变化
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getOrderList();
    },
    //显示对话框
    showeditDialog(row) {
      this.editdialogVisible = true;
    },
    //关闭对话框
    handleClose() {
      //重置表单数据
      this.$refs.addressFormRef.resetFields();
    },
    //修改订单地址
    editAdress() {
      this.editdialogVisible = false;
    },
    //显示进度对话框
    async showProgressDialog(row) {
      //获取物流进度
      const { data: res } = await this.$http.get(`/kuaidi/1106975712662`);

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      console.log(res.data);

      this.activities = res.data;

      this.progressdialogVisible = true;
    },
    //关闭对话框
    handleProgressClose() {}
  }
};
</script>

<style lang='scss' scoped>
.el-table {
  margin: 15px 0;
}
.el-cascader {
  width: 100%;
}
</style>