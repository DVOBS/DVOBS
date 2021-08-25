<template>
  <div
    v-show="visible && (!lock || isSelected)"
    class="WidgetController"
    :class="{
      isSelected,
      hasChildSelected,
      hasChildren
    }"
    :style="style"
    @mousedown="startDrag($event, 'move')"
    @click="handleWidgetControllerClick"
  >
    <template v-if="isSelected">
      <div
        class="position"
        :class="{
          'anchor-right-top': widgetConfig.anchor === 'right-top',
          'anchor-center': widgetConfig.anchor === 'center',
          'anchor-right-bottom': widgetConfig.anchor === 'right-bottom',
          'anchor-left-bottom': widgetConfig.anchor === 'left-bottom',
          'anchor-center-top': widgetConfig.anchor === 'center-top',
          'anchor-center-bottom': widgetConfig.anchor === 'center-bottom',
          'anchor-left-center': widgetConfig.anchor === 'left-center',
          'anchor-right-center': widgetConfig.anchor === 'right-center'
        }"
      >
        <div class="x-line" :style="{ height: yLength + 'px' }">
          <div
            class="value"
            :style="{
              top:  '5px'
            }"
          >X：{{widgetConfig.x}}</div>
        </div>
        <div class="y-line"
          :style="{
            width: xLength + 'px',
          }">
          <div
            class="value"
            :style="{
              left:  '5px'
            }"
          >Y：{{widgetConfig.y}}</div>
        </div>
        <template v-if="!autoSize">
          <span class="control-point top" @mousedown.stop="startDrag($event, 'resize-top')"></span>
          <span class="control-point left" @mousedown.stop="startDrag($event, 'resize-left')"></span>
          <span class="control-point right" @mousedown.stop="startDrag($event, 'resize-right')"></span>
          <span class="control-point bottom" @mousedown.stop="startDrag($event, 'resize-bottom')"></span>
          <span class="control-point top left" @mousedown.stop="startDrag($event, 'resize-top-left')"></span>
          <span class="control-point top right" @mousedown.stop="startDrag($event, 'resize-top-right')"></span>
          <span class="control-point bottom left" @mousedown.stop="startDrag($event, 'resize-bottom-left')"></span>
          <span class="control-point bottom right" @mousedown.stop="startDrag($event, 'resize-bottom-right')"></span>
        </template>
      </div>
    </template>
    <div class="children">
      <WidgetController
        class="child"
        v-for="child in children"
        :key="child.id"
        :widgetConfig="child"
        :inGroup="true"
        :active="isSelected || hasChildSelected"
      ></WidgetController>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'
import CoordinateSystem from '@/core/common/coordinate-system/CoordinateSystem.vue'
import DataScreenFileEditor from './DataScreenFileEditor.vue';
import { WidgetConfig } from './DataScreenModels';
import { getWidgetDefinition } from '@/core/widgets-data-screen';

@Component({
  name: 'WidgetController'
})
export default class WidgetController extends Vue {
  @Inject('coordinate-system')
  private coordinateSystem!: CoordinateSystem;

  @Inject('dataScreenFileEditor')
  private dataScreenFileEditor!: DataScreenFileEditor;

  @Prop()
  public widgetConfig!: WidgetConfig

  @Prop({ required: false, default: false })
  public inGroup!: boolean;

  @Prop({ required: false, default: true })
  public active!: boolean

  public move = false

  private dragModel = ''

