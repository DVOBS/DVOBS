<template>
  <div class="DataScreenFileEditor" :class="mode">
    <div class="body">
      <div class="tool-bar">
        <el-button v-if="mode === 'design'" size="mini" round>视图</el-button>
        <el-button v-else size="mini" type="text" @click="mode = 'design'">视图</el-button>
        <el-button v-if="mode === 'code'" size="mini" round>代码</el-button>
        <el-button v-else size="mini" type="text" @click="mode = 'code'">代码</el-button>
        <el-button v-if="mode === 'design-code'" size="mini" round>拆分</el-button>
        <el-button v-else size="mini" type="text" @click="mode = 'design-code'">拆分</el-button>
      </div>
      <coordinate-system
        v-show="mode === 'design-code' || mode === 'design'"
        class="preview"
        ref="coordinateSystem"
        @click.native="clearSelected"
        @contextmenu.native.prevent="handleContextmenu"
        @dragover.native="handleDragover"
        @drop.native="handleDrop"
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
      <div class="splitter" v-show="mode === 'design-code'"></div>
      <CodeEditor
        v-show="mode === 'design-code' || mode === 'code'"
        class="code-editor"
        ref="codeEditor"
        v-model="content"
      ></CodeEditor>
    </div>
    <ContextMenu ref="contextMenu">
      <MeunItem
        label="编组"
        :disable="selectedWidgetConfigs.length <= 1" @click="groupSelectedWidgetConfigs"
      ></MeunItem>
      <MeunItem
        label="取消编组"
        :disable="!singleSelectedWidgetConfigIsGroup"
        @click="ungroupSelectedWidgetConfigs"
      ></MeunItem>
      <MeunItemSplitLine></MeunItemSplitLine>
      <MeunItem
        label="删除"
        :disable="selectedWidgetConfigs.length === 0" @click="deleteAllSelectedWidgetConfig"
      ></MeunItem>
    </ContextMenu>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Provide, Ref, Watch } from 'vue-property-decorator'
import { encode, decode } from 'js-base64'
import { ASTElement, ASTNode, compile } from 'vue-template-compiler'
import throttle from 'lodash.throttle'
import debounce from 'lodash.debounce'
import ProjectFile from '@/core/model/ProjectFile'
import CodeEditor from '@/core/objects-editor/code-editor/CodeEditor.vue'
import ContextMenu from '@/core/project-editor/context-menu/ContextMenu.vue'
import MeunItem from '@/core/project-editor/context-menu/MeunItem.vue'
import CoordinateSystem from '@/core/common/coordinate-system/CoordinateSystem.vue'
import MeunItemSplitLine from '@/core/project-editor/context-menu/MeunItemSplitLine.vue'
import { DataScreenConfig, WidgetConfig } from './DataScreenModels'
import DataScreenPropertyInspector from './DataScreenPropertyInspector.vue'
import DataScreenHierarchyInspector from './DataScreenHierarchyInspector.vue'
import DataScreenWidgetLibrary from './DataScreenWidgetLibrary.vue'
import DataScreenPreviewer from './DataScreenPreviewer.vue'
import WidgetController from './WidgetController.vue'
import { MessageBox, Notification } from 'element-ui'
import { getWidgetDefinition } from '@/core/widgets-data-screen'
// import deepEq from 'deep-strict-equal'

@Component({
  components: { CodeEditor, DataScreenPreviewer, WidgetController, ContextMenu, MeunItem, MeunItemSplitLine }
})
export default class DataScreenFileEditor extends Vue {

  @Provide('dataScreenFileEditor')
  public get dataScreenFileEditor (): DataScreenFileEditor { return this }

  @Prop({ type: Object, required: true })
  public object!: ProjectFile

  @Ref()
  public contextMenu! :ContextMenu
  
  @Ref()
  public codeEditor! :CodeEditor

  @Ref()
  public coordinateSystem!: CoordinateSystem

  private mode = 'design' // design code design-code

  /** 选中的控件或控件组的Id数组 */
  public selectedIds: string[] = []

  public get propertyInspector() {
    return DataScreenPropertyInspector
  }

  public get hierarchyInspector() {
    return DataScreenHierarchyInspector
  }

