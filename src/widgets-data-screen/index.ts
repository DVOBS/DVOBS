import SimpleTextArea from './simple/simple-text-area/index'
import PointsEarth from './webgl/points-earth/index'
import { WidgetDefinition } from './WidgetDefinition'

export const widgetDefinitionMap: Map<string, WidgetDefinition> = new Map()

widgetDefinitionMap.set(SimpleTextArea.tag, SimpleTextArea)
widgetDefinitionMap.set(PointsEarth.tag, PointsEarth)

export const widgetGroups = [{
    name: 'simple',
    displayName: '基本',
    widgetDefinitions: [
      SimpleTextArea
    ]
  }, {
    name: 'webgl',
    displayName: 'WEBGL',
    widgetDefinitions: [
      PointsEarth
    ]
  }
]

export function getWidgetDefinition(tag: string) {
  return widgetDefinitionMap.get(tag)
}
