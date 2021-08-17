<template>
  <div class="DataScreenFileEditor">
    <div class="body">
      <div class="tool-bar"></div>
      <coordinate-system
        class="preview"
        ref="coordinateSystem"
        @click.native="clearSelected"
        @contextmenu.native.prevent="handleContextmenu"
      >
        <DataScreenPreviewer
          :dataScreenConfig="dataScreenConfig"
        ></DataScreenPreviewer>
        <template v-slot:unscale>
          <WidgetController
            v-for="widgetConfig in widgetConfigs"
            :key="widgetConfig.id"
            :widgetConfig="widgetConfig"
          ></WidgetController>
        </template>
      </coordinate-system>
      <div class="splitter"></div>
      <CodeEditor
        class="code-editor"
        ref="codeEditor"
        v-model="content"
      ></CodeEditor>
    </div>
    <ContextMenu ref="contextMenu">
      <MeunItem label="编组" @click="groupSelectedWidgetConfigs"></MeunItem>
    </ContextMenu>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Provide, Ref, Watch } from 'vue-property-decorator'
import { encode, decode } from 'js-base64'
import { compile } from 'vue-template-compiler'
import ProjectFile from '@/core/model/ProjectFile'
import CodeEditor from '@/core/objects-editor/code-editor/CodeEditor.vue'
import ContextMenu from '@/core/project-editor/context-menu/ContextMenu.vue'
import MeunItem from '@/core/project-editor/context-menu/MeunItem.vue'
import { DataScreenConfig, WidgetConfig } from './DataScreenModels'
import DataScreenPropertyInspector from './DataScreenPropertyInspector.vue'
import DataScreenHierarchyInspector from './DataScreenHierarchyInspector.vue'
import DataScreenPreviewer from './DataScreenPreviewer.vue'
import WidgetController from './WidgetController.vue'

@Component({
  components: { CodeEditor, DataScreenPreviewer, WidgetController, ContextMenu, MeunItem }
})
export default class DataScreenFileEditor extends Vue {
  @Provide('dataScreenFileEditor')
  public get dataScreenFileEditor (): DataScreenFileEditor { return this }

  @Prop({ type: Object, required: true })
  public object!: ProjectFile

  @Ref()
  public contextMenu! :ContextMenu

  /** 选中的控件或控件组的Id数组 */
  public selectedIds: string[] = []

  public get propertyInspector() {
    return DataScreenPropertyInspector
  }

  public get hierarchyInspector() {
    return DataScreenHierarchyInspector
  }

  public get content() {
    return decode(this.object.base64)
  }

  public set content(content: string) {
    this.object.base64 = encode(content)
  }

  public get compiledResult() {
    return compile(this.content, { outputSourceRange: true })
  }

  
  public get ast() {
    return Object.freeze(this.compiledResult.ast)
  }

  public get dataScreenConfig() {
    return Vue.observable(new DataScreenConfig(this.ast))
  }

  public get tabInfoKey() {
    const id = this.object.id
    return `file-editor:${id}`
  }

  /** 控件配置 */
  public get widgetConfigs() {
    return this.dataScreenConfig.widgetConfigs
  }

  /** 所有的控件配置 */
  public get allWidgetConfigs() {
    const result: WidgetConfig[] = []
    const traverse = (widgetConfigs: WidgetConfig[]) => {
      if (!widgetConfigs.length) {
        return
      }
      for (const widgetConfig of widgetConfigs) {
        result.push(widgetConfig)
        traverse(widgetConfig?.children || [])
      }
    }
    traverse(this.dataScreenConfig?.widgetConfigs || [])
    return result
  }

  /** 所有选中的控件配置 */
  public get selectedWidgetConfigs() {
    return this.allWidgetConfigs.filter((d) => this.selectedIds.indexOf(d.id) !== -1) || []
  }

  @Watch('dataScreenConfig', { deep: true })
  public dataScreenConfigChange(dataScreen: DataScreenConfig, oldDataScreen: DataScreenConfig) {
    if (dataScreen === oldDataScreen) {
      console.log('DataScreen 自身变化')
      this.content = this.dataScreenConfig.generateCode()
    } else {
      console.log('重新生成的 DataScreen')
    }
  }

  /** 打开右键菜单 */
  public handleContextmenu(event: MouseEvent) {
    this.contextMenu.open(event.clientX, event.clientY)
  }

  /** 根据ID获取WidgetConfig */
  public getWidgetConfigById(widgetConfigId: string) {
    return this.allWidgetConfigs.find((d) => d.id === widgetConfigId)
  }

