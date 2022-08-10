<template>
  <div class="box">
    <!-- 邀请成员 -->
    <el-dialog title="选择成员" :visible.sync="dialogVisible2" width="600px">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="人员选择" prop="person">
          <el-select
            v-model="ruleForm.person"
            multiple
            placeholder="请选择人员"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">关闭</el-button>
        <el-button type="primary" @click="submitForm">立即邀请</el-button>
      </span>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog :visible.sync="dialogVisible" width="600px">
      <el-descriptions :column="2" title="个人详情">
        <el-descriptions-item label="昵称">{{
          currentItem.nickname
        }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{
          currentItem.realName
        }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{
          currentItem.email
        }}</el-descriptions-item>
        <el-descriptions-item label="身份">
          <el-tag
            effect="dark"
            :type="currentItem.role == '管理' ? 'success' : 'primary'"
            size="small"
          >{{ currentItem.role }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-card style="margin-bottom: 20px">
      <div class="teamDetailBox">
        <div class="teamDetailLeft">
          <el-avatar
            shape="square"
            :size="100"
            :fit="fit"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          />
        </div>
        <div class="teamDetailRight">
          <h2>xxx团队</h2>
          <div class="teamDetailRightDesc">
            xxx团队简介团队简介团队简介团队简介团队简介
            团队简介团队简介团队简介团队简介团队简介
            团队简介团队简介团队简介团队简介团队简介
            团队简介团队简介团队简介团队简介团队简介
          </div>
        </div>
      </div>
    </el-card>
    <el-card>
      <div class="operationBox">
        <el-button icon="el-icon-plus" type="primary" @click="dialogVisible2 = true">邀请成员</el-button>
      </div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed prop="nickname" label="昵称" />
        <el-table-column prop="realName" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="身份">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type="scope.row.role == '管理' ? 'success' : 'primary'"
              size="small"
            >{{ scope.row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="245">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleDetail(scope.row)"
            >详情</el-button>
            <el-button
              v-if="scope.row.role == '成员'"
              type="success"
              size="small"
              @click="handleSeting(scope)"
            >设为管理员</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleRemove(scope)"
            >移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :current-page="currentPage4"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total=0
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'MyTeam',
  data() {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      ruleForm: {
        person: ''
      },
      rules: {
        person: [{ required: true, message: '请选择人员', trigger: 'change' }]
      },
      options: [],
      tableData: [],
      currentItem: {}
    }
  },
  methods: {
    handleDetail(item) {
      this.currentItem = item
      this.dialogVisible = true
    },
    handleSeting(scope) {
      const deepData = [...this.tableData]
      deepData[scope.$index].role = '管理'
      this.$message.success('设置成功！')
    },
    handleRemove(scope) {
      console.log(scope.$index)
      this.tableData.splice(scope.$index, 1)
      this.$message.success('移除成功！')
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm.person)
          this.ruleForm.person.forEach((element) => {
            this.tableData.push(this.options[element])
          })
          this.$message.success('邀请成功！')
          this.dialogVisible2 = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./teamDetail.scss";
</style>
