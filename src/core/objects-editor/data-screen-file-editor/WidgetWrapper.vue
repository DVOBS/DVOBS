<template>
  <div
    v-show="visible"
    class="WidgetWrapper"
    :class="{ isGroup }"
    :style="style"
  >
    <template v-if="!this.isGroup">
      <component
        v-if="component"
        v-bind="attrs"
        :is="component"
        :dataSource="dataSource"
      ></component>
    </template>
    <template v-else>
      <WidgetWrapper
        v-for="child in children"
        :key="child.id"
        :widgetConfig="child"
      ></WidgetWrapper>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from 'vue-property-decorator'
import { addListener, removeListener } from 'resize-detector'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'
import { getWidgetDefinition } from '@/core/widgets-data-screen'
import { WidgetConfig } from './DataScreenModels'
import { decode } from 'js-base64'
import { parse } from 'papaparse'

@Component({
  name: 'WidgetWrapper'
})
export default class WidgetWrapper extends Vue {
  @Inject('projectEditor')
  public projectEditor!: ProjectEditor

  @Prop()
  public widgetConfig !: WidgetConfig

  private clientWidth = -1
  private clientHeight = -1

  public get isGroup() {
    return this.widgetConfig.isGroup
  }

  public get children() {
    return this.widgetConfig.children
  }

  private get autoSize() {
    return this.widgetConfig.isGroup || this.widgetDefinition?.autoSize
  }

  public get style() {
    const autoSize = this.autoSize
    const widgetConfig = this.widgetConfig
    const width = Math.round(autoSize ? widgetConfig.runtimeWidth: widgetConfig.width)
    const height = Math.round(autoSize ? widgetConfig.runtimeHeight: widgetConfig.height)
    const left = Math.round(widgetConfig.x)
    const top = Math.round(widgetConfig.y)

    const style = {
      width: autoSize? 'auto' : (width + 'px'),
      height: autoSize? 'auto' : (height + 'px'),
      left: left + 'px',
      top: top + 'px',
      marginLeft: '',
      marginTop: '',
    }

    if (widgetConfig.anchor === 'right-top') {
      style.marginLeft = `-${width}px`
    }

    if (widgetConfig.anchor === 'center') {
      style.marginLeft = `-${width / 2}px`
      style.marginTop = `-${height / 2}px`
    }

    if (widgetConfig.anchor === 'left-bottom') {
      style.marginTop = `-${height}px`
    }

    if (widgetConfig.anchor === 'right-bottom') {
      style.marginLeft = `-${width}px`
      style.marginTop = `-${height}px`
    }

    if (widgetConfig.anchor === 'center-top') {
      style.marginLeft = `-${width / 2}px`
    }

    if (widgetConfig.anchor === 'center-bottom') {
      style.marginLeft = `-${width / 2}px`
      style.marginTop = `-${height}px`
    }

    if (widgetConfig.anchor === 'left-center') {
      style.marginTop = `-${height / 2}px`
    }

    if (widgetConfig.anchor === 'right-center') {
      style.marginLeft = `-${width}px`
      style.marginTop = `-${height / 2}px`
    }

    return style
  }

  public get widgetDefinition() {
    return getWidgetDefinition(this.widgetConfig.widgetTag)
  }

  public get component() {
    return this.widgetDefinition?.component
  }

  public get attrs() {
    return this.widgetConfig.attrs
  }

  public get visible() {
    return this.widgetConfig.visible
  }

  public get dataSource() {
    const dataFilePath = this.widgetConfig.dataFile
    const dataFile = this.projectEditor.allProjectFile.get(dataFilePath)
    try {
      if (dataFile && dataFilePath.endsWith('.json')) {
        return JSON.parse(decode(dataFile?.base64))
      } else if (dataFile && dataFilePath.endsWith('.csv')) {
        return parse(decode(dataFile?.base64), {header: true, dynamicTyping: true})
      }
    } catch (error) {
      console.log(error)
    }

    return {}
  }

  private resizeHandler() {
    const $el = this.$el
    const width = $el.clientWidth
    const height = $el.clientHeight
    this.clientWidth = width
    this.clientHeight = height
    this.widgetConfig.runtimeWidth = width
    this.widgetConfig.runtimeHeight = height
  }

  @Watch('widgetConfig')
  private handleWidgetConfigChange() {
    this.widgetConfig.runtimeWidth = this.clientWidth
    this.widgetConfig.runtimeHeight = this.clientHeight
  }

  private async mounted () {
    this.resizeHandler()
    addListener(this.$el as HTMLElement, this.resizeHandler)
  }

  private beforeDestroy () {
    removeListener(this.$el as HTMLElement, this.resizeHandler)
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.WidgetWrapper {
  position: absolute;
  // background: rgba(255,0,0,0.25);
  // &.isGroup {
  //   background: rgba(0,0,255,0.25);
  // }
}
</style>
