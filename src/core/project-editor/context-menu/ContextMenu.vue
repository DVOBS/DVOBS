<template>
  <div class="ContextMenu">
    <portal class="portal" :to="id"><slot></slot></portal>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import shortid from 'shortid'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'

@Component
export default class ContextMenu extends Vue {
  @Inject('projectEditor')
  private projectEditor!: ProjectEditor

  private id = shortid.generate()

  public open(x: number, y: number) {
    this.projectEditor.openContextMenu(this.id, x, y)
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.ContextMenu {
  background: red;
}
</style>
