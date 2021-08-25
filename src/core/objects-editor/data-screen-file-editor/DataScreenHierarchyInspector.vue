<template>
  <div
    class="DataScreenHierarchyInspector"
    @contextmenu.prevent="dataScreenFileEditor.handleContextmenu"
  >
    <vue-drag
      group="widgetConfigs"
      handle=".label"
      v-model="widgetConfigs"
      :bubbleScroll="false"
      :animation="150"
      @change="handleChange"
    >
      <DataScreenHierarchyNode
        v-for="(widgetConfig, index) in widgetConfigs"
        :class="index === 0 ? 'first-node' : ''"
        :key="widgetConfig.id"
        :widgetConfig="widgetConfig"
      ></DataScreenHierarchyNode>
    </vue-drag>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import draggable from 'vuedraggable'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'
import DataScreenFileEditor from './DataScreenFileEditor.vue'
import DataScreenHierarchyNode from './DataScreenHierarchyNode.vue'
import { WidgetConfig } from './DataScreenModels'

@Component({
  components: {
    DataScreenHierarchyNode,
    'vue-drag': draggable
  }
})
export default class DataScreenHierarchyInspector extends Vue {
  @Inject('projectEditor')
  public projectEditor!: ProjectEditor

  public get dataScreenFileEditor() {
    return this.projectEditor.currentObjectEditor as DataScreenFileEditor
  }

  public get dataScreenConfig() {
    return this.dataScreenFileEditor.dataScreenConfig
  }

  public get widgetConfigs() {
    return this.dataScreenConfig.widgetConfigs
  }

  public set widgetConfigs (widgetConfigs) {
    if (this.dataScreenConfig && widgetConfigs) {
      this.dataScreenConfig.widgetConfigs = widgetConfigs
    }
  }

  private handleChange ({ added }: { added: { element: WidgetConfig } }) {
    if (added) {
      const widgetConfig = added.element as WidgetConfig
      const {x, y} = this.dataScreenFileEditor.getAbsolutePosition(widgetConfig.id)
      widgetConfig.x = x
      widgetConfig.y = y
      widgetConfig.parentId = ''
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.DataScreenHierarchyInspector {
  height: 100%;
  overflow-y: auto;
  .first-node {
    border-top: solid 1px rgba($border-color, 0.5);
  }
}
</style>
