import { WidgetDefinition } from '@/core/widgets-data-screen/WidgetDefinition'
import SimpleDataView from './SimpleDataView.vue'

const widgetDefinitionOptions: WidgetDefinition = {
  tag: 'SimpleDataView',
  displayName: '简易数据视图',
  component: SimpleDataView,
  autoSize: true,
  propsGroups: [{
    name: '文本 · 样式',
    props: [{
      name: '字体',
      key: 'fontFamily',
      type: 'string',
      value: 'Microsoft YaHei',
    }, {
      name: '颜色',
      key: 'color',
      type: 'color',
      value: '#ffffff',
    }, {
      name: '字号',
      key: 'fontSize',
      type: 'number',
      value: 12,
    }, {
      name: '字间距',
      key: 'letterSpacing',
      type: 'number',
      value: 0,
    }]
  }]
}

export default widgetDefinitionOptions
