import { WidgetDefinition } from '@/core/widgets-data-screen/WidgetDefinition'
import EchartsBaseBar from './EchartsBaseBar.vue'

const widgetDefinitionOptions: WidgetDefinition = {
  tag: 'EchartsBaseBar',
  displayName: '基础柱形图',
  component: EchartsBaseBar,
  autoSize: false,
  propsGroups: []
}

export default widgetDefinitionOptions
