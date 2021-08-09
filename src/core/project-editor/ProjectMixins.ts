import { Component, Vue } from 'vue-property-decorator'

import Jszip from 'jszip'
import { decode } from 'js-base64'
import axios from 'axios'

import Project from '@/core/model/Project'
import ProjectDirectory from '@/core/model/ProjectDirectory'
import ProjectFile from '@/core/model/ProjectFile'

@Component
export default class ProjectMixins extends Vue {
  public project: Project | null = null

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