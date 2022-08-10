<template>
  <div className="dashboard-container">
    <div className="dashboard-text">用户名: {{ name }}</div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'DashBoard',
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
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
