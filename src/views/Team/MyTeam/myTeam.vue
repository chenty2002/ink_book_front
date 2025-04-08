<template>
  <div class="box">
    <!-- 邀请成员 -->
    <el-dialog :title="currentOperation === 'ADD' ? '新增团队' : '编辑团队'" :visible.sync="dialogVisible2" width="600px">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="团队名称" prop="name">
          <el-input v-model="ruleForm.groupName" placeholder="团队名称"/>
        </el-form-item>
        <el-form-item label="团队简介" prop="desc">
          <el-input v-model="ruleForm.groupProfile" placeholder="团队简介"/>
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

      <el-table :data="showtableData" border style="width: 100%">
        <el-table-column fixed prop="groupName" label="团队名称"/>
        <el-table-column prop="groupProfile" label="团队简介"/>
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
        <el-pagination
          :current-page="currentPage4"
          :page-sizes="pagesizes"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.tableData.length"
          @size-change="handleSizeChange"
          @current-change="handlecurrent"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  createGroup, deleteGroup, getGroupList
} from '@/api/group.js'

export default {
  name: 'MyTeam',
  data() {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      ruleForm: {
        groupId: '',
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
      // 当前点击的页码
      currentPage4: 1,
      // 用于展示的table数据，
      // 他是tableData分离出来的，因为这里需要区分起始位置和终止位置，把这一段分离给showtableData用于展示
      showtableData: [],
      // 用于存储全部的table数据
      tableData: [],
      // 用于一页显示多少行
      pagesize: 5,
      // 用于分页的数组，就是比如[10, 20, 30, 40]，10、20、30等参数就是可以选择每页显示多少行
      pagesizes: [10, 20, 30, 40],
      currentIndex: 0, currentOperation: ''
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // val参数就是显示多少行的参数
    handleSizeChange(val) {
      // 这个方法是用来改变每页显示多少行的，我们可以通过这个方法来改变pagesize的值，然后重新获取数据
      // 所以用于展示的table数据需要设置为空数组，即【】
      this.showtableData = []
      this.pagesize = val
      // 由于一页展示的行数改变，showtableData的长度=val
      for (let i = 0; i < val; i++) {
        this.showtableData.push(this.tableData[i])
      }
    },
    // 点击页数，改变展示的table数据
    // val参数就是点击的页数
    handlecurrent(val) {
      this.showtableData = []
      // 由于页数改变，showtableData的长度=val*pagesize
      const num = val * this.pagesize
      // 用于比较这是不是最后一页，如果是最后一页，就展示最后一页的数据
      const totals = this.tableData.length
      // totals/this.pagesize 采用整除方式计算总页数
      // totals%this.pagesize 采用求余方式计算是否最后一页是否能完整 以 页数的形式展示，如果这里》0表示没有除尽
      let head = parseInt(totals / this.pagesize);
      // 没有除尽则head+1
      (totals % this.pagesize) > 0 ? head++ : head
      // 判断当前页数是不是 head总页数，
      // 是则展示 tabledata总数据
      // 否则展示正常情况下的一段数据
      const index = (val === head ? (totals) : (num))
      // 这里判断是不是第一页，不是则val-1 是作为当前页码前一页，来作为起始位置
      // index是目标终止位置
      for (let i = val > 1 ? this.pagesize * (val - 1) : 0; i < index; i++) {
        this.showtableData.push(this.tableData[i])
      }
      this.currentPage4 = val
    },
    getTableData() {
      this.showtableData = []
      getGroupList(this.$store.state.user.userId).then(res => {
        this.tableData = res.data
        this.pagesizes = res.data.length < 100 ? [4, 10] : [10, 20, 30, 40]
        this.pagesize = res.data.length < 100 ? 4 : 10
        for (let i = 0; i < this.pagesize; i++) {
          this.showtableData.push(res.data[i])
        }
      })
    },

    handleDetail(item) {
      this.$router.push('/teamDetail')
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
      this.ruleForm.groupId = this.$store.state.user.userId
      this.$confirm('确认删除该团队?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroup(this.$store.state.user.userId, this.tableData[scope.$index].id).then(res => {
          this.getTableData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitForm() {
      this.ruleForm.userId = this.$store.state.user.userId
      createGroup(this.ruleForm).then((res) => {
        // if (res === 'success') {
        this.tableData.push(res.data)
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
