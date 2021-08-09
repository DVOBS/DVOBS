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
import { Component, Vue, Inject } from 'vue-property-decorator'
import ProjectDirectory from '@/core/model/ProjectDirectory'
import ProjectFile from '@/core/model/ProjectFile'
import Project from '@/core/model/Project'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'
import DirectoryItem from './DirectoryItem.vue'

@Component({
  components: { DirectoryItem }
})
export default class FileExplorer extends Vue {
  @Inject('projectEditor')
  private projectEditor!: ProjectEditor

  private selected: (ProjectDirectory|ProjectFile)[]  = []

  private get project() {
    return this.projectEditor.project || new Project()
  }

  private get rootDirectory() {
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
