import { WidgetDefinition } from '@/core/widgets-data-screen/WidgetDefinition'
import PointsEarth from './PointsEarth.vue'

const widgetDefinitionOptions: WidgetDefinition = {
  tag: 'PointsEarth',
  displayName: '点状云地球',
  component: PointsEarth,
  autoSize: false,
  propsGroups: [{
    name: '样式',
    props: [{
      name: '颜色1',
      key: 'color1',
      type: 'color',
      value: '#ee8844',
    }, {
      name: '颜色2',
      key: 'color2',
      type: 'color',
      value: '#2266ee',
    }, {
      name: '颜色3',
      key: 'color3',
      type: 'color',
      value: '#2288ff',
    }, {
      name: '光晕颜色',
      key: 'glowColor',
      type: 'color',
      value: '#4488ff',
    }, {
      name: '轮廓颜色',
      key: 'outlineColor',
      type: 'color',
      value: '#ff8800',
    }]
  }]
}

export default widgetDefinitionOptions
