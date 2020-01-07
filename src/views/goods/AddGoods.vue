<template>
  <div>
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- tag提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步进条 -->
      <el-steps align-center :active="activeIndex - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->

      <el-form :model="addForm" ref='addFormRef' :rules="addFormRule" label-width="100px" label-position="top">
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="selectValue"
                :options="cateList"
                :props="selectProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项目 -->
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              v-model="addForm.goods_introduce"
              ref="myQuillEditor"
            ></quill-editor>
            <br/>
            <!-- 添加商品的按钮 -->
            <el-button @click="add" type='primary'>添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!-- 表单信息 -->
    </el-card>
    <!-- 预览图片 -->
    <el-dialog title="提示" :visible.sync="imgDialogVisible" width="50%">
      <div style="width='300px">
        <img :src="previewPath" alt style="width:100%;height:100%;" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="imgDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="imgDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  created() {
    //获取商品分类的列表
    this.getCateList();
  },
  data() {
    return {
      tabPosition: "left",
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: "", //以逗号分割
        pics: [],
        goods_introduce:'',
        attrs:[]
      },
      addFormRule: {
        goods_name: [
          { required: true, message: "请输入参数", trigger: "blur" }
        ],
        goods_price: [
          {
            required: true,
            type: "number",
            message: "请输入参数",
            trigger: "blur"
          }
        ],
        goods_weight: [
          {
            required: true,
            type: "number",
            message: "请输入参数",
            trigger: "blur"
          }
        ],
        goods_number: [
          {
            required: true,
            type: "number",
            message: "请输入参数",
            trigger: "blur"
          }
        ]
      },
      //商品分类
      cateList: [],
      selectValue: [],
      selectProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //动态参数列表数据
      manyTableData: [],
      onlyTableData: [],
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewPath: "",
      imgDialogVisible: false
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 3
        }
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.cateList = res.data;
    },
    //选择框 变化
    handleChange() {
      //设置商品分类
      console.log(this.selectValue);
      this.addForm.goods_cat = this.selectValue.join(",");
      //只允许设置三级分类
    },
    //阻止切换标签页
    beforeTabLeave(activeName, oldName) {
      if (oldName === "0" && this.selectValue.length === 0) {
        this.$message.error("请输入商品参数");
        return false;
      }
    },
    //面板被选中
    async tabClick() {
      if (this.activeIndex === "1") {
        //获取动态参数
        const { data: res } = await this.$http.get(
          `categories/${this.selectValue[2]}/attributes`,
          {
            params: {
              sel: "many"
            }
          }
        );
        res.data.forEach(el => {
          el.attr_vals =
            el.attr_vals.length === 0 ? [] : el.attr_vals.split(",");
        });
        //
        this.manyTableData = res.data;
      }
      if (this.activeIndex === "2") {
        //获取静态属性
        const { data: res } = await this.$http.get(
          `categories/${this.selectValue[2]}/attributes`,
          {
            params: {
              sel: "only"
            }
          }
        );
        console.log(res.data);
        this.onlyTableData = res.data;
      }
    },
    //预览图片
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      //弹出对话框
      this.imgDialogVisible = true;
      //显示图片
    },
    //移除图片
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex(x => x.pic === filePath);
      this.addForm.pics.splice(i, 1);
    },
    //图片上传成功
    handleSuccess(res) {
      const picInfo = { pic: res.data.tmp_path };
      this.addForm.pics.push(picInfo);
      console.log(this.addForm);
    },
    //添加商品
    add(){
      //console.log(this.addForm)
      //表单数据校验
      this.$refs.addFormRef.validate(async valid => {
        if(!valid){
         return this.$message.error('请完成商品参数输入')
        }
        //处理动态参数 与静态参数
        this.manyTableData.forEach(item => {
          const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals.join(',')};
          this.addForm.attrs.push(newInfo)
        })

        this.onlyTableData.forEach(item => {
          const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals};
          this.addForm.attrs.push(newInfo)
        })
        //console.log(this.addForm)
         //更新服务器数据
         const {data: res} = await this.$http.post('goods',this.addForm);

         if(res.meta.status !== 201) return this.$message.error(res.meta.msg)

         this.$message.success(res.meta.msg)
      })
    }
  }
};
</script>

<style lang='scss' scoped>
.el-steps {
  margin: 15px 0;
  .el-step__title {
    font-size: 13px;
  }
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
</style>