  /** 选择一个控件 */
  public selectWidgetConfig (widgetConfigId: string, multiSelect = false) {
    const first = this.selectedWidgetConfigs[0]
    const widgetConfig = this.getWidgetConfigById(widgetConfigId)

    if (!widgetConfig) {
      return
    }


    if (multiSelect) {
      if (first?.parentId !== widgetConfig.parentId) {
        this.clearSelected()
      }
      const index = this.selectedIds.indexOf(widgetConfigId)
      if (index > -1) {
        this.selectedIds.splice(index, 1)
      } else {
        this.selectedIds.push(widgetConfigId)
      }
    } else {
      this.selectedIds = [widgetConfigId]
    }
  }

  public getAbsolutePosition (widgetConfigId: string) {
    const widgetConfig = this.getWidgetConfigById(widgetConfigId)
    if (!widgetConfig) {
      return {x: 0, y: 0}
    }
    let x = widgetConfig.x
    let y = widgetConfig.y

    if (widgetConfig.parentId) {
      const { x: dx, y: dy} = this.getAbsolutePosition(widgetConfig.parentId)
      x += dx
      y += dy
    }

    return {x, y}
  }

  /** 删除一个控件 */
  public deleteWidgetConfigById (widgetConfigId: string, deleteEmptyParentGroup = true) {
    const widgetConfig = this.getWidgetConfigById(widgetConfigId)
    const parentWidgetConfig = this.getWidgetConfigById(widgetConfig?.parentId || '')
    const list = parentWidgetConfig?.children || this.widgetConfigs || []
    const index = list.findIndex((d) => d.id === widgetConfigId)

    if (index > -1) {
      list.splice(index, 1)
    }

    if (
      deleteEmptyParentGroup &&
      list.length === 0 &&
      parentWidgetConfig &&
      parentWidgetConfig.isGroup
    ) {
      this.deleteWidgetConfigById(parentWidgetConfig.id)
    }
  }

  /** 编组选中的组件 */
  public groupSelectedWidgetConfigs() {
    const selectedWidgetConfigs = this.selectedWidgetConfigs
    const first = selectedWidgetConfigs[0]
    const parentId = first.parentId
    const parentWidget = this.getWidgetConfigById(parentId)
    const widgetConfigs = this.widgetConfigs || []

    const x0 = Math.min(...selectedWidgetConfigs.map((d) => d.x))
    const y0 = Math.min(...selectedWidgetConfigs.map((d) => d.y))
    const x1 = Math.max(...selectedWidgetConfigs.map((d) => d.x + d.width))
    const y1 = Math.max(...selectedWidgetConfigs.map((d) => d.y + d.height))
    const children = []

    const index = parentWidget?.children.indexOf(first) || widgetConfigs.indexOf(first)
  
    const group = new WidgetConfig()
    group.isGroup = true
    for (const selectedWidgetConfig of selectedWidgetConfigs) {
      this.deleteWidgetConfigById(selectedWidgetConfig.id, false)
      selectedWidgetConfig.parentId = group.id
      selectedWidgetConfig.x -= x0
      selectedWidgetConfig.y -= y0
      children.push(selectedWidgetConfig)
    }

    group.name = '组'
    group.x = x0
    group.y = y0
    group.width = x1 - x0
    group.height = y1 - y0
    group.children = children

    if (parentWidget) {
      group.parentId = parentWidget.id
      parentWidget.children.splice(index,0, group)
    } else {
      widgetConfigs.splice(index, 0, group)
    }
  }

  /** 清除所有 */
  public clearSelected () {
    this.selectedIds = []
  }

  /** 判断一个控件是否被选中 */
  public isSelectedWidgetConfigId (widgetConfigId: string) {
    return this.selectedIds.indexOf(widgetConfigId) > -1
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.DataScreenFileEditor {
  font-size: 12px;
  height: 100%;
  padding: 0px 3px 3px;
  background: $panel-background-color;
  .body {
    height: 100%;
    background: $panel-background-dark-color;
  }
  .tool-bar {
    height: 32px;
    background: $panel-background-color;
  }
  .preview,
  .code-editor {
    height: calc(50% - 17px);
  }
  .splitter {
    height: 2px;
    background: $panel-background-color;
  }
  ::v-deep .CodeMirror,
  ::v-deep .CodeMirror-gutters {
    background: $panel-background-dark-color;
  }
}
</style>
