<template>
  <div class="FileExplorer">
    <DirectoryItem
      :directory="rootDirectory"
      :root="true"
      :selected="selected">
    </DirectoryItem>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject, Provide } from 'vue-property-decorator'
import ProjectDirectory from '@/core/model/ProjectDirectory'
import ProjectFile from '@/core/model/ProjectFile'
import Project from '@/core/model/Project'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'
import DirectoryItem from './DirectoryItem.vue'

@Component({
  components: { DirectoryItem }
})
export default class FileExplorer extends Vue {
  @Provide('fileExplorer')
  public get FileExplorer() {
    return this
  }

  @Inject('projectEditor')
  public projectEditor!: ProjectEditor

  public fade = false

  public selected: (ProjectDirectory|ProjectFile)[]  = []

  public get project() {
    return this.projectEditor.project || new Project()
  }

  public get rootDirectory() {
    return this.project.rootDirectory
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.FileExplorer {
  widows: 100%;
  height: 100%;
  padding: 5px 0px;
}
</style>
