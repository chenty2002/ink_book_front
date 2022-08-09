<template xmlns="">
  <div class="dashboard-container">
    <div class="dashboard-text">
      <template>
        <el-tabs tab-position="left" style="position: fixed; height: 87%; width: 80%">
          <el-tab-pane label="所有项目">
            <project class="project" />
          </el-tab-pane>
          <el-tab-pane label="回收站">
            回收站
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Project from '@/views/MyProject/project'

export default {
  name: 'DashBoard',
  components: { Project },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 20px;
  }
  &-text {
    font-size: 25px;
    line-height: 25px;
  }
}
.project {
  margin: 3% 6%;
  background-color: #d3dce6;
}
</style>
