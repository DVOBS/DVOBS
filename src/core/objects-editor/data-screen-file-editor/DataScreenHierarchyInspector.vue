<template>
  <div class="DataScreenHierarchyInspector">
    <DataScreenHierarchyNode
      v-for="(widgetConfig, index) in widgetConfigs"
      :class="index === 0 ? 'first-node' : ''"
      :key="widgetConfig.id"
      :widgetConfig="widgetConfig"
    ></DataScreenHierarchyNode>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'
import DataScreenFileEditor from './DataScreenFileEditor.vue'
import DataScreenHierarchyNode from './DataScreenHierarchyNode.vue'

@Component({
  components: {
    DataScreenHierarchyNode
  }
})
export default class DataScreenHierarchyInspector extends Vue {
  @Inject('projectEditor')
  public projectEditor!: ProjectEditor

  public get currentObjectEditor() {
    return this.projectEditor.currentObjectEditor as DataScreenFileEditor
  }

  public get dataScreenConfig() {
    return this.currentObjectEditor.dataScreenConfig
  }

  public get widgetConfigs() {
    return this.dataScreenConfig.widgetConfigs
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
