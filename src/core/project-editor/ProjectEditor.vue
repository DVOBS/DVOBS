<template>
  <div class="ProjectEditor">
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
    <input type="file" ref="fileInput" accept="application/x-zip-compressed" v-show="false">
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Provide } from 'vue-property-decorator'
import Jszip from 'jszip'
import { decode } from 'js-base64'
import axios from 'axios'
import ProjectEditorHeader from './ProjectEditorHeader.vue'
import ProjectMixins from './ProjectMixins'
import ViewLayout from './view-layout/ViewLayout.vue'
import ViewPanel from './view-layout/ViewPanel.vue'
import Project from '../model/Project'
import ProjectDirectory from '../model/ProjectDirectory'
import ProjectFile from '../model/ProjectFile'

import FileExplorer from '@/core/project-editor/views/file-explorer/FileExplorer.vue'

@Component({
  components: { ProjectEditorHeader, ViewLayout, ViewPanel, FileExplorer }
})
export default class ProjectEditor extends Mixins(ProjectMixins) {

  @Provide('projectEditor')
  public get projectEditor (): ProjectEditor { return this }

  private getDefaultProject() {
    axios({
      method: 'get',
      url: './ProjectExamples.zip',
      responseType: 'blob',
    }).then(response => {
      const blob = new Blob([response.data])
      const file = new File([blob], 'ProjectExamples', { type: 'application/x-zip-compressed' })
      this.importProjectZipFile(file)
    })
  }

  private async importProjectZipFile(file: File) {
    try {
      const project = new Project()
      const { files } = await Jszip.loadAsync(file)
      const dirs: { [index: string]: ProjectDirectory} = {}
      for (const [ key, file ] of Object.entries(files).sort()) {
        if (key.endsWith('/')) {
          const array = key.split('/')
          const dir = new ProjectDirectory()
          const name = array[array.length - 2]
          const parentPath = array.slice(0, -2).join('/')
          const path = parentPath ? parentPath + '/' + name : name

          dir.name = array[array.length - 2]
          dirs[path] = dir

          if (parentPath) {
            const parentDirectory = dirs[parentPath]
            if (!parentDirectory) {
              debugger
            }
            parentDirectory.directorys.push(dir)
          } else {
            project.rootDirectory.directorys.push(dir)
          }
        } else {
          const base64 = await file.async('base64')
          // const content = await file.async('string')
          const content = decode(base64)
          // console.log(content)
          // console.log('base64 check is')
          // console.log(base64 === encode(content))
          const array = key.split('/')
          const newFile = new ProjectFile()
          newFile.content = content
          newFile.base64 = base64
          if (array && array.length > 1) {
            // console.log(array)
            const name = array[array.length - 1]
            const parentPath = array.slice(0, -1).join('/')
            const parentDirectory = dirs[parentPath]
            newFile.name = name
            parentDirectory.files.push(newFile)
          } else {
            const name = key
            newFile.name = name
            project.rootDirectory.files.push(newFile)
          }
        }
      }
      this.project = project
    } catch (error) {
      // console.log()
    }
  }

  private mounted() {
    if (!this.project) {
      this.getDefaultProject()
    }
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
}
</style>
