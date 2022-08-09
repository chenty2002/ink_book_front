<template>
  <div class="box">
    <!-- 邀请成员 -->
    <el-dialog :title="currentOperation == 'ADD' ? '新增团队' : '编辑团队'" :visible.sync="dialogVisible2" width="600px">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="团队名称" prop="name">
          <el-input v-model="ruleForm.groupName" placeholder="团队名称" />
        </el-form-item>
        <el-form-item label="团队简介" prop="desc">
          <el-input v-model="ruleForm.groupProfile" placeholder="团队简介" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">关闭</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </el-dialog>

    <el-card>
      <div class="operationBox">
        <el-button icon="el-icon-plus" type="primary" @click="dialogVisible2 = true">新建团队</el-button>
      </div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed prop="name" label="团队名称" />
        <el-table-column prop="desc" label="团队简介" />
        <el-table-column fixed="right" label="操作" width="245">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleDetail(scope.row)">管理团队</el-button>
            <el-button type="success" size="small" @click="handleEdit(scope)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleRemove(scope)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
<!--      这块绑定的参数没有定义-->
      <div class="block">
        <el-pagination :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100"
          layout="total, sizes, prev, pager, next, jumper" :total="400" @size-change="handleSizeChange"
          @current-change="" />
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  createGroup
} from '@/api/group.js'
import { mapState } from 'vuex'
export default {
  name: 'MyTeam',
  data() {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      ruleForm: {
        userId:'',
        groupName: '',
        groupProfile: ''
      },
      rules: {
        groupName: [
          { required: true, message: '请输入团队名称', trigger: 'change' }
        ],
        groupProfile: [
          { required: true, message: '请输入团队简介', trigger: 'change' }
        ]
      },
      tableData: [],
      currentOperation: 'ADD',
      currentIndex: 0
    }
  },userId:'',
  computed: mapState([
    // 映射 this.userId 为 store.state.userId
    'userId'
  ]),
  methods: {
    handleDetail(item) {
      this.$router.push('/team/teamDetail')
    },
    handleEdit(scope) {
      this.currentOperation = 'EDIT'
      this.dialogVisible2 = true
      this.currentIndex = scope.$index
      this.ruleForm = {
        name: this.tableData[scope.$index].name,
        desc: this.tableData[scope.$index].desc
      }
    },
    handleRemove(scope) {
      console.log(scope.$index)
      this.tableData.splice(scope.$index, 1)
      this.$message.success('移除成功！')
    },
    submitForm() {

      this.ruleForm.userId=this.$store.state.user.userId;
      createGroup(this.ruleForm).then((res) => {
        // if (res === 'success') {
        console.log(res)
        // this.$message({
        //     message: '修改菜单成功！',
        //     type: 'success'
        //   })
        // }
      })

      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.currentOperation === 'ADD') {
            this.tableData.push(this.ruleForm)
            this.$message.success('添加成功！')
          } else {
            this.tableData[this.currentIndex] = this.ruleForm
            // eslint-disable-next-line no-self-assign
            this.tableData = this.tableData
            this.$message.success('编辑成功！')
          }

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
@import "./myTeam.scss";
</style>
