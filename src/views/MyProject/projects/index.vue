<template xmlns="">
  <div class="project-container">
    <project class="project" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import project from '@/views/MyProject/projects/project'

export default {
  name: 'Project',
  components: { project },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.project-container {
  background-color: #d3dce6;
  position: absolute;
  height: 100%;
  width: 100%;

  .project {
    margin: 2% 3%;
  }
}

</style>
