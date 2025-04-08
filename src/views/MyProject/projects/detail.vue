<template xmlns="">
  <div>
    <el-page-header class="pageHeader" title="返回所有项目" :content="'项目：' + project.name" @back="goBack"/>
    <div class="detail-container">
      <el-tabs v-model="activeName" class="tabs" type="card" @tab-click="handleClick">
        <el-tab-pane label="原型设计" name="first">
          <Designs />
        </el-tab-pane>
        <el-tab-pane label="UML图绘制" name="second">
          UML图
        </el-tab-pane>
        <el-tab-pane label="项目文档" name="third">
          <Docs />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Designs from '@/views/MyProject/projects/MyDesign/Designs'
import Docs from '@/views/MyProject/projects/MyDoc/Doc'

export default {
  name: 'Detail',
  components: { Designs, Docs },
  data() {
    return {
      activeName: 'first',
      project: {
        id: '',
        name: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.project.id = this.$route.query.projectId
    this.project.name = this.$route.query.projectName
  },
  methods: {
    goBack() {
      this.$router.push(`/project/all`)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.pageHeader {
  height: 50px;
  padding: 13px;
  background-color: #d3dce6;
}

.detail-container {
  position: relative;
  height: 100%;
  width: 100%;

  .tabs {
    height: 100%;
    width: 100%;
  }
}

</style>
