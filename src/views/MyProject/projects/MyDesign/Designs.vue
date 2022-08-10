<template xmlns="">
  <div>
    <div class="clearfix" style="margin-left: 50px">
      <el-button type="primary" style="float:left; margin-right: 2%" @click="dialog_add_visible = true">
        新建原型
      </el-button>
      <!--添加原型弹窗-->
      <el-dialog
        title="创建原型"
        :fullscreen="true"
        :visible.sync="dialog_add_visible"
        :close-on-click-modal="false"
        :show-close="false"
        :modal-append-to-body="false"
        :destroy-on-close="true"
      >
        <el-form ref="add_form" :model="add_form" :rules="rules">
          <el-form-item label="原型名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="add_form.name" placeholder="请输入原型名称" />
          </el-form-item>
          <el-form-item label="原型设计区：" label-width="105px" style="height: 10px"/>
        </el-form>
        <model />
        <div slot="footer" class="dialog-footer" style="margin-right: 50px">
          <el-button @click="addCancel">取 消</el-button>
          <el-button type="primary" @click="addConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-row style="">
        <el-col
          v-for="design in tableData.slice((curPage-1)*8, curPage*8)"
          :key="design.id"
          :span="4"
          style="margin: 20px 50px"
        >
          <el-card :body-style="{ padding: '25px' }" shadow="always" style="height: 100%; width: 90%; background-color: #d3dce6">
            <div style="margin: 0 auto; text-align: center">
              <div slot="reference" class="title">
                {{ design.name }}
              </div>
              <div slot="reference" class="bottom clearfix">
                <div class="content">{{ design.content }}</div>
              </div>
              <el-button-group style="margin-top: 13px">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  style="display: flex;
                justify-content: center;
                width: 13px"
                  @click="showDesign(design)"
                />
                <!--查看原型图弹窗-->
                <el-dialog
                  title="原型信息"
                  width="50%"
                  :visible.sync="dialog_edit_visible"
                  :close-on-click-modal="false"
                  :show-close="false"
                  :modal-append-to-body="false"
                >
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="editCancel">取 消</el-button>
                    <el-button type="primary" @click="editConfirm">确 定</el-button>
                  </div>
                </el-dialog>
                <el-button
                  type="primary"
                  icon="el-icon-delete"
                  style="display: flex;
                justify-content: center;
                width: 13px"
                  @click="rmDesign(tableData.indexOf(design))"
                />
              </el-button-group>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <Pagination
      :total="tableData.length"
      :page-size="8"
      style="margin: 5px; text-align:center; height: 55px;"
      @changePage="changePage"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/Pagination'
import model from '@/views/MyProject/projects/MyDesign/model'

export default {
  components: { Pagination, model },
  data() {
    return {
      search: '',
      false: false,
      dialog_add_visible: false,
      dialog_edit_visible: false,
      design_to_edit: {},
      add_form: {
        name: '',
        content: ''
      },
      edit_form: {
        name: '',
        content: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入原型名称', trigger: 'blur' }
        ]
      },
      formLabelWidth: '80px',
      curPage: 1,
      tableData: [{
        id: '1',
        name: '测试1',
        content: '描述1'
      }, {
        id: '2',
        name: '测试2',
        content: '描述2'
      }, {
        id: '3',
        name: '测试3',
        content: '描述3'
      }]
    }
  },
  methods: {
    changePage(num) {
      this.curPage = num
    },
    addCancel() {
      this.dialog_add_visible = false
      this.$refs['add_form'].resetFields()
    },
    addConfirm() {
      if (this.add_form.name === '' || this.add_form.content === '') {
        this.$message('请将必要信息填写完整！！！')
      } else {
        this.dialog_add_visible = false
        this.tableData.push({
          id: (this.tableData.length.valueOf() + 1).toString(),
          name: this.add_form.name,
          content: this.add_form.content
        })
        this.$refs['add_form'].resetFields()
      }
    },
    rmDesign(index) {
      this.tableData.splice(index, 1)
    },
    showDesign(Design) {
    },
    editCancel() {
      this.dialog_edit_visible = false
      this.$refs['edit_form'].resetFields()
    },
    editConfirm() {
      if (this.edit_form.name === '' || this.edit_form.content === '') {
        this.$message('请将必要信息填写完整！！！')
      } else {
        this.design_to_edit.name = this.edit_form.name
        this.design_to_edit.content = this.edit_form.content
        this.dialog_edit_visible = false
        this.$refs['edit_form'].resetFields()
      }
    }
  }
}
</script>

<style>
.title {
  font-size: 17px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.content {
  margin: 8px;
  font-size: 13px;
  line-height: 16px;
  color: #001528;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bottom {
  margin-top: 13px;
  height: 65px;
  text-align: center;
  background-color: #ececec;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>

