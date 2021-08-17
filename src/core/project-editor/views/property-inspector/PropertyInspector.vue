<template>
  <div class="PropertyInspector">
    <component
      v-if="component"
      :is="component"
    ></component>
    <div class="messgae" v-else>没有可用的属性查看器</div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'

@Component
export default class PropertyInspector extends Vue {
  @Inject('projectEditor')
  public projectEditor!: ProjectEditor

  public get currentObjectEditor() {
    return this.projectEditor.currentObjectEditor
  }

  public get component() {
    return (this.currentObjectEditor as any)?.propertyInspector
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.PropertyInspector {
  height: 100%;
  .messgae {
    padding: 10px;
  }
}
</style>
