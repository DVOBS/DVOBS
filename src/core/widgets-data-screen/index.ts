import SimpleTextArea from './simple/simple-text-area/index'
import SimpleText from './simple/simple-text/index'
import PointsEarth from './webgl/points-earth/index'
import EchartsBaseBar from './echarts/echarts-base-bar/index'
import { WidgetDefinition } from './WidgetDefinition'

export const widgetDefinitionMap: Map<string, WidgetDefinition> = new Map()

interface WidgetGroup {
  name: string,
  displayName: string,
  widgetDefinitions: WidgetDefinition[]
}

export function addWidgetDefinition(widgetDefinition: WidgetDefinition, widgetGroup: WidgetGroup) {
  widgetDefinitionMap.set(widgetDefinition.tag, widgetDefinition)
  widgetGroup.widgetDefinitions.push(widgetDefinition)
}

export function getWidgetDefinition(tag: string) {
  return widgetDefinitionMap.get(tag)
}

const simpleGroup = {
  name: 'simple',
  displayName: '基本',
  widgetDefinitions: []
}
const echartsGroup = {
  name: 'echarts',
  displayName: 'Echarts 图表',
  widgetDefinitions: []
}
const webglGroup = {
  name: 'webgl',
  displayName: 'WEBGL',
  widgetDefinitions: []
}

addWidgetDefinition(SimpleText, simpleGroup)
addWidgetDefinition(SimpleTextArea, simpleGroup)
addWidgetDefinition(EchartsBaseBar, echartsGroup)
addWidgetDefinition(PointsEarth, webglGroup)

export const widgetGroups: WidgetGroup[] = [
  simpleGroup,
  echartsGroup,
  webglGroup
]