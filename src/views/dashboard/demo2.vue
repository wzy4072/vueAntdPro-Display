<template>
  <div class="cols-list">
    <a-checkbox-group v-bind:value="checkedKeys" style="width: 100%">
      <!-- 左侧冻结列 -->
      <draggable class="list-group" tag="ul" v-model="leftColumns" v-bind="dragOptions" group="columns" :move="onMove">
        <transition-group type="transition" class="group-wrap">
          <li class="list-group-item" v-for="colItem in leftColumns" :key="colItem.dataIndex || colItem.title">
            <a-checkbox
              :disabled="colItem.requred"
              :value="colItem.dataIndex || colItem.title"
              @change="checkChange"
            ></a-checkbox>
            <span class="title drag-ele">
              <span class="title-bar" :style="{ width: `${colItem.titleWidth}px` }">{{ colItem.title }}</span>
            </span>
            <span class="text-muted">{{ colItem.requred && '(必选)' }}</span>
            <span class="wid-item">
              宽度
              <span
                class="wid-item-blur"
                @click="
                  (e) => {
                    focusIpt(e, colItem)
                  }
                "
                v-show="!colItem.isEdit"
                >{{ colItem.titleWidth }}</span
              >
              <a-input-number
                v-show="colItem.isEdit"
                @blur="colItem.isEdit = false"
                size="small"
                class="wid-ipt"
                addon-before=""
                addon-after=""
                v-model="colItem.titleWidth"
                :min="1"
                :max="500"
              />
              px</span
            >
          </li>
        </transition-group>
      </draggable>
      <div class="def-item" v-if="leftColumns.length === 0">左侧冻结列请拖动至这里</div>
      <draggable
        class="list-group"
        tag="ul"
        v-model="scrollColumns"
        v-bind="dragOptions"
        group="columns"
        :move="onMove"
      >
        <transition-group type="transition" class="group-wrap">
          <li class="list-group-item" v-for="colItem in scrollColumns" :key="colItem.dataIndex || colItem.title">
            <a-checkbox
              :disabled="colItem.requred"
              :value="colItem.dataIndex || colItem.title"
              @change="checkChange"
            ></a-checkbox>
            <span class="title drag-ele">
              <span class="title-bar" :style="{ width: `${colItem.titleWidth}px` }">{{ colItem.title }}</span>
            </span>
            <span class="text-muted">{{ colItem.requred && '(必选)' }}</span>
            <span class="wid-item">
              宽度
              <span
                class="wid-item-blur"
                @click="
                  (e) => {
                    focusIpt(e, colItem)
                  }
                "
                v-show="!colItem.isEdit"
                >{{ colItem.titleWidth }}</span
              >
              <a-input-number
                v-show="colItem.isEdit"
                @blur="colItem.isEdit = false"
                size="small"
                class="wid-ipt"
                addon-before=""
                addon-after=""
                v-model="colItem.titleWidth"
                :min="1"
                :max="500"
              />
              px</span
            >
          </li>
        </transition-group>
      </draggable>
      <!-- 右侧冻结列 -->
      <draggable class="list-group" tag="ul" v-model="rightColumns" v-bind="dragOptions" group="columns" :move="onMove">
        <transition-group type="transition" class="group-wrap">
          <li class="list-group-item" v-for="colItem in rightColumns" :key="colItem.dataIndex || colItem.title">
            <a-checkbox
              :disabled="colItem.requred"
              :value="colItem.dataIndex || colItem.title"
              @change="checkChange"
            ></a-checkbox>
            <span class="title drag-ele">
              <span class="title-bar" :style="{ width: `${colItem.titleWidth}px` }">{{ colItem.title }}</span>
            </span>
            <span class="text-muted">{{ colItem.requred && '(必选)' }}</span>
            <span class="wid-item">
              宽度
              <span
                class="wid-item-blur"
                @click="
                  (e) => {
                    focusIpt(e, colItem)
                  }
                "
                v-show="!colItem.isEdit"
                >{{ colItem.titleWidth }}</span
              >
              <a-input-number
                v-show="colItem.isEdit"
                @blur="colItem.isEdit = false"
                size="small"
                class="wid-ipt"
                addon-before=""
                addon-after=""
                v-model="colItem.titleWidth"
                :min="1"
                :max="500"
              />
              px</span
            >
          </li>
        </transition-group>
      </draggable>
      <div class="def-item" v-if="rightColumns.length === 0">右侧冻结列请拖动至这里</div>

      <hr />
      scrollColumns {{ JSON.stringify(scrollColumns) }}
      <hr />
      leftColumns {{ JSON.stringify(leftColumns) }}
      <hr />
      rightColumns {{ JSON.stringify(rightColumns) }}
    </a-checkbox-group>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

