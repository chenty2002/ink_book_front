<template>
  <div>
    <el-form :inline="true" style="padding: 30px">
      <el-form-item label="文档标题" style="margin-left: 25px">
        <el-input id="title" v-model="title" placeholder="文档标题" style="width: 500px"></el-input>
      </el-form-item>
      <el-card style="height: 490px;">
        <quill-editor ref="myQuillEditor" v-model="content" style="height:405px" :options="editorOption" />
      </el-card>
    </el-form>
  </div>
</template>

<script>
import {
  quillEditor
} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      title: '',
      docContent: '',
      editorOption: {}
    }
  },
  methods: {
  }
}

</script>

<style scoped>
</style>
