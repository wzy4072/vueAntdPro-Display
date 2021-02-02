<template>
  <div class="custom-columns-tool">
    <draggable
      class="list-group"
      tag="ul"
      v-model="list"
      v-bind="dragOptions"
      :move="onMove"
      @start="isDragging = true"
      @end="isDragging = false"
    >
      <transition-group type="transition" :name="'flip-list'">
        <li class="list-group-item" v-for="element in list" :key="element.order">
          <i
            :class="element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'"
            @click="element.fixed = !element.fixed"
            aria-hidden="true"
          ></i>
          {{ element.name }}
          <span class="badge">{{ element.order }}</span>
        </li>
      </transition-group>
    </draggable>

    <a-row>
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
    </a-row>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
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
      myArray: [
        { id: 1, name: 11 },
        { id: 12, name: 12 },
        { id: 13, name: 13 },
        { id: 14, name: 14 },
        { id: 15, name: 15 },
        { id: 16, name: 16 },
        { id: 17, name: 17 },
      ],
      isDragging: false,
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        // disabled: !this.editable,
        ghostClass: 'ghost',
      }
    },
  },
  methods: {
    onMove({ relatedContext, draggedContext }) {
      // const relatedElement = relatedContext.element;
      // const draggedElement = draggedContext.element;
      // return (
      //   (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      // );
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

<style >
.custom-columns-tool {
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