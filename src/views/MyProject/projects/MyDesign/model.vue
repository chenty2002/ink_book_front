<template>
  <v-container class="workflow-container" grid-list-xl fluid>
    <div class="super-flow-demo">
      <div class="node-container">
        <div
          class="node-item"
          v-for="(item, index) in nodeItemList"
          :key="index"
          @mousedown="evt => nodeItemMouseDown(evt, item.value)"
        >
          {{ item.label }}
        </div>
      </div>
      <div
        id="a"
        class="flow-container"
        ref="flowContainer"
      >
        <super-flow
          id="a-super"
          class="super-flow"
          ref="superFlow"
          :graph-menu="graphMenu"
          :node-menu="nodeMenu"
          :link-menu="linkMenu"
          :link-desc="linkDesc"
          :node-list="nodeList"
          :link-list="linkList"
        >
          <template v-slot:node="{meta}">
            <div
              :class="meta.type? `flow-node-${meta.type}`: ''"
              class="flow-node ellipsis"
            >
              <div class="node-content" :title="meta.name">{{ meta.name }}</div>
            </div>
          </template>
        </super-flow>
      </div>
      <br>
      <el-button circle style="margin: 0 20px" @click="saveImage()">预览</el-button>
      <img class="clearfix" :src="htmlURL" alt="" style="max-height: 100px; max-width: 100px; border: 1px solid #222222">
    </div>

    <el-dialog
      :title="drawerConf.title"
      :visible.sync="drawerConf.visible"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form
        @keyup.native.enter="settingSubmit"
        @submit.native.prevent
        v-show="drawerConf.type === drawerType.node"
        ref="nodeSetting"
        :model="nodeSetting"
      >
        <el-form-item
          label="板块"
          prop="name"
        >
          <el-input
            v-model="nodeSetting.name"
            maxlength="30"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="附加信息"
          prop="desc"
        >
          <el-input
            v-model="nodeSetting.desc"
            maxlength="30"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <el-form
        @keyup.native.enter="settingSubmit"
        @submit.native.prevent
        v-show="drawerConf.type === drawerType.link"
        ref="linkSetting"
        :model="linkSetting"
      >
        <el-form-item
          label="link description"
          prop="desc"
        >
          <el-input
            v-model="linkSetting.desc"
            placeholder="Please enter a link description"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="drawerConf.cancel">
          取消
        </el-button>
        <el-button type="primary" @click="settingSubmit">
          确定
        </el-button>
      </span>
    </el-dialog>
  </v-container>
</template>

<script>
import SuperFlow from 'vue-super-flow'
import 'vue-super-flow/lib/index.css'
import html2canvas from 'html2canvas'

const drawerType = {
  node: 0,
  link: 1
}

