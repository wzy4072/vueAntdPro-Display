/*
 * author wzy
 * date 20210304
 */
import CustomParams from './CustomParams.vue'
import CustomSearch from './CustomSearch.vue'

CustomSearch.install = function (Vue) {
  Vue.component(CustomParams.name, CustomParams)
  Vue.component(CustomSearch.name, CustomSearch)
}

export default CustomSearch