  private initialState = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    clientX: 0,
    clientY: 0,
  }

  get widgetDefinition() {
    return getWidgetDefinition(this.widgetConfig.widgetTag)
  }

  get autoSize() {
    return this.widgetConfig.isGroup || this.widgetDefinition?.autoSize
  }

  get children() {
    return this.widgetConfig.children
  }

  get isSelected() {
    return this.dataScreenFileEditor.isSelectedWidgetConfigId(this.widgetConfig.id)
  }

  get hasChildren() {
    return this.widgetConfig.children.length > 0
  }

  get hasChildSelected () {
    return this.widgetConfig.children.findIndex(d => this.dataScreenFileEditor.isSelectedWidgetConfigId(d.id)) !== -1
  }
  
  get style () {
    const scale = this.coordinateSystem.scale
    const widgetConfig = this.widgetConfig
    const autoSize = this.autoSize

    let width = autoSize ? widgetConfig.runtimeWidth : widgetConfig.width
    let height = autoSize ? widgetConfig.runtimeHeight : widgetConfig.height

    width = scale * width
    height = scale * height

    const style = {
      width: width + 1 + 'px',
      height: height + 1 + 'px',
      left: Math.round(widgetConfig.x) * scale - 0.5 + 'px',
      top: Math.round(widgetConfig.y) * scale - 0.5 + 'px',
      marginLeft: '',
      marginTop: ''
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

  get xLength () {
    const scale = this.coordinateSystem.scale
    const widgetConfig = this.widgetConfig
    const anchor = widgetConfig.anchor

    const baseX = widgetConfig.x
    const offsetX = this.coordinateSystem.offsetX
    let anchorRevise = 0

    if (
      anchor === 'center' ||
      anchor === 'center-top' ||
      anchor === 'center-bottom'
    ) {
      anchorRevise = widgetConfig.runtimeWidth / 2
    }

    if (
      anchor === 'right-top' ||
      anchor === 'right-bottom' ||
      anchor === 'right-center'
    ) {
      anchorRevise = widgetConfig.runtimeWidth / 2
    }

    if (this.inGroup) {
      return (baseX - anchorRevise) * scale
    } else {
      return (baseX + offsetX - anchorRevise) * scale
    }
  }

  get yLength () {
    const scale = this.coordinateSystem.scale
    const widgetConfig = this.widgetConfig
    const anchor = widgetConfig.anchor

    const baseY = widgetConfig.y
    const offsetY = this.coordinateSystem.offsetY
    let anchorRevise = 0

    if (
      anchor === 'center' ||
      anchor === 'center-top' ||
      anchor === 'center-bottom'
    ) {
      anchorRevise = widgetConfig.runtimeHeight / 2
    }

    if (
      anchor === 'right-top' ||
      anchor === 'right-bottom' ||
      anchor === 'right-center'
    ) {
      anchorRevise = widgetConfig.runtimeHeight / 2
    }

    if (this.inGroup) {
      return (baseY - anchorRevise) * scale
    } else {
      return (baseY + offsetY - anchorRevise) * scale
    }
  }

  get lock() {
    return this.widgetConfig.lock
  }

  get visible() {
    return this.widgetConfig.visible
  }

  @Watch('children', { immediate: true, deep: true })
  private childrenChange() {
    this.recomputationThrottle()
  }

  private recomputationThrottle = throttle(this.recomputation, 500)

  private recomputationDebounce = debounce(this.recomputation, 100)

  private async recomputation () {
    if (this.children.length > 0) {
      const children = this.children
      const getX0 = (d: WidgetConfig) => {
        if (
          d.anchor === 'right-top' ||
          d.anchor === 'right-center' ||
          d.anchor === 'right-bottom'
        ) {
          return d.x - d.runtimeWidth
        }

        if (
          d.anchor === 'center-top' ||
          d.anchor === 'center' ||
          d.anchor === 'center-bottom'
        ) {
          return d.x - d.runtimeWidth / 2
        }
        return d.x
      }

      const getY0 = (d: WidgetConfig) => {
        if (
          d.anchor === 'left-bottom' ||
          d.anchor === 'center-bottom' ||
          d.anchor === 'right-bottom'
        ) {
          return d.y - d.runtimeHeight
        }

        if (
          d.anchor === 'left-center' ||
          d.anchor === 'center' ||
          d.anchor === 'right-center'
        ) {
          return d.y - d.runtimeHeight / 2
        }
        return d.y
      }
      let x0 = Math.min(...children.map(getX0))
      let y0 = Math.min(...children.map(getY0))

      this.widgetConfig.x += x0
      this.widgetConfig.y += y0

      for (const child of children) {
        child.x -= x0
        child.y -= y0
      }

      await this.$nextTick()

      x0 = Math.min(...children.map(getX0))
      y0 = Math.min(...children.map(getY0))

      const x1 = Math.max(...children.map((d) => {
        const w = d.runtimeWidth
        return getX0(d) + w
      }))
      const y1 = Math.max(...children.map((d) => {
        const h = d.runtimeHeight
        return getY0(d) + h
      }))

      this.widgetConfig.runtimeWidth = x1 - x0
      this.widgetConfig.runtimeHeight = y1 - y0
    }
  }

  public startDrag (event: MouseEvent, dragModel: string) {
    if (!this.isSelected) {
      return
    }

    if (this.lock) {
      return
    }

    this.doStartDrag(event, dragModel)

    const controllers = this.coordinateSystem.controllers as WidgetController[]

    for (const controller of controllers) {
      if (controller !== this && controller.isSelected) {
        controller?.doStartDrag(event, dragModel)
      }
    }

    if (this.inGroup) {
      const group = this.$parent as WidgetController

      const groupRecomputation =  () => {
        if (this.inGroup) {
          const x0 = group.widgetConfig.x
          const y0 = group.widgetConfig.y
          group.recomputation()
          const xi = group.widgetConfig.x - x0
          const yi = group.widgetConfig.y - y0
          
          controllers.forEach((d) => {
            const initialState = d.initialState
            if (initialState) {
              initialState.x -= xi
              initialState.y -= yi
            }
          })
        }
      }

      const mouseupDestory = () => {
        document.removeEventListener('mousemove', groupRecomputation)
        document.removeEventListener('mouseup', mouseupDestory)
      }
      document.addEventListener('mousemove', groupRecomputation, { passive: true })
      document.addEventListener('mouseup', mouseupDestory, { passive: true })
    }
  }

  public doStartDrag (event: MouseEvent, dragModel: string) {  
    if (dragModel === 'move') {
      event.stopPropagation()
    }

    this.dragModel = dragModel
    this.initialState = {
      x: this.widgetConfig.x,
      y: this.widgetConfig.y,
      width: this.widgetConfig.width,
      height: this.widgetConfig.height,
      clientX: event.clientX,
      clientY: event.clientY
    }

    document.addEventListener('mousemove', this.onMoving, { passive: true })
    document.addEventListener('mouseup', this.endDrag, { passive: true })
  }

  private endDrag (event: MouseEvent) {
    this.onMoving(event)

    this.initialState = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      clientX: 0,
      clientY: 0,
    }
    this.dragModel = ''
    window.setTimeout(() => {
      this.move = false
    }, 0)

    document.removeEventListener('mousemove', this.onMoving)
    document.removeEventListener('mouseup', this.endDrag)
  }

  private onMoving(event: MouseEvent) {
    const initialState = this.initialState
    const widgetConfig = this.widgetConfig
    const scale = this.coordinateSystem.scale

    let dx = event.clientX - initialState.clientX
    let dy = event.clientY - initialState.clientY

    let vAnchor = 'top'
    let hAnchor = 'left'

    if (widgetConfig.anchor === 'right-top') {
      hAnchor = 'right'
    }

    if (widgetConfig.anchor === 'center') {
      vAnchor = 'center'
      hAnchor = 'center'
    }

    if (widgetConfig.anchor === 'left-bottom') {
      vAnchor = 'bottom'
    }

    if (widgetConfig.anchor === 'right-bottom') {
      hAnchor = 'right'
      vAnchor = 'bottom'
    }

    if (widgetConfig.anchor === 'center-top') {
      hAnchor = 'center'
      vAnchor = 'top'
    }

    if (widgetConfig.anchor === 'center-bottom') {
      hAnchor = 'center'
      vAnchor = 'bottom'
    }

    if (widgetConfig.anchor === 'left-center') {
      hAnchor = 'left'
      vAnchor = 'center'
    }

    if (widgetConfig.anchor === 'right-center') {
      hAnchor = 'right'
      vAnchor = 'center'
    }

    if (dx !== 0 || dy !== 0) {
      this.move = true
    } else {
      this.move = false
    }

    if (this.dragModel === 'move') {
      this.widgetConfig.x = Number((initialState.x + dx / scale).toFixed())
      this.widgetConfig.y = Number((initialState.y + dy / scale).toFixed())
    }

    if (
      this.dragModel === 'resize-top' ||
      this.dragModel === 'resize-top-left' ||
      this.dragModel === 'resize-top-right'
    ) {
      if (dy >= initialState.height * scale) {
        dy = initialState.height * scale
      }
      if (vAnchor === 'top') {
        this.widgetConfig.y = Number((initialState.y + dy / scale).toFixed())
      }
      this.widgetConfig.height = Number((initialState.height - dy / scale).toFixed())
    }

    if (
      this.dragModel === 'resize-bottom' ||
      this.dragModel === 'resize-bottom-left' ||
      this.dragModel === 'resize-bottom-right'
    ) {
      if (dy < -initialState.height * scale) {
        dy = -initialState.height * scale
      }
      if (vAnchor === 'bottom') {
        this.widgetConfig.y = Number((initialState.y + dy / scale).toFixed())
      }
      this.widgetConfig.height = Number((initialState.height + dy / scale).toFixed())
    }

    if (
      this.dragModel === 'resize-left' ||
      this.dragModel === 'resize-top-left' ||
      this.dragModel === 'resize-bottom-left'
    ) {
      if (dx >= initialState.width * scale) {
        dx = initialState.width * scale
      }
      if (hAnchor === 'left') {
        this.widgetConfig.x = Number((initialState.x + dx / scale).toFixed())
      }
      this.widgetConfig.width = Number((initialState.width - dx / scale).toFixed())
    }

    if (
      this.dragModel === 'resize-right' ||
      this.dragModel === 'resize-top-right' ||
      this.dragModel === 'resize-bottom-right'
    ) {
      if (dx < -initialState.width * scale) {
        dx = -initialState.width * scale
      }
      if (hAnchor === 'right') {
        this.widgetConfig.x = Number((initialState.x + dx / scale).toFixed())
      }
      this.widgetConfig.width = Number((initialState.width + dx / scale).toFixed())
    }
  }

  private handleWidgetControllerClick(event: MouseEvent) {
    if (this.lock) {
      return
    }
  
    let isMove = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current = this as any

    while (
      !isMove &&
      current &&
      typeof current.move === 'boolean'
    ) {
      isMove = current.move
      current = current.$parent || null
    }

    if (isMove) {
      event.stopPropagation()
      return
    }

    if (!this.active) {
      return
    }

    event.stopPropagation()
    this.dataScreenFileEditor.selectWidgetConfig(this.widgetConfig.id, event.ctrlKey)
  }

  private created() {
    this.coordinateSystem.controllers.push(this)
  }

  private destroyed() {
    const controllers = this.coordinateSystem.controllers
    const index = controllers.indexOf(this)
    if (index >= 0) {
      controllers.splice(index, 1);
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';

$selected-color: #ffa500;
$parent-selected-color: rgb(0, 165, 255, 0.5);
$group-color: rgb(0, 165, 255, 0.15);

.WidgetController {
  position: absolute;
  cursor: pointer;

  &.hasChildren {
    border: 1px dashed $group-color;
  }

  &.isSelected,
  &.hasChildSelected {
    border: 1px dashed $selected-color;
    background: rgba(0,0,0,0);
  }

  &.hasChildSelected {
    border-color: $parent-selected-color;
  }

  &.isSelected {
    z-index: 10000;
  }

  .x-line {
    position: absolute;
    left: -1px;
    bottom: 100%;
    width: 1px;
    height: 12000px;
    border-right: dashed 1px $selected-color
  }

  .y-line {
    position: absolute;
    right: 100%;
    bottom: 100%;
    height: 1px;
    width: 12000px;
    border-bottom: dashed 1px $selected-color;
  }

  .position.anchor-right-top .x-line {
    left: 100%;
  }

  .position.anchor-center .x-line {
    left: 50%;
  }

  .position.anchor-center .y-line {
    top: 50%;
  }

  .position.anchor-left-bottom .y-line {
    top: 100%;
  }

  .position.anchor-right-bottom .x-line {
    left: 100%;
  }

  .position.anchor-right-bottom .y-line {
    top: 100%;
  }

  .position.anchor-center-top .x-line {
    left: 50%;
  }

  .position.anchor-center-bottom .x-line {
    left: 50%;
  }

  .position.anchor-center-bottom .y-line {
    top: 100%;
  }

  .position.anchor-left-center .y-line {
    top: 50%;
  }

  .position.anchor-right-center .x-line {
    left: 100%;
  }

  .position.anchor-right-center .y-line {
    top: 50%;
  }

  .value {
    position: absolute;
    display: inline-block;
    padding: 2px 5px;
    background: $panel-background-color;
    white-space: nowrap;
    border: solid 1px $border-color;
    border-radius: 0px;
    z-index: 10;
  }

  .x-line .value {
    top: 5px;
    left: 5px;
  }

  .y-line .value {
    top: 5px;
    left: 5px;
  }

  .control-point {
    display: block;
    height: 20px;
    width: 20px;
    // background: green;
    transform-origin: 50% 50%;
    transform: scale(1);
    position: absolute;
    margin-top: -10px;
    margin-left: -10px;
    z-index: 20;
  }

  .control-point.top {
    top: 0%;
    left: 50%;
    cursor: ns-resize;
  }

  .control-point.left {
    top: 50%;
    left: 0%;
    cursor: ew-resize;
  }

  .control-point.bottom {
    top: 100%;
    left: 50%;
    cursor: ns-resize;
  }

  .control-point.right {
    top: 50%;
    left: 100%;
    cursor: ew-resize;
  }

  .control-point.top.left {
    top: 0%;
    left: 0%;
    cursor: nwse-resize;
  }

  .control-point.top.right {
    top: 0%;
    left: 100%;
    cursor: nesw-resize;
  }

  .control-point.bottom.left {
    top: 100%;
    left: 0%;
    cursor: nesw-resize;
  }

  .control-point.bottom.right {
    top: 100%;
    left: 100%;
    cursor: nwse-resize;
  }

  .control-point::after {
    content: '';
    display: block;
    position: absolute;
    top: 6px;
    left: 6px;
    height: 6px;
    width: 6px;
    // border-radius: 100%;
    background: #fff;
    border: 1px solid $selected-color;
  }

  .children {
    position: absolute;
    top: 0;
    left: 0;
  }

  &.hasChildren>.children {
    top: -0.5px;
    left: -0.5px;
  }
}
</style>
