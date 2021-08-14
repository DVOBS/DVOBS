import EditableObject from "@/core/model/EditableObject";
import ProjectFile from "@/core/model/ProjectFile";
import ImageEditor from '@/core/objects-editor/image-file-editor/ImageEditor.vue'
import FileEditor from '@/core/objects-editor/file-editor/FileEditor.vue'

const allEditorInfos = [
  {
    name: 'PNG 文件',
    constructor: ProjectFile,
    editor: ImageEditor,
    fileSuffix: 'png',
    icon: ['far', 'file-image'],
    color: '#30f8f4'
  }, {
    name: 'Vue 文件',
    constructor: ProjectFile,
    editor: FileEditor,
    fileSuffix: 'vue',
    icon: ['fab', 'vuejs'],
    color: '#3fb884'
  }
]

const defaultEditorInfo = {
  name: '文件',
  constructor: ProjectFile,
  editor: FileEditor,
  fileSuffix: '',
  icon: ['far', 'file'],
  color: '#cd853f'
}

export function getEditorInfo(obj: EditableObject) {
  const find = allEditorInfos.find((editorInfo) => {
    const constructorMatch = obj instanceof editorInfo.constructor
    const fileSuffixMatch = editorInfo.fileSuffix ?
      (obj.name.endsWith(editorInfo.fileSuffix)) :
      true
    return constructorMatch && fileSuffixMatch
  })
  return find || defaultEditorInfo
}