  public get widgetLibrary() {
    return DataScreenWidgetLibrary
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

  /** 单选的控件设置 */
  public get singleSelectedWidgetConfig() {
    return this.selectedWidgetConfigs.length === 1 ? this.selectedWidgetConfigs[0] : null
  }

  public get singleSelectedWidgetConfigIsGroup() {
    return this.singleSelectedWidgetConfig?.isGroup
  }

  public get allAstNode() {
    const result: Map<string, ASTElement> = new Map()
    const traverse = (astNode: ASTNode) => {
      if (astNode.type === 1) {
        if (astNode.ref) {
          result.set(astNode.ref, astNode)
        }
        for (const child of astNode.children) {
          traverse(child)
        }
      }
    }
    if (this.ast) {
      traverse(this.ast)
    }
    return result
  }

  @Watch('selectedIds')
  @Watch('allAstNode')
  public async singleSelectedWidgetConfigChange() {
    await this.$nextTick()
    const asts = this.selectedIds.map((id) => this.allAstNode.get('"' + id + '"'))
    asts.forEach((astNode: any) => {
      if (astNode) {
        const start = astNode.start
        const end = astNode.end
        const code = this.content.slice(start,end)
        this.codeEditor.clearMarkText()
        this.codeEditor.markText(code, true)
      }
    })
  }

  @Watch('dataScreenConfig', { deep: true })
  public dataScreenConfigChange(dataScreen: DataScreenConfig, oldDataScreen: DataScreenConfig) {
    if (dataScreen === oldDataScreen) {
      // console.log('DataScreen 自身变化')
      const content = this.dataScreenConfig.generateCode()
      // const ast= compile(content, { outputSourceRange: false })
      // const astChange = deepEq(ast,this.ast)
      // console.log( astChange ? '语法树无变化' : '语法树发生变化')
      this.setContentDebounce(content)
    } else {
      // console.log('重新生成的 DataScreen')
    }
  }

  /** 控件拖放 */
  private handleDragover(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types.indexOf('widgetDefinitionTag'.toLowerCase()) !== -1) {
      event.preventDefault()
    }
  }

  /** 控件拖入 */
  private handleDrop (event: DragEvent) {
    if (event.dataTransfer) {
      const widgetDefinitionTag = event.dataTransfer.getData('widgetDefinitionTag'.toLowerCase())
      if (widgetDefinitionTag) {
        const { x, y } = this.coordinateSystem.getAxisPosition(event)
        this.addWidget(widgetDefinitionTag, x, y)
      }
    }
  }

  /** 打开右键菜单 */
  public handleContextmenu(event: MouseEvent) {
    this.contextMenu.open(event.clientX, event.clientY)
  }

  /** 处理键盘事件 */
  private handleKeydown (event: KeyboardEvent) {
    if(event.code==='Delete') {
      this.deleteAllSelectedWidgetConfig()
    }
  }

  /** 设置文件内容 */
  private setContent (content:string) {
    this.content = content
  }

  private setContentThrottle = throttle(this.setContent, 250)
  private setContentDebounce = debounce(this.setContent, 250)

  /** 添加一个控件 */
  public addWidget(widgetTag: string, x?: number, y?: number) {
    const widgetConfig = new WidgetConfig()
    const widgetDefinition = getWidgetDefinition(widgetTag)
    if (widgetDefinition) {
      widgetConfig.name = widgetDefinition.displayName
    }
    widgetConfig.widgetTag = widgetTag
    widgetConfig.x = x || 0
    widgetConfig.y = y || 0
    this.widgetConfigs.push(widgetConfig)
  }

  /** 删除所选中的控件 */
  public async deleteAllSelectedWidgetConfig () {
    if (this.selectedIds.length === 0) {
      Notification({
        title: '提示',
        message: '没有选中的控件。',
        position: 'bottom-right',
        duration: 1000
      })
      return
    }
    try {
      await MessageBox.confirm('是否删除选中的控件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      for (const selectedId of this.selectedIds) {
        if (selectedId) {
          this.deleteWidgetConfigById(selectedId)
        }
      }
    } catch (error) { /** */}
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

  /** 获取组件的绝对位置 */
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

    /** 解组选中的组件 */
  public ungroupSelectedWidgetConfigs() {
    // 取消组
    const singleSelectedWidgetConfig = this.singleSelectedWidgetConfig

    if (
      singleSelectedWidgetConfig &&
      singleSelectedWidgetConfig.isGroup
    ) {
      const parentId = singleSelectedWidgetConfig.parentId
      const children = singleSelectedWidgetConfig.children
      for (const child of children) {
        child.x += singleSelectedWidgetConfig.x
        child.y += singleSelectedWidgetConfig.y
        child.parentId = parentId
      }
      
      const parentWidget = this.getWidgetConfigById(parentId)

      if (parentWidget) {
        const index = parentWidget.children.indexOf(singleSelectedWidgetConfig)
        parentWidget.children.splice(index, 1, ...children)
      } else {
        const index = this.dataScreenConfig.widgetConfigs.indexOf(singleSelectedWidgetConfig)
        this.dataScreenConfig.widgetConfigs.splice(index, 1, ...children)
      }
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

  public mounted() {
    if (!this.content) {
      this.content = this.dataScreenConfig.generateCode()
    }
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
    text-align: left;
    padding-left: 5px;
    height: 32px;
    line-height: 28px;
    background: $panel-background-color;
  }

  .preview,
  .code-editor {
    height: calc(100% - 34px);
  }

  &.design-code {
    .preview,
    .code-editor {
      height: calc(50% - 17px);
    }
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
