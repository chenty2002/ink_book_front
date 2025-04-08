<template>
  <div>
    <div style="text-align:center">
      <el-form :inline="true" :model="formInline" class="searchProjects">
        <el-autocomplete
          class="autocomplete"
          v-model="searchWord"
          :fetch-suggestions="querySearch"
          placeholder="搜索项目（名称或描述）"
          @select="autoCompleteSearchProject"
          style="margin-right:10px;"
        >
          <i
            class="el-icon-edit el-input__icon"
            slot="suffix"
          >
          </i>
          <template slot-scope="{ item }">
            <div class="name">{{ item.projectName }}</div>
            <span class="des">{{ item.projectDescription }}</span>
          </template>
        </el-autocomplete>
        <el-date-picker
          v-model="searchDate.date"
          type="datetimerange"
          format="yyyy年MM月dd日 HH时mm分"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="timeOptions"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          style="margin-right:10px;"
        >
        </el-date-picker>
        <el-form-item>
          <el-button icon="el-icon-search" circle @click="submitSearchProject"></el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>

      <el-dropdown @command="switchSort">
        <span class="el-dropdown-link">
          排序方式: {{ sorting }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="创建时间顺序">创建时间顺序</el-dropdown-item>
          <el-dropdown-item command="创建时间倒序">创建时间倒序</el-dropdown-item>
          <el-dropdown-item command="项目名称顺序">项目名称顺序</el-dropdown-item>
          <el-dropdown-item command="项目名称倒序">项目名称倒序</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-row>
      <el-col
        v-for="project in tableData.slice((curPage-1)*4, curPage*4)"
        :key="project.projectId"
        :span="5"
        style="margin: 15px 135px"
      >
        <el-card :body-style="{ padding: '25px' }" shadow="hover" style="margin: 0 auto; height: 200px; width: 400px">
          <div style="margin: 0 auto; text-align: center">
            <el-popover
              placement="top"
              title="项目名称"
              width="250"
              trigger="hover"
              :content="project.projectName"
            >
              <div slot="reference" class="title">
                {{ project.projectName }}
              </div>
            </el-popover>
            <el-popover
              placement="right"
              title="项目描述"
              width="250"
              trigger="hover"
              :content="project.projectDescription"
            >
              <div slot="reference" class="bottom clearfix">
                <div class="content">{{ project.projectDescription }}</div>
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
                    <el-input v-model="edit_form.name" placeholder="请输入项目名称"/>
                  </el-form-item>
                  <el-form-item label="项目描述" :label-width="formLabelWidth" prop="content">
                    <el-input
                      v-model="edit_form.content"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6}"
                      placeholder="请输入项目描述"
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
                type="danger"
                icon="el-icon-delete"
                style="display: flex;
                justify-content: center;
                width: 13px"
                @click="rmProject(project)"
              />
            </el-button-group>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-button type="primary" style="margin-left: 23px; margin-top: 15px" @click="dialog_add_visible = true">
      <ion-icon name="add-sharp" style="font-size: 20px"/>
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
          <el-input v-model="add_form.name" placeholder="请输入项目名称"/>
        </el-form-item>
        <el-form-item label="项目描述" :label-width="formLabelWidth" prop="content">
          <el-input
            v-model="add_form.content"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6}"
            placeholder="请输入项目描述"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <Pagination
      :total="tableData.length"
      :page-size="4"
      style="margin: 5px; text-align:center; height: 55px;"
      @changePage="changePage"
    />
  </div>
</template>

