<template>
  <div class="ViewPanelTabs">
    <div class="tabs" ref="tabs" @wheel.passive="handleWhell">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab"
        :class="{
          active: activeIndex === index
        }"
        draggable="true"
        @dragstart="handleDragstart(tab)"
        @click="activeIndex = index"
      >{{tab.label}}</div>
    </div>
    <div class="body">
      <portal-target
        class="portal-target"
        v-for="(v, index) in tabs"
        v-show="activeIndex === index"
        :key="v.name"
        :name="v.name"
      ></portal-target>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

interface viewinfo {
  name: string, label: string
}

@Component
export default class ViewPanelTabs extends Vue {
  @Prop({  type: Array, required: true })
  private tabs!: viewinfo[]

  private activeIndex = 0

  private handleWhell() {
    //
  }

  private handleDragstart() {
    //
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.ViewPanelTabs {
  height: 100%;
  border-left: solid 1px $border-color;
  border-right: solid 1px $border-color;

  .tabs {
    height: $panel-header-height;
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
    display: flex;
    margin-top: 0px;
    width: 100%;
    height: calc(100% - #{$header-height});
    background: $panel-background-color;
    box-shadow: 0px -1px 0px 0px #181818;
  }

  .portal-target {
    width: 100%;
    height: 100%;
  }
}
</style>
