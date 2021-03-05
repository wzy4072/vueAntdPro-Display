<template>
  <div v-if="visible" class="custom-search">
    <template v-for="(group, gIndex) in customSearchData">
      <div :key="'group' + gIndex" class="custom-search-group">
        <a-button
          class="symbolbtn"
          :type="group.leftBrackets ? 'primary' : 'default'"
          @click="group.leftBrackets = !group.leftBrackets"
        >(</a-button
        >
        <!-- FieldName -->
        <KFormItem
          :formConfig="formConfig"
          @change="
            (v, k) => {
              group.fieldName = v
              fieldNameChange(gIndex, v, k)
            }
          "
          :record="getFormDesignItemConfig({ gIndex, itemName: 'fieldName', defaultValue: group.fieldName })"
        />
        <!-- Relation -->
        <KFormItem
          class="group-relation"
          :formConfig="formConfig"
          @change="
            (v, k) => {
              group.relation = v
            }
          "
          :record="getFormDesignItemConfig({ gIndex, itemName: 'relation', defaultValue: group.relation })"
        />
        <!-- fieldValue -->
        <KFormItem
          :formConfig="formConfig"
          @change="
            (v, k) => {
              group.fieldValue = v
            }
          "
          :record="
            getFormDesignItemConfig2({ gIndex, itemName: 'fieldValue', defaultValue: group.fieldValue })
          "
        />
        <!-- <KFormItem :formConfig="formConfig"  /> -->
        <a-button
          class="symbolbtn"
          :type="group.rightBrackets ? 'primary' : 'default'"
          @click="group.rightBrackets = !group.rightBrackets"
        >)</a-button
        >

        <a-button
          shape="circle"
          type="danger"
          icon="minus"
          :disabled="customSearchData.length === 1"
          ghost
          @click="delGroupItem(gIndex)"
          title="移除该条件"
          size="small"
        ></a-button>
      </div>
      <div :key="'groupcondition' + gIndex" class="group-condition">
        <KFormItem
          v-if="gIndex !== customSearchData.length - 1"
          :key="`item-condition-'${gIndex}`"
          :formConfig="formConfig"
          :record="getFormDesignItemConfig({ gIndex, itemName: 'condition', defaultValue: group.condition })"
        />
      </div>
    </template>
    <a-button
      class="addgroup-btn"
      shape="circle"
      type="primary"
      icon="plus"
      @click="addGroup"
      title="添加条件"
      size="small"
    ></a-button>
    <div class="btn-group">
      <a-button @click="searchCustomParam" :type="visible ? 'primary' : 'default'">查询自定义</a-button>
      <!-- <a-button @click="addGroup" icon="plus">添加组</a-button> -->
      <a-button @click="saveCustomParam">设为常用</a-button>
      <a-button @click="resetCustomParam">重置</a-button>
    </div>
    <a-modal v-model="modalVisible" title="命名常用搜索" @ok="ensureSaveCustomParam">
      <a-input v-model="customParamName"></a-input>
    </a-modal>
  </div>
</template>

<script>
import {
    getBaseGroupValue,
    getBaseInputConfig,
    getBaseSelectConfig,
    conditionOptions,
    relationOptions,
    checkBrackets
} from './CustomSearchBaseConfig'
import cloneDeep from 'lodash.clonedeep'

import { addCustomParams } from '@/api/role'

let customParamValue = null // 常用搜索值 临时存放 用于提交
/**
 * 该组件只用于收集/渲染/保存 常用搜索条件
 * 不参与搜索
 */
