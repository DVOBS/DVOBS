<template>
  <div class="ViewPanelTabs">
    <div class="tabs" ref="tabsDiv" @wheel.passive="handleWhell">
      <!--  -->
      <vue-drag
        v-model="innerTabs"
        group="ViewPanelTabs"
        @add="handleAdd"
        @end="handleEnd"
      >
        <div
          v-for="(tab) in innerTabs"
          :key="tab"
          class="tab"
          :class="{
            active: activeTab === tab
          }"
          draggable="true"
          @dragstart="handleDragstart(tab)"
          @click="activeTab = tab"
        >{{getViewinfoLabel(tab)}}</div>
      </vue-drag>
    </div>
    <div class="body">
      <svg
        v-show="layout.dragTab"
        class="drag-area"
        preserveAspectRatio="none"
        viewBox="0,0,100,100"
        @dragleave="dragPostion = ''"
      >
        <polygon
          points="0 0 100 0 50 50"
          style="fill:rgba(0,0,0,0)"
          @dragover="handleDragover($event, 'top')"
          @drop.stop="handleDrop('top')"
        />
        <polygon
          points="0 100 100 99 50 50"
          style="fill:rgba(0,0,0,0)"
          @dragover="handleDragover($event, 'bottom')"
          @drop.stop="handleDrop('bottom')"
        />
        <polygon
          points="0 0 0 100 50 50"
          style="fill:rgba(0,0,0,0)"
          @dragover="handleDragover($event, 'left')"
          @drop.stop="handleDrop('left')"
        />
        <polygon
          points="100 0 100 100 50 50"
          style="fill:rgba(0,0,0,0)"
          @dragover="handleDragover($event, 'right')"
          @drop.stop="handleDrop('right')"
        />
        <!-- <polygon
          points="25 25 75 25 75 75 25"
          style="fill:rgba(0,0,0,0)"
          @dragover="handleDragover($event, 'center')"
          @drop.stop="handleDrop('center')"
        /> -->
      </svg>
      <div class="drag-reminder" :class="dragPostion"></div>
      <!-- <portal-target
        class="portal-target"
        v-for="tab in innerTabs"
        v-show="activeTab === tab"
        :key="tab"
        :name="tab"
      ></portal-target> -->
      <CrossRenderView
        class="portal-target"
        v-for="tab in innerTabs"
        v-show="activeTab === tab"
        :key="tab"
        :name="tab"
      ></CrossRenderView>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Ref, Inject, Model, Watch } from 'vue-property-decorator'
import draggable from "vuedraggable"
import ViewLayout from './ViewLayout.vue'
import CrossRenderView from '@/core/common/cross-render/CrossRenderView.vue'

@Component({
  components: {
    'vue-drag': draggable,
    CrossRenderView
  }
})
export default class ViewPanelTabs extends Vue {
  @Inject('layout')
  public layout!: ViewLayout

  @Model('change', { type: Array })
  readonly tabs!:  string[]

  @Ref()
  public tabsDiv!: HTMLDivElement

  public dragPostion = ''

  public get innerTabs() {
    return this.tabs
  }

  public set innerTabs(value: string[]) {
    this.$emit('change', value)
  }

  public get isEmpty() {
    return this.innerTabs.length === 0
  }

  @Watch('isEmpty', { immediate: true})
  public isEmptyChange(isEmpty: boolean) {
    if (isEmpty) {
      this.$emit('remove')
    }
  }

  public getViewinfo(key: string) {
    return this.layout.viewinfoMap[key]
  }

  public getViewinfoLabel(key: string) {
    return this.getViewinfo(key)?.label || ''
  }

  public activeTab = ''

  @Watch('activeTab')
  @Watch('innerTabs',{ immediate: true })
  public activeTabCheck() {
    if (this.innerTabs.indexOf(this.activeTab) !== -1) {
      return
    }
    this.activeTab = this.innerTabs[0] || ''
  }

  public handleWhell(event: WheelEvent) {
    const dy = event.deltaY / 5
    const tabsDiv = this.tabsDiv
    const scrollLeft = tabsDiv.scrollLeft
    tabsDiv.scrollTo({
      left: scrollLeft + dy
    })
  }

  public handleDragstart(tabName: string) {
    this.layout.dragTab = tabName
    this.layout.dragTabs = this
  }
  
  public handleDragover(event: DragEvent, dragPostion: string) {
    event.preventDefault()
    this.dragPostion = dragPostion
  }

  public handleDrop(postion: string) {
    this.dragPostion = ''
    setTimeout(() => {
      this.$emit('tabDrop', postion)
    }, 0);
  }

  public handleAdd() {
    this.activeTab = this.layout.dragTab
    this.layout.dragTabs = this
  }

  public handleEnd() {
    setTimeout(() => {
      this.activeTab = ''
      this.layout.isDraging = false
      this.layout.dragTab = ''
      this.layout.dragTabs = null
    }, 100);
  }

  public removeTab(tab: string) {
    const index = this.innerTabs.indexOf(tab)
    if (index > -1) { 
      this.innerTabs.splice(index, 1)
    }
  }

  public containTab(tab: string) {
    this.innerTabs.indexOf(tab) !== -1
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.ViewPanelTabs {
  height: 100%;

  .tabs {
    height: $panel-header-height;
    background: $panel-background-dark-color;
    white-space: nowrap;
    overflow-y: hidden;
    overflow-x: auto;
  }

  .tab {
    display: inline-block;
    position: relative;
    height: $panel-header-height;
    line-height: $panel-header-height;
    padding: 0 10px 0 10px;
    background: transparent;
    border-right: solid 1px $border-color;
    font-size: 12px;
    color: $text-color;
    cursor: pointer;
  }

  .tab:last-child {
    margin-right: 75px;
  }

  .tab.active {
    // border-top: solid 1px $border-color;
    background: $panel-background-color;
    box-shadow: 0 -1px 1px 0px $border-color;
  }

  .body {
    position: relative;
    display: flex;
    margin-top: 0px;
    width: 100%;
    height: calc(100% - #{$panel-header-height});
    background: $panel-background-color;
    // box-shadow: 0px -1px 0px 0px #181818;
  }

  .drag-area {
    position: absolute;
    display: block;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.25);
    z-index: 31;
  }

  .drag-reminder {
    position: absolute;
    background: rgba($primary-color, 0.25);
    z-index: 30;
  }

  .drag-reminder.top {
    top: 0;
    bottom: 50%;
    left: 0;
    right: 0;
  }

  .drag-reminder.bottom {
    top: 50%;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .drag-reminder.left {
    top: 0;
    bottom: 0;
    left: 0;
    right: 50%;
  }

  .drag-reminder.right {
    top: 0;
    bottom: 0;
    left: 50%;
    right: 0;
  }

  .drag-reminder.center {
    top: 25%;
    bottom: 25%;
    left: 25%;
    right: 25%;
  }

  .portal-target {
    width: 100%;
    height: 100%;
  }
}
</style>
