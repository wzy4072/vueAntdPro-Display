<template>
  <div class="custom-columns-tool">
    <a-icon type="setting" class="tool-icon-btn" :class="{ onfocus: visable }" @click="toggleDisplay(!visable)" />
    <div class="tool-win" :class="{ onfocus: visable, start: animaStart, end: !animaStart }">
      <a-row class="tool-win-head">
        <a-checkbox
          @change="colsChangeAll"
          :indeterminate="checkedKeys.length > 0 && checkedKeys.length !== columns.length"
          :checked="checkedKeys.length === columns.length"
        >
          列展示
        </a-checkbox>
        <a-button type="link" size="small" @click="restColumns" style="float: right"> 重置 </a-button>
      </a-row>
      <a-checkbox-group v-bind:value="checkedKeys">
        <draggable class="list-group" tag="ul" v-model="dynamicColumns" v-bind="dragOptions" @end="onDragEnd">
          <transition-group type="transition" :name="'flip-list'">
            <li
              class="list-group-item col-tool-check-item"
              v-for="(col, cIndex) in dynamicColumns"
              :key="col.dataIndex || col.title"
            >
              <a-checkbox :value="col.dataIndex || col.title" @change="checkChange"> {{ col.title }} </a-checkbox>
              <a-icon type="vertical-align-top" @click="sortItem(cIndex, 0)" />
              <a-icon type="vertical-align-bottom" @click="sortItem(cIndex, columns.length)" />
            </li>
          </transition-group>
        </draggable>
      </a-checkbox-group>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import cloneDeep from 'lodash.clonedeep'
import addEventListener from 'ant-design-vue/es/vc-util/Dom/addEventListener'
import contains from 'ant-design-vue/es/vc-util/Dom/contains'

const findDOMNode = (instance) => {
  let node = instance && (instance.$el || instance)
  while (node && !node.tagName) {
    node = node.nextSibling
  }
  return node
}

const message = ['vue.draggable', 'draggable', 'component', 'for', 'vue.js 2.0', 'based', 'on', 'Sortablejs']
export default {
  components: {
    draggable,
  },
  props: ['columns', 'checkedKeys'],

  data() {
    return {
      list: message.map((name, index) => {
        return { name, order: index + 1, fixed: false }
      }),
      isDragging: false,
      dynamicColumns: [],
      visable: false,
      animaStart: true,
      clickOutsideHandler: null,
    }
  },
  watch: {
    columns: {
      handler(nVal) {
        console.log('columns 改变了', nVal.map((item) => item.title).join('-'))
        this.dynamicColumns = cloneDeep(nVal)
      },
      immediate: true,
    },
    visable(nVal) {
      if (nVal) {
        this.clickOutsideHandler = addEventListener(window.document, 'mousedown', this.onDocumentClick)
      } else {
        this.clickOutsideHandler?.remove()
      }
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        ghostClass: 'ghost',
      }
    },
  },
  methods: {
    onDocumentClick(event) {
      const target = event.target
      const root = findDOMNode(this)
      if (!contains(root, target)) {
        this.close()
      }
    },
    toggleDisplay(v) {
      if (this.visable === false) {
        this.visable = true
        setTimeout(() => {
          this.animaStart = false
        })
      } else {
        this.animaStart = true
        setTimeout(() => {
          this.visable = false
        })
      }
    },
    close() {
      this.toggleDisplay(false)
    },
    onDragEnd({ to, from, item, clone, oldIndex, newIndex }) {
      this.$emit('updatecolumns', this.dynamicColumns)
    },
    colsChangeAll(e) {
      const keys = e.target.checked ? this.columns.map((i) => i.dataIndex || i.title) : []
      this.$emit('updatecheckedKeys', keys)
    },
    checkChange({ target: { value, checked } }) {
      const newKeys = new Set(this.checkedKeys)
      checked ? newKeys.add(value) : newKeys.delete(value)
      this.$emit('updatecheckedKeys', [...newKeys])
    },
    sortItem(from, to) {
      const copyColumns = [...this.columns]
      copyColumns.splice(to, 0, ...copyColumns.splice(from, 1))
      this.$emit('updatecolumns', copyColumns)
    },
    restColumns() {
      this.$emit('resetColumns')
    },
  },
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/lib/style/themes/default';
// @primary-color: #ccc;
.custom-columns-tool {
  background: #fff;
  // overflow: hidden;
  position: relative;
  display: inline-block;
  z-index: 9999;
  &:hover {
    color: @primary-5;
  }
  .tool-win {
    position: absolute;
    left: 0;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: none;
    animation: all 500;
    top: 26;
    overflow: hidden;
    &.start {
      height: 0;
    }
    &.end {
      height: auto;
    }
    &.onfocus {
      display: block;
    }
    .tool-win-head {
      padding: 8px 12px;
      border-bottom: 1px solid #efefef;
    }
  }
}

i.tool-icon-btn.anticon.anticon-setting {
  font-size: 20px;
}
i.tool-icon-btn.anticon.anticon-setting.onfocus {
  color: @primary-color;
}

.col-tool-check-item {
  position: relative;
  min-width: 200px;
  padding: 4px 8px;
}
.col-tool-check-item i {
  display: none;
  position: absolute;
  right: 6px;
  cursor: pointer;
  top: 8px;
}
.col-tool-check-item i.anticon-vertical-align-top {
  right: 30px;
}
.col-tool-check-item:hover {
  background-color: #efefef;
}
.col-tool-check-item:hover i {
  display: inline;
  font-size: 16px;
}
.col-tool-check-item i:hover {
  color: @primary-color;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
  padding-left: 4px;
  margin-bottom: 4px;
  margin-right: 4px;
  margin-top: 4px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
</style>