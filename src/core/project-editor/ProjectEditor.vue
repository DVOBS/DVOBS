<template>
  <div class="ProjectEditor" @contextmenu.prevent>
    <ProjectEditorHeader></ProjectEditorHeader>
    <ViewLayout class="main">
      <ViewPanel
        label="对象编辑器TAB"
        name="object-eidtor-tabs"
      >
        <ObjectEditorTabs
          ref="objectEditorTabs"
          @changeObject="handleChangeObject"
          @changeEditor="handleChangeEditor"
        ></ObjectEditorTabs>
      </ViewPanel>

      <ViewPanel
        label="文件管理器"
        name="file-explorer"
      >
        <FileExplorer v-if="project" :project="project"></FileExplorer>
      </ViewPanel>
      <ViewPanel
        label="控件库"
        name="widget-library"
      >
        <WidgetLibrary></WidgetLibrary>
      </ViewPanel>
      <ViewPanel
        label="层级管理器"
        name="hierarchy"
      >
        <HierarchyInspector></HierarchyInspector>
      </ViewPanel>
      <ViewPanel
        label="属性查看器"
        name="property-inspector"
      >
        <PropertyInspector></PropertyInspector>
      </ViewPanel>
      <ViewPanel
        label="数据查看器"
        name="data-inspector"
      >
        <p>数据查看器</p>
      </ViewPanel>
      <ViewPanel
        label="控制台"
        name="console"
      >
        <p>控制台</p>
      </ViewPanel>
    </ViewLayout>
    <div
      class="context-menu-mask"
      v-show="contextMenuId"
      @click="closeContextMenu"
    >
      <portal-target
        class="menu-portal-target"
        ref="contextMenu"
        :style="{
          top: contextMenuY + 'px',
          left: contextMenuX + 'px'
        }"
        :name="contextMenuId"
        @click.native.stop
      ></portal-target>
    </div>
    <input
      v-show="false"
      type="file"
      ref="fileInput"
      accept="application/x-zip-compressed"
      @change="handleFileInputChange"
    >
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Provide, Ref, Vue } from 'vue-property-decorator'
import ProjectEditorHeader from './ProjectEditorHeader.vue'
import ProjectMixins from './ProjectMixins'
import ContextMenuMixins from './ContextMenuMixins'
import ViewLayout from './view-layout/ViewLayout.vue'
import ViewPanel from './view-layout/ViewPanel.vue'

import ObjectEditorTabs from '@/core/project-editor/object-editor-tabs/ObjectEditorTabs.vue'
import FileExplorer from '@/core/project-editor/views/file-explorer/FileExplorer.vue'
import PropertyInspector from '@/core/project-editor/views/property-inspector/PropertyInspector.vue'
import HierarchyInspector from '@/core/project-editor/views/hierarchy-inspector/HierarchyInspector.vue'
import WidgetLibrary from '@/core/project-editor/views/widget-library/WidgetLibrary.vue'

import EditableObject from '@/core/model/EditableObject'

@Component({
  components: {
    ProjectEditorHeader,
    ObjectEditorTabs,
    ViewLayout,
    ViewPanel,
    FileExplorer,
    PropertyInspector,
    HierarchyInspector,
    WidgetLibrary
  }
})
export default class ProjectEditor extends Mixins(ProjectMixins, ContextMenuMixins) {
  @Provide('projectEditor')
  public get projectEditor (): ProjectEditor { return this }

  @Ref()
  public objectEditorTabs!: ObjectEditorTabs

  public currentEditableObject: EditableObject | null = null

  public currentObjectEditor: Vue | null = null
  
  public get viewPanels() {
    return []
  }

  public openObjectEditor(object: EditableObject,isPreview = false) {
    return this.objectEditorTabs.openObjectEditor(object, isPreview)
  }

  public handleChangeObject(object: EditableObject| null) {
    this.currentEditableObject = object
  }

  public handleChangeEditor(objectEditor: Vue) {
    this.currentObjectEditor = objectEditor
  }

  private handleKeydown (event: KeyboardEvent) {
    const sub = (this.currentObjectEditor as any)
    if (sub && sub.handleKeydown) {
      sub.handleKeydown(event)
    }
  }

  public async mounted() {
    document.addEventListener('keydown', this.handleKeydown)
  }

  private beforeDestroy () {
    document.removeEventListener('keydown', this.handleKeydown)
  }
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
