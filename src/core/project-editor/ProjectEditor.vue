<template>
  <div class="ProjectEditor" @contextmenu.prevent>
    <ProjectEditorHeader></ProjectEditorHeader>
    <ViewLayout class="main">
      <div>
        主视口
      </div>
      <ViewPanel
        label="文件"
        name="file-explorer"
        position="left"
      >
        <FileExplorer v-if="project" :project="project"></FileExplorer>
      </ViewPanel>
      <ViewPanel
        label="组件"
        name="widget-definition"
        position="left"
      ></ViewPanel>
      <ViewPanel
        label="层级"
        name="hierarchy"
        position="left"
      ></ViewPanel>
    </ViewLayout>
    <div
      class="context-menu-mask"
      v-show="contextMenuId"
      @click="closeContextMenu"
    >
      <portal-target
        class="menu-portal-target"
        :style="{
          top: contextMenuY + 'px',
          left: contextMenuX + 'px'
        }"
        :name="contextMenuId"
        @click.native.stop
      ></portal-target>
    </div>
    <input type="file" ref="fileInput" accept="application/x-zip-compressed" v-show="false">
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Provide } from 'vue-property-decorator'
import ProjectEditorHeader from './ProjectEditorHeader.vue'
import ProjectMixins from './ProjectMixins'
import ContextMenuMixins from './ContextMenuMixins'
import ViewLayout from './view-layout/ViewLayout.vue'
import ViewPanel from './view-layout/ViewPanel.vue'

import FileExplorer from '@/core/project-editor/views/file-explorer/FileExplorer.vue'

@Component({
  components: { ProjectEditorHeader, ViewLayout, ViewPanel, FileExplorer }
})
export default class ProjectEditor extends Mixins(ProjectMixins, ContextMenuMixins) {
  @Provide('projectEditor')
  public get projectEditor (): ProjectEditor { return this }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.ProjectEditor {
  min-width: 960px;
  min-height: 600px;
  font-size: 12px;
  color: $text-color;
  background: $background-color;
  .main {
    height: calc(100% - 33px);
  }
  .context-menu-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
  }
  .menu-portal-target {
    position: absolute;
    padding: 5px 0;
    background: $panel-background-color;
    box-shadow: 0px 0px 5px 1px #000000;
    width: 350px;
    z-index: 100;
  }
}
</style>
