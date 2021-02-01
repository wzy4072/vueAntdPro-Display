<template>
  <div class="custom-columns-tool">
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
export default {
  props: ['columns', 'checkedKeys'],
  data() {
    return {}
  },
  methods: {
    colsChangeAll(e) {
      const keys = e.target.checked ? this.columns.map((i) => i.dataIndex || i.title) : []
      debugger
      this.$emit('update:checkedKeys', keys)
    },
    checkChange({ target: { value, checked } }) {
      const newKeys = new Set(this.checkedKeys)
      checked ? newKeys.add(value) : newKeys.delete(value)
      this.$emit('update:checkedKeys', [...newKeys])
    },
    sortItem(from, to) {
      const copyColumns = [...this.columns]
      copyColumns.splice(to, 0, ...copyColumns.splice(from, 1))
      debugger
      this.$emit('update:columns', copyColumns)
    },
    restColumns() {},
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
</style>