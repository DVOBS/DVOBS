<template>
  <div class="WidgetWrapper" :class="{ isGroup }" :style="style">
    <template v-if="!this.isGroup">
      <span>WidgetWrapper</span>
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { WidgetConfig } from './DataScreenModels'
import { addListener, removeListener } from 'resize-detector'

@Component({
  name: 'WidgetWrapper'
})
export default class WidgetWrapper extends Vue {
  @Prop()
  public widgetConfig !: WidgetConfig

  
  public get isGroup() {
    return this.widgetConfig.isGroup
  }

  public get children() {
    return this.widgetConfig.children
  }

  private get autoSize() {
    return this.widgetConfig.isGroup
  }

  private clientWidth = -1
  private clientHeight = -1

  public get style() {
    const autoSize = this.autoSize
    const widgetConfig = this.widgetConfig
    const width = Math.round(autoSize ? widgetConfig.runtimeWidth: widgetConfig.width)
    const height = Math.round(autoSize ? widgetConfig.runtimeHeight: widgetConfig.height)
    const left = Math.round(widgetConfig.x)
    const top = Math.round(widgetConfig.y)

    const style = {
      width: width + 'px',
      height: height + 'px',
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
  background: rgba(255,0,0,0.25);
  &.isGroup {
    background: rgba(0,0,255,0.25);
  }
}
</style>