export default {
  components: {
    SuperFlow
  },
  data() {
    return {
      htmlURL: '',
      drawerType,
      drawerConf: {
        title: '',
        visible: false,
        type: null,
        info: null,
        open: (type, info) => {
          const conf = this.drawerConf
          conf.visible = true
          conf.type = type
          conf.info = info
          if (conf.type === drawerType.node) {
            conf.title = 'NODE'
            if (this.$refs.nodeSetting) this.$refs.nodeSetting.resetFields()
            this.$set(this.nodeSetting, 'name', info.meta.name)
            this.$set(this.nodeSetting, 'desc', info.meta.desc)
          } else {
            conf.title = 'LINK'
            if (this.$refs.linkSetting) this.$refs.linkSetting.resetFields()
            this.$set(this.linkSetting, 'desc', info.meta ? info.meta.desc : '')
          }
        },
        cancel: () => {
          this.drawerConf.visible = false
          if (this.drawerConf.type === drawerType.node) {
            this.$refs.nodeSetting.clearValidate()
          } else {
            this.$refs.linkSetting.clearValidate()
          }
        }
      },
      linkSetting: {
        desc: ''
      },
      nodeSetting: {
        name: '',
        desc: ''
      },
      nodeItemList: [
        {
          label: '头部区域',
          value: () => ({
            width: 400,
            height: 40,
            meta: {
              label: '头部区域',
              name: '头部区域',
              type: 'start'
            }
          })
        },
        {
          label: '菜单导航区域',
          value: () => ({
            width: 400,
            height: 30,
            meta: {
              label: '菜单导航区域',
              name: '菜单导航区域',
              type: 'process'
            }
          })
        },
        {
          label: '内容区域1',
          value: () => ({
            width: 400,
            height: 80,
            meta: {
              label: '内容区域1',
              name: '内容区域（大）',
              type: 'if'
            }
          })
        },
        {
          label: '内容区域2',
          value: () => ({
            width: 200,
            height: 40,
            meta: {
              label: '内容区域2',
              name: '内容区域（小）',
              type: 'end'
            }
          })
        },
        {
          label: '底部区域',
          value: () => ({
            width: 400,
            height: 40,
            meta: {
              label: '底部区域',
              name: '底部区域',
              type: 'icon'
            }
          })
        },
        {
          label: '文字说明',
          value: () => ({
            width: 400,
            height: 80,
            meta: {
              label: '文字说明',
              name: '',
              type: 'explain'
            }
          })
        }
      ],
      graphMenu: [
        {
          label: 'select all',
          selected: graph => {
            graph.selectAll()
          }
        }
      ],
      nodeMenu: [
        [
          {
            label: 'delete',
            selected: node => {
              node.remove()
            }
          },
          {
            label: 'edit',
            selected: node => {
              this.drawerConf.open(drawerType.node, node)
            }
          }
        ]
      ],
      linkMenu: [
        [
          {
            label: 'delete',
            selected: link => {
              link.remove()
            }
          },
          {
            label: 'edit',
            selected: link => {
              this.drawerConf.open(drawerType.link, link)
            }
          }
        ]
      ],
      dragConf: {
        isDown: false,
        isMove: false,
        offsetTop: 0,
        offsetLeft: 0,
        clientX: 0,
        clientY: 0,
        ele: null,
        info: null
      }
    }
  },
  mounted() {
    document.addEventListener('mousemove', this.docMousemove)
    document.addEventListener('mouseup', this.docMouseup)
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('mousemove', this.docMousemove)
      document.removeEventListener('mouseup', this.docMouseup)
    })
  },
  methods: {
    dataURLToBlob(dataurl) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    saveImage() {
      // 截图的关键代码
      const targetDom = document.getElementById('a-super') // 需要截图的div
      const domScrollHeight = targetDom.scrollHeight // 获取滚动的高度
      const domScrollWidth = targetDom.scrollWidth // 获取滚动的宽度
      targetDom.setAttribute('style', `height: ${domScrollHeight}px; width: ${domScrollWidth}px;`)
      html2canvas(targetDom, {
        allowTaint: true,
        taintTest: false
      }).then(canvas => {
        targetDom.setAttribute('style', `height: 100%; width: 100%`) // 截图完成后把尺寸恢复
        this.htmlURL = canvas.toDataURL('image/png')
        console.log(this.htmlURL)
      })
    },
    saveFlow() {
      this.nodeList = this.$refs.superFlow.toJSON().nodeList
      this.linkList = this.$refs.superFlow.toJSON().linkList
      console.log(this.nodeList)
      console.log(this.linkList)
    },
    linkDesc(link) {
      return link.meta ? link.meta.desc : ''
    },
    settingSubmit() {
      const conf = this.drawerConf
      if (this.drawerConf.type === drawerType.node) {
        if (!conf.info.meta) conf.info.meta = {}
        Object.keys(this.nodeSetting).forEach(key => {
          this.$set(conf.info.meta, key, this.nodeSetting[key])
        })
        this.$refs.nodeSetting.resetFields()
      } else {
        if (!conf.info.meta) conf.info.meta = {}
        Object.keys(this.linkSetting).forEach(key => {
          this.$set(conf.info.meta, key, this.linkSetting[key])
        })
        this.$refs.linkSetting.resetFields()
      }
      conf.visible = false
    },
    docMousemove({ clientX, clientY }) {
      const conf = this.dragConf
      if (conf.isMove) {
        conf.ele.style.top = clientY - conf.offsetTop + 'px'
        conf.ele.style.left = clientX - conf.offsetLeft + 'px'
      } else if (conf.isDown) {
        // 鼠标移动量大于 5 时 移动状态生效
        conf.isMove = Math.abs(clientX - conf.clientX) > 5 || Math.abs(clientY - conf.clientY) > 5
      }
    },
    docMouseup({ clientX, clientY }) {
      const conf = this.dragConf
      conf.isDown = false

      if (conf.isMove) {
        const {
          top,
          right,
          bottom,
          left
        } = this.$refs.flowContainer.getBoundingClientRect()

        // 判断鼠标是否进入 flow container
        if (
          clientX > left && clientX < right && clientY > top && clientY < bottom
        ) {
          // 获取拖动元素左上角相对 super flow 区域原点坐标
          const coordinate = this.$refs.superFlow.getMouseCoordinate(
            clientX - conf.offsetLeft,
            clientY - conf.offsetTop
          )
          // 添加节点
          this.$refs.superFlow.addNode({
            coordinate,
            ...conf.info
          })
        }
        conf.isMove = false
      }
      if (conf.ele) {
        conf.ele.remove()
        conf.ele = null
      }
    },
    nodeItemMouseDown(evt, infoFun) {
      const {
        clientX,
        clientY,
        currentTarget
      } = evt

      const {
        top,
        left
      } = evt.currentTarget.getBoundingClientRect()

      const conf = this.dragConf
      const ele = currentTarget.cloneNode(true)

      Object.assign(this.dragConf, {
        offsetLeft: clientX - left,
        offsetTop: clientY - top,
        clientX: clientX,
        clientY: clientY,
        info: infoFun(),
        ele,
        isDown: true
      })

      ele.style.position = 'fixed'
      ele.style.margin = '0'
      ele.style.top = clientY - conf.offsetTop + 'px'
      ele.style.left = clientX - conf.offsetLeft + 'px'

      this.$el.appendChild(this.dragConf.ele)
    }
  }
}
</script>

