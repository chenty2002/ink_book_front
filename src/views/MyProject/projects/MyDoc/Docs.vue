<template xmlns="">
  <div>
    <div v-show="show">
      <el-row>
        <el-col
          v-for="document in tableData.slice((curPage-1)*8, curPage*8)"
          :key="document.id"
          :span="4"
          style="margin: 15px 20px"
        >
          <el-card :body-style="{ padding: '25px' }" shadow="hover" style="margin: 0 auto; height: 200px; width: 200px">
            <div style="margin: 0 auto; text-align: center">
              <el-popover
                placement="top"
                title="文档标题"
                width="250"
                trigger="hover"
                :content="document.name"
              >
                <div slot="reference" class="title">
                  {{ document.name }}
                </div>
              </el-popover>
              <el-popover
                placement="right"
                title="文档内容"
                width="250"
                trigger="hover"
                :content="document.content"
              >
                <div slot="reference" class="bottom clearfix">
                  <div class="content">{{ document.content }}</div>
                </div>
              </el-popover>
              <el-button-group style="margin-top: 13px">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  style="display: flex;
                justify-content: center;
                width: 13px"
                  @click="editDocument(document)"
                />
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  style="display: flex;
                justify-content: center;
                width: 13px"
                  @click="showDocument(document)"
                />
                <!--查看文档弹窗-->
                <el-dialog
                  title="查看文档"
                  width="90%"
                  top="30px"
                  :visible.sync="dialog_show_visible"
                  :close-on-click-modal="false"
                  :show-close="false"
                  :modal-append-to-body="false"
                >
                  <div>
                    <div style="text-align: left">
                      <span style="font-size: 20px; font-weight: bold; margin-left: 60px">
                        文档标题：
                      </span>
                      <span style="font-size: 20px">{{ document_to_show.name }}</span>
                    </div>
                    <div
                      style="text-align: left; margin-top: 20px; margin-left: 60px; font-size: 20px; font-weight: bold"
                    >
                      文档内容：
                    </div>
                    <div style="text-align: left; margin: 20px 60px">
                      <quill-editor
                        ref="myQuillEditor"
                        v-model="document_to_show.content"
                        disabled="true"
                        style="margin: 20px; height:345px"
                        :options="editorOption"
                      />
                    </div>
                  </div>
                  <el-button style="margin-top: 40px" @click="showCancel">关 闭</el-button>
                </el-dialog>
                <el-button
                  type="primary"
                  icon="el-icon-delete"
                  style="display: flex;
                justify-content: center;
                width: 13px"
                  @click="rmDocument(tableData.indexOf(document))"
                />
              </el-button-group>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <Pagination
        :total="tableData.length"
        :page-size="8"
        style="margin: 5px; text-align:center; height: 55px;"
        @changePage="changePage"
      />
    </div>
    <div v-show="!show" style="position: absolute; width: 80%">
      <el-form ref="edit_form" :model="edit_form" :rules="rules">
        <el-form-item label="文档标题" :label-width="formLabelWidth" prop="name">
          <el-input v-model="edit_form.name" placeholder="请输入文档名称"/>
        </el-form-item>
        <el-form-item label="文档内容" :label-width="formLabelWidth" prop="content">
          <el-card style="height: 455px;">
            <quill-editor ref="myQuillEditor" v-model="edit_form.content" style="height:315px" :options="editorOption"/>
          </el-card>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button @click="editCancel">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/Pagination'
import {
  quillEditor
} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  components: { Pagination, quillEditor },
  data() {
    return {
      editorOption: {},
      show: true,
      false: false,
      dialog_edit_visible: false,
      dialog_show_visible: false,
      document_to_show: {},
      document_to_edit: {},
      edit_form: {
        name: '',
        content: null,
        type: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入文档标题', trigger: 'blur' }
        ]
      },
      formLabelWidth: '80px',
      curPage: 1,
      tableData: [{
        id: '1',
        name: '文档1',
        content: '文档内容1'
      }, {
        id: '2',
        name: '文档2',
        content: '文档内容2'
      }, {
        id: '3',
        name: '文档3',
        content: '文档内容3'
      }]
    }
  },
  methods: {
    changePage(num) {
      this.curPage = num
    },
    rmDocument(index) {
      this.tableData.splice(index, 1)
    },
    showDocument(Document) {
      this.document_to_show = Document
      this.dialog_show_visible = true
    },
    showCancel() {
      this.dialog_show_visible = false
    },
    editDocument(Document) {
      this.document_to_edit = Document
      this.show = false
      this.edit_form.name = Document.name
      this.edit_form.content = Document.content
    },
    editCancel() {
      this.show = true
      this.$refs['edit_form'].resetFields()
    },
    editConfirm() {
      if (this.edit_form.name === '' || this.edit_form.content === '') {
        this.$message('请将必要信息填写完整！！！')
      } else {
        this.document_to_edit.name = this.edit_form.name
        this.document_to_edit.content = this.edit_form.content
        this.show = true
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
