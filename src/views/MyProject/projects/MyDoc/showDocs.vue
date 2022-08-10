<template>
  <div class="dashboard-container">
<!--    <div><el-button type="primary" @click="get()">获取全部文档</el-button></div>-->
    <doc class="doc" />
    <br>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import doc from '@/views/MyProject/projects/MyDoc/Docs.vue'
export default {
  name: 'DashBoard',
  components: { doc },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    get() {
    }

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.doc {
  margin: 3% 6%;
  background-color: #bfcbd9;
}
</style>