export default {
    name: 'CustomSearch',
    props: {
        columns: {
            type: Array,
            required: true,
            default: () => []
        },
        visible: {
            type: Boolean,
            required: true,
            default: true
        },
        form: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            formConfig: {},
            customSearchData: [getBaseGroupValue()],
            fieldValueFormConfs: [getBaseInputConfig(0)],
            customParamName: null, // 存放常用搜索名字
            modalVisible: false
            // customParams: [], // 用户已经保存 常用查询列表
        }
    },
    computed: {
        fieldNameOptions () {
            return this.columns.filter(col => col.isSearch).map(col => ({ label: col.title, value: col.dataIndex }))
        }
        // fieldNameOptions = this.columns.filter(col => col.isSearch).map(col => ({ label: col.title, value: col.dataIndex }))
    },
    methods: {
        resetCustomParam () {
            this.customSearchData = [getBaseGroupValue()]
            this.fieldValueFormConfs = [getBaseInputConfig(0)]
            this.form.resetFields()
        },
        updateCustomParam (values) {
            this.customSearchData = values
            this.customSearchData.map((groupValues, gIndex) => {
                this.fieldNameChange(gIndex, groupValues.fieldName)
            })
        },

        getFormDesignItemConfig ({ gIndex, itemName, defaultValue }) {
            // console.log('getFormDesignItemConfig', gIndex, itemName, defaultValue)
            let selectOptions = []
            if (itemName === 'condition') selectOptions = conditionOptions
            if (itemName === 'relation') selectOptions = relationOptions
            if (itemName === 'fieldName') selectOptions = this.fieldNameOptions
            const baseConf = getBaseSelectConfig()

            Object.assign(baseConf.options, {
                width: itemName === 'fieldName' ? '100px' : '66px',
                options: selectOptions,
                defaultValue
            })
            Object.assign(baseConf, { label: '', model: `group[${gIndex}]${itemName}` })
            return baseConf
        },
        getFormDesignItemConfig2 ({ gIndex, itemName, defaultValue }) {
            const fieldName = this.customSearchData[gIndex].fieldName
            const baseConf =
                cloneDeep(this.columns.filter(col => col.dataIndex === fieldName)[0]?.formConf) ||
                getBaseInputConfig(gIndex)
            Object.assign(baseConf.options, { width: '100px', defaultValue })
            Object.assign(baseConf, { label: '', model: `group[${gIndex}]${itemName}` })
            return baseConf
        },
        fieldNameChange (gIndex, v) {
            const formConf =
                cloneDeep(this.columns.filter(col => col.dataIndex === v)[0].formConf) || getBaseInputConfig()
            const baseConf = {
                label: '',
                model: `group[${gIndex}]fieldValue`,
                options: { defaultValue: this.customSearchData[gIndex].fieldValue }
            }
            this.fieldValueFormConfs[gIndex] = Object.assign({}, formConf, baseConf)
        },
        addGroup () {
            this.customSearchData.push(getBaseGroupValue())
            this.fieldValueFormConfs.push(getBaseInputConfig(this.fieldValueFormConfs.length))
        },
        delGroupItem (gIndex) {
            this.fieldValueFormConfs.splice(gIndex, 1)
            this.customSearchData.splice(gIndex, 1)
            console.log(this.fieldValueFormConfs)
            console.log(this.customSearchData)
            this.form.resetFields()
        },
        // 保存自定义
        saveCustomParam () {
            this.form.validateFields((err, values) => {
                if (!err) {
                    if (!checkBrackets(this.customSearchData)) {
                        this.$message.error('括号使用逻辑有误，请检查后重试！')
                        return false
                    }
                    this.modalVisible = true
                    this.customParamName = null

                    customParamValue = this.customSearchData.map((group, i) => {
                        const { leftBrackets, rightBrackets } = group
                        return Object.assign({}, values.group[i], { leftBrackets, rightBrackets })
                    })
                    console.log(JSON.stringify(customParamValue))
                }
            })
        },
        // 查询自定义
        searchCustomParam () {
            this.form.validateFields((err, values) => {
                if (!err) {
                    if (!checkBrackets(this.customSearchData)) {
                        this.$message.error('括号使用逻辑有误，请检查后重试！')
                        return false
                    }
                    customParamValue = this.customSearchData.map((group, i) => {
                        const { leftBrackets, rightBrackets } = group
                        return Object.assign({}, values.group[i], { leftBrackets, rightBrackets })
                    })
                    this.$emit('searchCustom', { display: false, values: customParamValue })
                }
            })
        },
        ensureSaveCustomParam () {
            const { customParamName } = this
            const s = JSON.parse(localStorage.getItem('mockCustomerParam' + location.pathname)) || []
            s.push({ name: customParamName, values: customParamValue })
            // 模拟保存
            localStorage.setItem('mockCustomerParam' + location.pathname, JSON.stringify(s))
            addCustomParams({ name: customParamName, values: customParamValue }).then(res => {
                this.$emit('updateCustomParams')
                this.modalVisible = false// 保存成功关闭弹窗
            })
        }
    }
}
</script>
<style lang="less">
.custom-search {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 16px;
    border: 1px solid #e6e6e6;
    padding: 8px;
    transition: all 0.3s;
    &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    }
    .custom-search-group {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        width: 368px;
        // background-color: #efefef;
        padding: 8px 8px 0 8px;
        // margin-bottom: 8px;
        .symbolbtn.ant-btn {
            padding: 0 8px;
        }
        .ant-btn.ant-btn-danger.ant-btn-circle {
            margin-top: 4px;
            margin-left: 4px;
        }
    }
    .group-condition {
        margin: 0 16px;
        padding-top: 8px;
    }
    .addgroup-btn {
        margin-top: 12px;
        margin-left: -32px;
    }
    .btn-group {
        width: 100%;
        padding-top: 2px;
        text-align: center;
    }
}
</style>
