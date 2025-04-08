<template xmlns="">
  <div>
    <div v-show="show">
      <div class="clearfix" style="margin-left: 50px">
        <el-button type="primary" style="float:left; margin-right: 2%" @click="dialog_add_visible = true">
          新建文档
        </el-button>
        <el-form :inline="true" :model="formInline" class="searchArticles">
          <el-autocomplete
            class="autocomplete"
            v-model="searchWord"
            :fetch-suggestions="querySearch"
            placeholder="搜索文档（标题或内容）"
            @select="autoCompleteSearch"
            style="margin-right:10px;"
          >
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix"
            >
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.title }}</div>
              <span class="des">{{ item.content }}</span>
            </template>
          </el-autocomplete>
          <el-form-item>
            <el-button icon="el-icon-search" circle @click="submitSearch"></el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <!--新建文档弹窗-->
        <el-dialog
          title="新建文档"
          :fullscreen="true"
          :visible.sync="dialog_add_visible"
          :close-on-click-modal="false"
          :show-close="false"
          :modal-append-to-body="false"
          :destroy-on-close="true"
        >
        
          <!-- <createDoc/> -->
          <div>
            <el-form :inline="true" style="padding: 0px">
              <el-form-item label="文档标题" style="margin-left: 25px">
                <el-input id="title" v-model="add_form.title" placeholder="文档标题" style="width: 500px"></el-input>
                <el-button @click="addCancel" style="margin-left: 700px" v-show="add_form.content.length === 0 && add_form.title.length === 0">取 消</el-button>
              </el-form-item>
              <el-card style="height: 490px;">
                <quill-editor ref="myQuillEditor" v-model="add_form.content" style="height:405px" :options="editorOption" />
              </el-card>
            </el-form>
          </div>
          <transition name="models">
            <div class="text-models" v-show="add_form.content.length === 0 && add_form.title.length === 0" style="display">
              <el-carousel :interval="4000" type="card" height="100px">
                <el-carousel-item v-for="item in textModels" :key="item.articleId"">
                  <h2 class="medium" @click="chooseModel(item)">{{item.title}}</h2>
                  <h1 class="text" @click="chooseModel(item)" v-html="item.content"></h1>
                  <body class="back"></body>
                </el-carousel-item>
              </el-carousel>
            </div>
          </transition>
          <div slot="footer" class="dialog-footer" style="margin-right: 50px" v-show="add_form.content.length !== 0 || add_form.title.length !== 0">
            <el-button type="danger" @click="resetForm">清 空</el-button>
            <el-button @click="addCancel">取 消</el-button>
            <el-button type="primary" @click="addConfirm">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div>
        <el-row style="">
          <el-col
            v-for="document in tableData.slice((curPage-1)*8, curPage*8)"
            :key="document.id"
            :span="4"
            style="margin: 20px 50px"
          >
            <el-card
              :body-style="{ padding: '25px' }"
              shadow="hover"
              style="height: 100%; width: 90%; background-color: #d3dce6"
            >
              <div style="margin: 0 auto; text-align: center">
                <div slot="reference" class="title">
                  {{ document.title }}
                </div>
                <div slot="reference" class="bottom clearfix">
                  <div class="content">{{ document.content }}</div>
                </div>
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
                    type="success"
                    icon="el-icon-search"
                    style="display: flex;
                    justify-content: center;
                    width: 13px"
                    @click="showDocument(document)"
                  />
                  <!--查看文档弹窗-->
                  <el-dialog
                    title=""
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
                        <span style="font-size: 30px"><strong>{{document_to_show.title}}</strong></span>
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
                          style="margin: 20px; height:440px"
                          :options="editorOption"
                        />
                      </div>
                    </div>
                    <el-button style="margin-top:60px" @click="showCancel">关 闭</el-button>
                  </el-dialog>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    style="display: flex;
                    justify-content: center;
                    width: 13px"
                    @click="rmDocument(document)"
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
    <div v-show="!show" style="margin-left:100px; width: 80%">
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
import { getGroupArticle, saveArticle, getArticleInfo, deleteArticle, updateArticle, deleteGroupArticle, deleteProjectArticle, searchArticle } from '@/api/article'
import Pagination from '@/components/Pagination/Pagination'
import createDoc from '@/views/MyProject/projects/MyDoc/createDoc'
import {
  quillEditor
} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  components: { Pagination, createDoc, quillEditor },
  data() {
    return {
      searchWord: '',
      textModels: {},
      editorOption: {},
      show: true,
      search: '',
      false: false,
      dialog_add_visible: false,
      dialog_edit_visible: false,
      dialog_show_visible: false,
      document_to_show: {},
      document_to_edit: {},
      add_form: {
        title: '',
        content: ''
      },
      edit_form: {
        articleId: '',
        name: '',
        content: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入文档标题', trigger: 'blur' }
        ]
      },
      formLabelWidth: '80px',
      curPage: 1,
      tableData: []
    }
  },
  created: function() {
    this.loadModels();
    this.loadArticles();
  },
  methods: {
    resetSearch() {
      this.searchWord = ''
      this.loadProject()
    },
    submitSearch() {
      searchArticle({
        groupId: 0,
        word: this.searchWord
      }).then((res) => {
        this.tableData = res.data
      })
    },
    querySearch(query, cb) {
      var articles = this.tableData
      var results = query ? articles.filter(this.createFilter(query)) : articles
      console.log(results)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (article) => {
        return (article.title.toLowerCase().indexOf(queryString.toLowerCase()) !== -1 || article.content.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    autoCompleteSearch(article) {
      this.searchWord = article.title
    },
    resetForm() {
      this.add_form.content = ''
      this.add_form.title = ''
    },
    chooseModel(item) {
      this.add_form.title = item.title
      this.add_form.content = item.content
    },
    loadArticles() {
      getGroupArticle({
        groupId: 0
      }).then((res) => {
        if(res.code !== 1) {
          this.$error('Loading Error')
          return
        }
        this.tableData = res.data
      })
    },
    loadModels() {
      getGroupArticle({
        groupId: 0
      }).then((res) => {
        if(res.code !== 1) {
          this.$error('Loading Error')
          return
        }
        this.textModels = res.data
      })
    },
    changePage(num) {
      this.curPage = num
    },
    addCancel() {
      this.dialog_add_visible = false
      this.$refs['add_form'].resetFields()
    },
    addConfirm() {
      if (this.add_form.name === '') {
        this.$message('文档标题不能为空')
      } else {
        this.dialog_add_visible = false
        var newArt = {
          groupId: 21,
          projectId: 21,
          title: this.add_form.name,
          content: this.add_form.content
        }
        saveArticle(newArt).then((res) => {
          if(res.code !== 1) {
            this.$error(res.msg)
            return
          }
        })
        this.$refs['add_form'].resetFields()
        this.loadArticles()
      }
    },
    rmDocument(document) {
      deleteArticle({
        articleId: document.articleId
      }).then((res) => {
        if(res.code !== 1) { 
          this.$error(res.msg)
          return
        }
      })
      this.loadArticles()
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
      this.edit_form.articleId = Document.articleId
      this.edit_form.name = Document.title
      this.edit_form.content = Document.content
    },
    editCancel() {
      this.show = true
      this.$refs['edit_form'].resetFields()
    },
    editConfirm() {
      if (this.edit_form.name === '') {
        this.$message('文档标题不能为空')
      } else {
        this.document_to_edit.articleId = this.edit_form.articleId
        this.document_to_edit.title = this.edit_form.name
        this.document_to_edit.content = this.edit_form.content
        updateArticle(this.document_to_edit).then((res) => {
          if(res.code !== 1) {
            this.$error(res.msg)
          }
        })
        this.loadArticles()
        this.show = true
        this.$refs['edit_form'].resetFields()
      }
    }
  }
}
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
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

