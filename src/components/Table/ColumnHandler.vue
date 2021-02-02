<template>
  <div class="custom-columns-tool">
    <a-checkbox-group v-bind:value="checkedKeys">
      <draggable class="list-group" tag="ul" :value="columns" v-bind="dragOptions" @end="onDragEnd">
        <transition-group type="transition" :name="'flip-list'">
          <li
            class="list-group-item col-tool-check-item"
            v-for="(col, cIndex) in columns"
            :key="cIndex + (col.dataIndex || col.title)"
          >
            <a-checkbox :value="col.dataIndex || col.title" @change="checkChange"> {{ col.title }} </a-checkbox>
            <a-icon type="vertical-align-top" @click="sortItem(cIndex, 0)" />
            <a-icon type="vertical-align-bottom" @click="sortItem(cIndex, columns.length)" />
          </li>
        </transition-group>
      </draggable>
      <div></div>
    </a-checkbox-group>

    <!-- <a-row>
      <a-row>
        <a-checkbox
          @change="colsChangeAll"
          :indeterminate="checkedKeys.length > 0 && checkedKeys.length !== columns.length"
          :checked="checkedKeys.length === columns.length"
        >
          列展示
        </a-checkbox>
        <a-button type="link" @click="restColumns"> 重置 </a-button>
      </a-row>
      <a-checkbox-group v-bind:value="checkedKeys">
        <div v-for="(col, cIndex) in columns" :key="cIndex" class="col-tool-check-item">
          <a-checkbox :value="col.dataIndex || col.title" @change="checkChange"> {{ col.title }} </a-checkbox>
          <a-icon type="vertical-align-top" @click="sortItem(cIndex, 0)" />
          <a-icon type="vertical-align-bottom" @click="sortItem(cIndex, columns.length)" />
        </div>
      </a-checkbox-group>
    </a-row> -->
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import cloneDeep from 'lodash.clonedeep'

const message = ['vue.draggable', 'draggable', 'component', 'for', 'vue.js 2.0', 'based', 'on', 'Sortablejs']
export default {
  components: {
    draggable,
  },
  props: ['columns', 'checkedKeys'],

  data() {
    return {
      // dynamicColumns: [],
      list: message.map((name, index) => {
        return { name, order: index + 1, fixed: false }
      }),
      isDragging: false,
    }
  },
  watch: {
    // columns: {
    //   handler(nVal) {
    //     console.log('columns 改变了', nVal.map((item) => item.title).join('-'))
    //     this.dynamicColumns = cloneDeep(nVal)
    //   },
    //   immediate: true,
    // },
    // dynamicColumns(nv) {
    //   this.$emit('updatecolumns', nv)
    // },
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        // group: 'description',
        // disabled: !this.editable,
        ghostClass: 'ghost',
      }
    },
  },
  methods: {
    onDragEnd({ to, from, item, clone, oldIndex, newIndex }) {
      this.sortItem(oldIndex, newIndex)
    },
    // },
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

<style >
.custom-columns-tool {
  height: 300px;
  background: #fff;
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
  color: #1890ff;
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
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
</style>