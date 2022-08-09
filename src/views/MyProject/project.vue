<template xmlns="">
  <div>
    <el-row>
      <el-col
        v-for="project in tableData.slice((curPage-1)*8, curPage*8)"
        :key="project.id"
        :span="5"
        style="margin: 15px 20px"
      >
        <el-card :body-style="{ padding: '25px' }" shadow="hover" style="margin: 0 auto; height: 200px; width: 200px">
          <div style="margin: 0 auto; text-align: center">
            <el-popover
              placement="top"
              title="项目名称"
              width="250"
              trigger="hover"
              :content="project.name"
            >
              <div slot="reference" class="title">
                {{ project.name }}
              </div>
            </el-popover>
            <el-popover
              placement="right"
              title="项目描述"
              width="250"
              trigger="hover"
              :content="project.content"
            >
              <div slot="reference" class="bottom clearfix">
                <div class="content">{{ project.content }}</div>
              </div>
            </el-popover>
            <el-button-group style="margin-top: 13px">
              <el-button
                type="primary"
                icon="el-icon-edit"
                style="display: flex;
                justify-content: center;
                width: 13px"
                @click="editProject(project)"
              />
              <!--修改项目弹窗-->
              <el-dialog
                title="编辑项目信息"
                width="50%"
                :visible.sync="dialog_edit_visible"
                :close-on-click-modal="false"
                :show-close="false"
                :modal-append-to-body="false"
              >
                <el-form ref="edit_form" :model="edit_form" :rules="rules">
                  <el-form-item label="项目名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="edit_form.name" placeholder="请输入项目名称" />
                  </el-form-item>
                  <el-form-item label="项目描述" :label-width="formLabelWidth" prop="content">
                    <el-input
                      v-model="edit_form.content"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6}"
                      placeholder="请输入项目描述内容"
                    />
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="editCancel">取 消</el-button>
                  <el-button type="primary" @click="editConfirm">确 定</el-button>
                </div>
              </el-dialog>
              <!--<el-button-->
              <!--type="primary"-->
              <!--icon="el-icon-search"-->
              <!--style="display: flex;-->
              <!--justify-content: center;-->
              <!--width: 13px"-->
              <!--/>-->
              <el-button
                type="primary"
                icon="el-icon-delete"
                style="display: flex;
                justify-content: center;
                width: 13px"
                @click="rmProject(tableData.indexOf(project))"
              />
            </el-button-group>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-button type="primary" style="margin-left: 23px; margin-top: 15px" @click="dialog_add_visible = true">
      <ion-icon name="add-sharp" style="font-size: 20px" />
    </el-button>
    <!--添加项目弹窗-->
    <el-dialog
      title="创建项目信息"
      width="50%"
      :visible.sync="dialog_add_visible"
      :close-on-click-modal="false"
      :show-close="false"
      :modal-append-to-body="false"
    >
      <el-form ref="add_form" :model="add_form" :rules="rules">
        <el-form-item label="项目名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="add_form.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目描述" :label-width="formLabelWidth" prop="content">
          <el-input
            v-model="add_form.content"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6}"
            placeholder="请输入项目描述内容"
          />
        </el-form-item>
        <el-form-item label="项目类型" :label-width="formLabelWidth">
          <el-select v-model="add_form.type" placeholder="请选择项目类型">
            <el-option label="类型一" value="type1" />
            <el-option label="类型二" value="type2" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>
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

export default {
  components: { Pagination },
  data() {
    return {
      false: false,
      dialog_add_visible: false,
      dialog_edit_visible: false,
      project_to_edit: {},
      add_form: {
        name: '',
        content: '',
        type: ''
      },
      edit_form: {
        name: '',
        content: '',
        type: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入项目描述内容', trigger: 'change' }
        ]
      },
      formLabelWidth: '80px',
      curPage: 1,
      tableData: [{
        id: '1',
        name: '测试1',
        content: '项目描述1'
      }, {
        id: '2',
        name: '测试2',
        content: '项目描述2'
      }, {
        id: '3',
        name: '测试3',
        content: '项目描述3'
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
    rmProject(index) {
      this.tableData.splice(index, 1)
    },
    editProject(project) {
      this.project_to_edit = project
      this.dialog_edit_visible = true
      this.edit_form.name = project.name
      this.edit_form.content = project.content
    },
    editCancel() {
      this.dialog_edit_visible = false
      this.$refs['edit_form'].resetFields()
    },
    editConfirm() {
      if (this.edit_form.name === '' || this.edit_form.content === '') {
        this.$message('请将必要信息填写完整！！！')
      } else {
        this.project_to_edit.name = this.edit_form.name
        this.project_to_edit.content = this.edit_form.content
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