const scrollColumns = [
  { dataIndex: 'taskName', title: '任务名称', titleWidth: 50, requred: true, isEdit: false },
  { dataIndex: 'name2', title: '预计', titleWidth: 100, isEdit: false },
  { dataIndex: 'name3', title: '消耗', titleWidth: 50, isEdit: false },
  { dataIndex: 'name4', title: '剩余', titleWidth: 80, isEdit: false },
  { dataIndex: 'name5', title: ' %', titleWidth: 50, isEdit: false },
  { dataIndex: 'name6', title: '截止', titleWidth: 80, isEdit: false, requred: true },
  { dataIndex: 'name7', title: '创建', titleWidth: 50, isEdit: false },
  { dataIndex: 'name8', title: '创建日期', titleWidth: 50, isEdit: false },
  { dataIndex: 'name11', title: '指派给', titleWidth: 50, isEdit: false },
  { dataIndex: 'name12', title: '指派日期', titleWidth: 50, isEdit: false },
  { dataIndex: 'action', title: '操作列', titleWidth: 50, requred: true, isEdit: false },
]
export default {
  name: '',
  components: {
    draggable,
  },
  data() {
    return {
      leftColumns: [],
      rightColumns: [],
      scrollColumns: scrollColumns,
      isDragging: false,
      delayedDragging: false,
      dragOptions: {
        animation: 500,
        handle: '.drag-ele',
        disabled: false,
        ghostClass: 'ghost',
        dragClass: 'drag-item',
      },
      checkedKeys: ['name6', 'action', 'taskName'],
    }
  },
  computed: {
    // dragOptions() {
    //   return {
    //     animation: 0,
    //     group: 'description',
    //     disabled: !this.editable,
    //     ghostClass: 'ghost',
    //   }
    // },
    // listString() {
    //   return JSON.stringify(this.list, null, 2)
    // },
    // list2String() {
    //   return JSON.stringify(this.list2, null, 2)
    // },
  },
  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true
        return
      }
      this.$nextTick(() => {
        this.delayedDragging = false
      })
    },
  },
  methods: {
    orderList() {
      this.list = this.list.sort((one, two) => {
        return one.order - two.order
      })
    },
    focusIpt(e, colItem) {
      colItem.isEdit = true
      this.$nextTick(() => {
        // debugger
        e.target.nextElementSibling.getElementsByTagName('input')[0]?.focus()
      })
    },
    onMove({ relatedContext, draggedContext }) {
      return 1
      // const relatedElement = relatedContext.element
      // const draggedElement = draggedContext.element
      // return 1
      // return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    },
    onDragEnd({ to, from, item, clone, oldIndex, newIndex }) {
      // this.$emit('updatecolumns', this.dynamicColumns)
    },
    checkChange({ target: { value, checked } }) {
      const newKeys = new Set(this.checkedKeys)
      checked ? newKeys.add(value) : newKeys.delete(value)
      this.checkedKeys = [...newKeys]
      // this.$emit('updatecheckedKeys', [...newKeys])
    },
    sortItem(from, to) {
      const copyColumns = [...this.columns]
      copyColumns.splice(to, 0, ...copyColumns.splice(from, 1))
      this.columns = [...copyColumns]

      // this.$emit('updatecolumns', copyColumns)
    },
  },
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/lib/style/themes/default';

// .drag-item {
//   background-color: yellow;
//   background-image: none;
//   opacity: 0.8;
// }
.def-item {
  border: 1px solid #ccc;
  border-bottom: none;
  margin-bottom: -40px;
  height: 29px;
  padding-top: 2px;
  padding-left: 25px;
  position: relative;
  top: -42px;
}

.cols-list {
  width: 750px;
  background-color: #fff;
  .list-group {
    padding: 0;

    .group-wrap {
      margin: 8px 0;
      min-height: 29px;
      // background: #ccc;
      display: block;
      border-bottom: 1px solid @input-border-color;
    }

    .list-group-item {
      padding: 6px 8px;
      border: 1px solid @input-border-color;
      border-bottom: none;
      height: 36px;
      &:hover {
        background-color: @table-row-hover-bg;
      }
      .wid-item {
        color: #ccc;
        .wid-item-blur {
          cursor: pointer;
          display: inline-block;
          width: 60px;
          border-radius: 2px;
          height: 24px;
          line-height: 24px;
          color: @input-border-color;
          padding-left: 7px;
          border: 1px solid transparent;
          &:hover {
            border: 1px solid @input-border-color;
            background-color: #fff;
          }
        }
        .wid-ipt {
          width: 60px;
        }
      }
      .text-muted {
        display: inline-block;
        width: 80px;
        color: @input-border-color;
      }
      .title.drag-ele:hover {
        cursor: move;
      }
      .title {
        display: inline-block;
        width: 500px;
        .title-bar {
          white-space: nowrap;
          display: inline-block;
          width: 300px;
          background: #f5f5f5;
          border-left: 1px solid #fafafa;
          border-right: 1px solid #fafafa;
          padding-left: 6px;
          margin-left: 6px;
        }
      }
    }
  }
}
/* 
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
  margin: 2px 0;
}

.list-group-item i {
  cursor: pointer;
}
.move-span {
  display: inline-block;
  min-width: 300px;
  background: limegreen;
}
.drag-item {
  background-color: #ccc;
} */
</style>
