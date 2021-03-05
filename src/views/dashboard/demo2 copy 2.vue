<template>
  <div class="fluid container">
    <a-row>
      <a-col :span="12">
        <draggable
          class="list-group"
          tag="ul"
          v-model="list"
          v-bind="dragOptions"
          group="site"
          :move="onMove"
          @start="isDragging = true"
          @end="isDragging = false"
        >
          <transition-group type="transition" :name="'flip-list'">
            <li class="list-group-item" v-for="element in list" :key="element.order">
              <div class="my-handle move-span">{{ element.name }}</div>

              <span> ----------{{ element.name }}</span>

              <span class="badge">{{ element.order }}</span>
            </li>
          </transition-group>
        </draggable>
        <span>{{ JSON.stringify(list) }}</span>
      </a-col>
      <a-col :span="12">
        <draggable
          class="list-group"
          tag="ul"
          v-model="list2"
          v-bind="dragOptions"
          group="site"
          :move="onMove"
          @start="isDragging = true"
          @end="isDragging = false"
        >
          <transition-group type="transition" :name="'flip-list'">
            <li class="list-group-item" v-for="element in list2" :key="element.order">
              <div class="my-handle move-span">{{ element.name }}</div>

              <span> ----------{{ element.name }}</span>

              <span class="badge">{{ element.order }}</span>
            </li>
          </transition-group>
        </draggable>
        <span>{{ JSON.stringify(list2) }}</span>
      </a-col>
    </a-row>

    <hr />
    <!-- <div class="col-md-3">
      <draggable element="span" v-model="list2" v-bind="dragOptions" :move="onMove">
        <transition-group name="no" class="list-group" tag="ul">
          <div v-if="list2.length === 0" key="deftitle">666</div>
          <li class="list-group-item" v-for="element in list2" :key="element.order">
            {{ element.name }}
            <span class="badge">{{ element.order }}</span>
          </li>
        </transition-group>
      </draggable>
    </div> -->
  </div>
</template>

<script>
import draggable from 'vuedraggable'
const message = ['vue.draggable', 'draggable', 'component', 'for', 'vue.js 2.0', 'based', 'on', 'Sortablejs']
const message2 = ['aaaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh']

export default {
  name: 'hello',
  components: {
    draggable,
  },
  data() {
    return {
      list: message.map((name, index) => {
        return { name, order: index + 1 }
      }),
      list2: message2.map((name, index) => {
        return { name, order: index + 100 }
      }),
      isDragging: false,
      delayedDragging: false,
      dragOptions: {
        animation: 500,
        handle: '.my-handle',
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
        dragClass: 'drag-item',
      },
    }
  },
  methods: {
    orderList() {
      this.list = this.list.sort((one, two) => {
        return one.order - two.order
      })
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return 1
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    },
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
}
</script>

<style>
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
}
</style>
