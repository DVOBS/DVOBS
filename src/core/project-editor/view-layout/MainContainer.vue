<template>
  <div class="MainContainer">
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
      </svg>
      <div class="drag-reminder" :class="dragPostion"></div>
      <!-- <portal-target
        class="portal-target"
        :name="node.name"
      ></portal-target> -->
      <CrossRenderView
        class="portal-target"
        :name="node.name"
      ></CrossRenderView>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject, Prop } from 'vue-property-decorator'
import draggable from "vuedraggable"
import ViewLayout from './ViewLayout.vue'
import { MainLayoutNode } from './layout'
import CrossRenderView from '@/core/common/cross-render/CrossRenderView.vue'

@Component({
  components: {
    'vue-drag': draggable,
    CrossRenderView
  }
})
export default class MainContainer extends Vue {
  @Inject('layout')
  public layout!: ViewLayout

  @Prop()
  public node!: MainLayoutNode

  public dragPostion = ''

  public activeIndex = 0
  
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
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.MainContainer {
  height: 100%;

  .body {
    position: relative;
    margin-top: 0px;
    width: 100%;
    height: 100%;
    background: $panel-background-color;
    box-shadow: 0px -1px 0px 0px #181818;
  }

  .portal-target {
    height: 100%;
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
