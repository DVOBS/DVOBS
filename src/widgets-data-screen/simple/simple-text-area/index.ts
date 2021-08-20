import { WidgetDefinition } from '@/widgets-data-screen/WidgetDefinition'
import SimpleTextArea from './SimpleTextArea.vue'

const widgetDefinitionOptions: WidgetDefinition = {
  tag: 'SimpleText',
  displayName: '简单文本',
  component: SimpleTextArea,
  autoSize: true,
  propsGroups: [{
    name: '文本 · 样式',
    props: [{
      name: '内容',
      key: 'text',
      type: 'string',
      value: '默认文本',
    }, {
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
