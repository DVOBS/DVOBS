import { Component, Vue, Watch } from 'vue-property-decorator'

import Jszip from 'jszip'
import axios from 'axios'
import throttle from 'lodash.throttle'
import localforage from 'localforage'

import Project from '@/core/model/Project'
import ProjectDirectory from '@/core/model/ProjectDirectory'
import ProjectFile from '@/core/model/ProjectFile'
import { JsonConvert } from 'json2typescript'

@Component
export default class ProjectMixins extends Vue {
  public project: Project | null = null

  @Watch('project', { deep: true })
  public async projectChange(project: Project) {
    this.saveChange(project)
  }

  public saveChange = throttle((project) => {
    localforage.setItem('project', project)
  }, 100)

  public getDefaultProject() {
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

  public async importProjectZipFile(file: File) {
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
          // const content = decode(base64)
          // console.log(content)
          // console.log('base64 check is')
          // console.log(base64 === encode(content))
          const array = key.split('/')
          const newFile = new ProjectFile()
          // newFile.content = content
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

  public async mounted() {
    if (!this.project) {
      const projectPlainObject = await localforage.getItem('project')
      if (projectPlainObject) {
        this.project = new JsonConvert().deserializeObject(projectPlainObject, Project)
      } else {
        this.getDefaultProject()
      }
    }
  }
}