<script>
import { getGroupProject, searchProject, modifyProject, newProject, deleteProject } from '@/api/project'
import Pagination from '@/components/Pagination/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      timeOptions: {
        shortcuts: [{
          text: '两小时内',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(end.getTime() - 2 * 60 * 60 * 1000)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '今天',
          onClick(picker) {
            const end = new Date()
            const start = new Date(new Date().setHours(0, 0, 0, 0))
            // start.setTime(start.getDay);
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '一周内',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(end.getTime() - 7 * 24 * 60 * 60 * 1000)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '一个月内',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(end.getTime() - 30 * 24 * 60 * 60 * 1000)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '六个月内',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(end.getTime() - 6 * 30 * 24 * 60 * 60 * 1000)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '一年内',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(end.getTime() - 365 * 24 * 60 * 60 * 1000)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      searchWord: '',
      searchDate: {
        start: '',
        end: '',
        date: ''
      },
      sorting: '创建时间顺序',
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
        content: ''
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
      tableData: []
    }
  },
  created() {
    this.loadProject()
  },
  methods: {
    sortProjects() {
      // console.log(this.tableData)
      switch (this.sorting) {
        case '创建时间顺序':
          this.tableData.sort(function(p1, p2) {
            var s1 = p1.createTime.replace('T', ' ').replace(/-/g, '/')
            var s2 = p2.createTime.replace('T', ' ').replace(/-/g, '/')
            var d1 = new Date(s1)
            var d2 = new Date(s2)
            return d2.getTime() - d1.getTime()
          })
          break
        case '创建时间倒序':
          this.tableData.sort(function(p1, p2) {
            var s1 = p1.createTime.replace('T', ' ').replace(/-/g, '/')
            var s2 = p2.createTime.replace('T', ' ').replace(/-/g, '/')
            var d1 = new Date(s1)
            var d2 = new Date(s2)
            return d1.getTime() - d2.getTime()
          })
          break
        case '项目名称顺序':
          this.tableData.sort(function(p1, p2) {
            return p1.projectName.localeCompare(p2.projectName)
          })
          break
        case '项目名称倒序':
          this.tableData.sort(function(p1, p2) {
            return p2.projectName.localeCompare(p1.projectName)
          })
          break
      }
    },
    resetForm() {
      this.searchWord = ''
      this.searchDate = {
        start: '',
        end: '',
        date: ''
      }
      this.loadProject()
    },
    submitSearchProject() {
      searchProject({
        groupId: 21,
        start: this.searchDate.date[0],
        end: this.searchDate.date[1],
        word: this.searchWord,
        deleted: 0
      }).then((res) => {
        this.tableData = res.data
      })
      this.sortProjects()
    },
    querySearch(query, cb) {
      var projects = this.tableData
      var results = query ? projects.filter(this.createFilter(query)) : projects
      console.log(results)
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (project) => {
        return (project.projectName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1 || project.projectDescription.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    autoCompleteSearchProject(project) {
      this.searchWord = project.projectName
    },
    switchSort(command) {
      this.sorting = command
      this.sortProjects()
    },
    loadProject() {
      getGroupProject({ // todo: groupId
        groupId: 21
      }).then((res) => {
        if (res.code !== 1) {
          this.$message.error(res.msg)
          this.loading = false
          return
        }
        this.tableData = res.data
        this.sortProjects()
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
      if (this.add_form.name === '' || this.add_form.content === '') {
        this.$message('项目名称及描述均不能为空')
      } else {
        this.dialog_add_visible = false
        var newPro = {
          groupId: 21,
          projectName: this.add_form.name,
          projectDescription: this.add_form.content
        }
        newProject(newPro).then((res) => {
          if (res.cdoe !== 1) {
            this.$error(res.msg)
            return
          }
        })
        this.$refs['add_form'].resetFields()
        this.resetForm()
      }
    },
    rmProject(project) {
      deleteProject({
        projectId: project.projectId,
        groupId: 21
      }).then((res) => {
        if (res.cdoe !== 1) {
          this.$error(res.msg)
          return
        }
      })
      this.resetForm()
    },
    editProject(project) {
      this.project_to_edit = project
      this.dialog_edit_visible = true
      this.edit_form.id = project.projectId
      this.edit_form.name = project.projectName
      this.edit_form.content = project.projectDescription
    },
    editCancel() {
      this.dialog_edit_visible = false
      this.$refs['edit_form'].resetFields()
    },
    editConfirm() {
      if (this.edit_form.name === '' || this.edit_form.content === '') {
        this.$message('项目名称及描述均不能为空')
      } else {
        this.project_to_edit.projectId = this.edit_form.id
        this.project_to_edit.projectName = this.edit_form.name
        this.project_to_edit.projectDescription = this.edit_form.content
        modifyProject(this.project_to_edit).then((res) => {
          if (res.code === 0) {
            this.$error('保存失败')
          }
          return
        })
        // alert(this.project_to_edit.projectId)
        // alert(this.project_to_edit.projectName)
        // alert(this.project_to_edit.projectDescription)
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
  clear: both;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}

/* .autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .des {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .des {
      color: #ddd;
    }
  }
} */
</style>