<style lang="scss" scoped>
.workflow-container {
  width: calc(100vw - 80px);
  height: calc(100vh - 128px);
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  margin: 32px;
  padding: 0;
  background: #fff;
  overflow: hidden;
}

.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
}

.super-flow-demo {
  position: relative;
  margin: 0 20px;
  background: #f5f5f5;
  height: calc(100vh - 168px);

  .node-container {
    width: 100%;
    height: 50px;
    background-color: #FFFFFF;

    .node-item {
      display: inline-block;
      font-size: 14px;
      height: 30px;
      width: 120px;
      margin: 0 20px 0 0;
      background: #FFFFFF;
      line-height: 30px;
      box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      user-select: none; // 防止鼠标左键拖动选中页面的文字
      text-align: center;

      &:hover {
        box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4);
      }
    }
  }

  .flow-container {
    width: 100%;
    height: calc(100% - 50px);

    .super-flow {
      overflow: auto;
    }
  }

  .super-flow__node {
    .flow-node {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      line-height: 40px;
      padding: 0 6px;
      font-size: 16px;
      color: #fff;
      font-weight: bold;

      .node-content {
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  /*开始节点样式*/
  .ellipsis.flow-node-start {
    background: #4157d5;
    border: 1px solid #b4b4b4;
  }

  /*流程节点样式*/
  .ellipsis.flow-node-process {
    position: relative;
    background: #30B95C;
    border: 1px solid #b4b4b4;
  }

  /*条件节点样式*/
  .ellipsis.flow-node-if {
    width: 400px;
    height: 120px;
    position: relative;
    top: 24px;
    left: 24px;
    background: #c2e114;
    border: 1px solid #b4b4b4;
    transform: rotateZ(0deg); //倾斜
    .node-content {
      position: absolute;
      top: 50%;
      left: 10px;
      width: 100%;
      transform: rotateZ(0deg) translateY(-50%);
    }
  }

  /*结束节点样式*/
  .ellipsis.flow-node-end {
    background: rgb(112, 240, 95);
    border: 1px solid #b4b4b4;
  }

  .ellipsis.flow-node-icon {
    background: rgb(16, 231, 27);
    border: 1px solid #b4b4b4;
  }

  .ellipsis.flow-node-explain {
    background: rgb(246, 250, 246);
    border: 1px solid #100202;

    .node-content {
      position: absolute;
      width: 100%;
      color: #100202;
    }
  }
}
</style>
<style>
.super-flow-demo .super-flow__node {
  border: none;
  background: none;
  box-shadow: none;
}
</style>

