<template>
  <div class="custom-column-sort">
    <a-checkbox-group v-bind:value="checkedKeys" style="width: 100%">
      <draggable class="cols-list" tag="ul" v-model="columns" v-bind="dragOptions" @end="onDragEnd">
        <transition-group type="transition" :name="'col-list'">
          <li class="col col-tool-check-item" v-for="(col, cIndex) in columns" :key="col.dataIndex || col.title">
            <a-checkbox :value="col.dataIndex || col.title" @change="checkChange"></a-checkbox>
            <span class="title">
              <span class="title-bar" :style="{ width: `${col.titleWidth}px` }">{{ col.title }}</span>
            </span>
            <a-input-number class="ipt-tit-wid" v-model="col.titleWidth" :min="1" :max="500" />
            <a-icon type="vertical-align-top" @click="sortItem(cIndex, 0)" />
            <a-icon type="vertical-align-bottom" @click="sortItem(cIndex, columns.length)" />
          </li>
        </transition-group>
      </draggable>
      <hr />
      <draggable class="cols-list" tag="ul" v-model="columns2" v-bind="dragOptions" @end="onDragEnd">
        <!-- <div v-show="columns2.length === 0">拖拽到这里 即可右侧冻结</div> -->
        <transition-group type="transition" :name="'col-list2'">
          <li class="col col-tool-check-item" v-for="(col, cIndex) in columns2" :key="col.dataIndex || col.title">
            <a-checkbox :value="col.dataIndex || col.title" @change="checkChange"></a-checkbox>
            <span class="title">
              <span class="title-bar" :style="{ width: `${col.titleWidth}px` }">{{ col.title }}</span>
            </span>
            <a-input-number class="ipt-tit-wid" v-model="col.titleWidth" :min="1" :max="500" />
            <a-icon type="vertical-align-top" @click="sortItem(cIndex, 0)" />
            <a-icon type="vertical-align-bottom" @click="sortItem(cIndex, columns2.length)" />
          </li>
        </transition-group>
      </draggable>
    </a-checkbox-group>

    <!-- <div v-for="c in columns" :key="c.dataIndex">
      <div>{{ c.title }}</div>
    </div> -->
  </div>
</template>

<script>
import draggable from 'vuedraggable'
// TODO  1动画效果 2样式代码 3类名
/**
 * 功能拆分
 * 1 列表内拖动
 * 2 多列表拖动
 * 3 选中
 * 4 调整宽度 宽度背景色
 * 5 特殊column处理
 * 6 
 * 
 * 5 样式
 * 6 类名 动画 优化
 * 7 测试
 * 
 */





const columns = [
  { dataIndex: 'taskName', title: '任务名称', titleWidth: 50, requred: true },
  { dataIndex: 'name2', title: '预计', titleWidth: 100 },
  { dataIndex: 'name3', title: '消耗', titleWidth: 50 },
  { dataIndex: 'name4', title: '剩余', titleWidth: 80 },
  { dataIndex: 'name5', title: ' %', titleWidth: 50 },
  { dataIndex: 'name6', title: '截止', titleWidth: 80 },
  { dataIndex: 'name7', title: '创建', titleWidth: 50 },
  { dataIndex: 'name8', title: '创建日期', titleWidth: 50 },

  { dataIndex: 'name11', title: '指派给', titleWidth: 50 },
  { dataIndex: 'name12', title: '指派日期', titleWidth: 50 },
  { dataIndex: 'action', title: '操作列', titleWidth: 50, requred: true },
]
export default {
  components: {
    draggable,
  },
  data() {
    return {
      columns,
      columns2: [
        { dataIndex: 'name9', title: '预计开始', titleWidth: 50 },
        { dataIndex: 'name10', title: '实际开始', titleWidth: 60 },
      ],
      checkedKeys: [],
      dragOptions: {
        animation: 0,
        ghostClass: 'ghost',
        group: 'description',
      },
    }
  },
  methods: {
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
.ipt-tit-wid {
  width: 60px;
}
.custom-column-sort {
  // width: 500px;
  background-color: #fff;
}
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
  // position: relative;
  min-width: 200px;
  padding: 4px 8px;
  border-bottom: 1px solid #e8e8e8;
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
  background-color: #e6f7ff;
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

.cols-list {
  min-height: 20px;
  padding-left: 4px;
  margin-bottom: 4px;
  margin-right: 4px;
  margin-top: 4px;
}

.col {
  position: relative;
  cursor: move;
}

.col i {
  cursor: pointer;
}
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
.cols-list .col .title {
  display: inline-block;
  width: 500px;
}
</style>