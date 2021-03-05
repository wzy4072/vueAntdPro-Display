<template>
  <div style="display: inline-block;" v-show="customParams.length > 0">
    <a-divider type="vertical" />
    <a-tag
      v-for="(cusParam, cIndex) in customParams"
      closable
      @close="
        e => {
          e.preventDefault()
          delCustomParam(cIndex)
        }
      "
      @click.native="searchAndShowParam(cusParam)"
      :key="cIndex"
    >{{ cusParam.name }}</a-tag
    >
    <!-- <a-divider type="vertical" /> -->
    <!-- title="仅在当前浏览器的当前页面生效" -->
    <a-checkbox v-if="visible" :checked="defultOpenCustomSearch" @change="updateDefaultSet">
      搜索常用时展开
    </a-checkbox>
  </div>
</template>

<script>
/**
 * 该组件只用于展示/删除/抛出 常用搜索参数
 * 不参与搜索
 */
import { getCustomParams, delCustomParams } from '@/api/role'
const localKey = location.pathname + 'ShowCustomerSearch'
export default {
    name: 'CustomParams',
    props: {
        visible: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    data () {
        return {
            customParams: [],
            defultOpenCustomSearch: !!localStorage.getItem(localKey)
        }
    },
    mounted () {
        this.getCustomerParams()
    },
    methods: {
        updateParams () {
            this.getCustomerParams()
        },
        getCustomerParams () {
            getCustomParams().then(res => {
                this.customParams = JSON.parse(localStorage.getItem('mockCustomerParam' + location.pathname)) || []
            })
            // console.log('初始化 常用搜索：', localStorage.getItem('mockCustomerParam'))
        },
        delCustomParam (i) {
            delCustomParams().then(res => {
                this.customParams.splice(i, 1)
                localStorage.setItem('mockCustomerParam' + location.pathname, JSON.stringify(this.customParams))
                this.getCustomerParams()
            })
        },
        searchAndShowParam (cusParam) {
            console.log('searchAndShowParam')
            this.$emit('getCustomParam', Object.assign({}, cusParam, { display: this.defultOpenCustomSearch }))
            // this.customSearchData = this.customParams[i].values
            // console.log('customParams', JSON.stringify(this.customParams[i]))
            // // console.table(this.customParams[i].values)
            // this.customSearchData.map((groupValues, gIndex) => {
            //     this.fieldNameChange(gIndex, groupValues.fieldName)
            // })
            // this.isOpen = true
            // this.form.resetFields()
        },
        updateDefaultSet (e) {
            const { checked } = e.target
            this.defultOpenCustomSearch = checked
            localStorage.setItem(localKey, checked ? 1 : '')
        }
    }
}
</script>

<style></style>
