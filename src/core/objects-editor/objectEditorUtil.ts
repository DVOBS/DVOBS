import EditableObject from "@/core/model/EditableObject";
import ProjectFile from "@/core/model/ProjectFile";
import DataScreenFileEditor from '@/core/objects-editor/data-screen-file-editor/DataScreenFileEditor.vue'
import ImageEditor from '@/core/objects-editor/image-file-editor/ImageEditor.vue'
import OsmFileEditor from '@/core/objects-editor/osm-file-editor/OsmFileEditor.vue'
import KonvaFileEditro from '@/core/objects-editor/konva-file-editor/KonvaFileEditro.vue'
import CsvFileEditor from '@/core/objects-editor/csv-file-editor/CsvFileEditor.vue'
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
    name: '数据大屏',
    constructor: ProjectFile,
    editor: DataScreenFileEditor,
    fileSuffix: 'data-screen.vue',
    icon: ['fab', 'vuejs'],
    color: '#3fb884'
  }, {
    name: 'OSM 文件',
    constructor: ProjectFile,
    editor: OsmFileEditor,
    fileSuffix: '.osm',
    icon: ['far', 'map'],
    color: '#3f84b8'
  }, {
    name: 'Konva 文件',
    constructor: ProjectFile,
    editor: KonvaFileEditro,
    fileSuffix: 'konva.json',
    icon: ['far', 'map'],
    color: '#3f84b8'
  }, {
    name: 'CSV 文件',
    constructor: ProjectFile,
    editor: CsvFileEditor,
    fileSuffix: 'csv',
    icon: ['fas', 'file-csv'],
    color: '#3f84b8'
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
