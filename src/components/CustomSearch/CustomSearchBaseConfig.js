
/**
 * select表单基本配置
 */
export function getBaseSelectConfig () {
    return {
    'type': 'select',
    'label': '',
    'options': {
      'width': '100px',
      'multiple': false,
      'disabled': false,
      'clearable': false,
      'hidden': false,
      'placeholder': '请选择',
      'dynamicKey': '',
      'dynamic': false,
      'options': [],
      'showSearch': false
      },
    'model': '',
    'key': '',
    'rules': [{ 'required': true, 'message': '必填项' }]
  }
}
/**
 * input 表单基本配置
 */
export function getBaseInputConfig (i) {
  return {
  'type': 'input',
  'label': '',
  'icon': 'icon-write',
  'options': {
    'type': 'text',
    'width': '100px',
    'defaultValue': '',
    'placeholder': '请输入',
    'clearable': false,
    'maxLength': null,
    'hidden': false,
    'disabled': false
    },
  'model': `group[${i}]fieldValue`,
  'key': 'input_',
  'rules': []
  }
 }
export const conditionOptions = [{ 'value': 'and', 'label': '并且' }, { 'value': 'or', 'label': '或者' }]
export const relationOptions = [
  { value: 'eq', title: '=' },
  { value: 'neq', title: '!=' },
  { value: 'gt', title: '>' },
  { value: 'geq', title: '>=' },
  { value: 'lt', title: '<' },
  { value: 'leq', title: '<=' },
  { value: 'contains', title: '包含' },
  { value: 'between', title: '介于' },
  { value: 'notContains', title: '不包含' }
]
/**
 * 检查自定义查询中 括号逻辑是否正确
 * @param {*} datas
 */
export function checkBrackets (datas) {
  let start = 0
  for (let i = 0; i < datas.length; i++) {
    if (start < 0) break
    const element = datas[i]
    if (element.leftBrackets) start = start + 1
    if (element.rightBrackets) start = start - 1
  }
  return start === 0
}
/**
 * 获取一行自定义查询占位值
 */
export function getBaseGroupValue () {
  return { leftBrackets: false, rightBrackets: false, condition: 'and', fieldName: null, relation: 'eq', fieldValue: '' }
}
// import {selectBaseConfig }
