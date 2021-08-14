<template>
  <div
    class="DirectoryItem"
    :class="{ root }"
    @contextmenu.stop.prevent="handleContextmenu"
  >
    <div class="directory"
      :class="{ expanded, fade }"
      v-if="!root"
      @click="expanded = !expanded"
    >
      <font-awesome-icon
        class="arrow-icon"
        :icon="expanded ? ['fas', 'chevron-down'] : ['fas', 'chevron-right']"
      />
      <font-awesome-icon
        class="icon expanded"
        :icon="expanded ? ['fas', 'folder-open'] : ['fas', 'folder']"
      />
      <!-- <span class="name">{{directory.name}}</span> -->
      <NameEditor
        class="name"
        ref="nameEditor"
        v-model="directory.name"
      ></NameEditor>
    </div>
    <div
      v-if="expanded || root"
      :class="root ? '' : 'children'"
      @contextmenu.stop.prevent
    >
      <CreateNew :isDirectory="true" ref="directoryCreateNew"/>
      <DirectoryItem
        v-for="item in directorys"
        :selected="selected"
        :directory="item"
        :key="item.name"
      ></DirectoryItem>
      <CreateNew ref="fileCreateNew" />
      <FileItem
        v-for="item in files"
        :selected="selected"
        :file="item"
        :key="item.name"
      ></FileItem>
    </div>
    <ContextMenu ref="contextMenu">
      <MeunItem label="新建文件" @click="openCrfeateNew('file')"></MeunItem>
      <MeunItem label="新建文件夹" @click="openCrfeateNew('directory')"></MeunItem>
      <MeunItem label="文件夹内查找"></MeunItem>
      <MeunItem label="复制路径"></MeunItem>
      <MeunItemSplitLine></MeunItemSplitLine>
      <MeunItem label="重命名" @click="nameEditor.startInput()"></MeunItem>
      <MeunItem label="删除"></MeunItem>
    </ContextMenu>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Inject, Ref } from 'vue-property-decorator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import { MessageBox } from 'element-ui'
import ProjectDirectory from '@/core/model/ProjectDirectory'
import ProjectFile from '@/core/model/ProjectFile'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'
import FileItem from './FileItem.vue'
import NameEditor from './NameEditor.vue'
import CreateNew from './CreateNew.vue'
import ContextMenu from '@/core/project-editor/context-menu/ContextMenu.vue'
import MeunItem from '@/core/project-editor/context-menu/MeunItem.vue'
import MeunItemSplitLine from '@/core/project-editor/context-menu/MeunItemSplitLine.vue'
import FileExplorer from './FileExplorer.vue'

@Component({
  name: 'DirectoryItem',
  components: {
    FontAwesomeIcon,
    FileItem,
    NameEditor,
    CreateNew,
    ContextMenu,
    MeunItem,
    MeunItemSplitLine
  }
})
export default class DirectoryItem extends Vue {
  @Inject('projectEditor')
  public projectEditor!: ProjectEditor

  @Inject('fileExplorer')
  public fileExplorer!: FileExplorer

  @Ref()
  public nameEditor!: NameEditor

  @Ref()
  public contextMenu! :ContextMenu

  @Prop()
  public directory!: ProjectDirectory

  @Prop()
  public selected!: (ProjectDirectory | ProjectFile)[]

  @Prop({
    required: false,
    default: false
  })
  public root!: boolean

  public expanded = false;

  public get fade() {
    return this.fileExplorer.fade
  }

  public get siblings() {
    if (this.$parent instanceof DirectoryItem) {
      const directorys = this.$parent.directory.directorys
      const files = this.$parent.directory.files

      return [...directorys.filter(d => d !== this.directory), ...files]
    }
    return []
  }

  public get directorys() {
    return this.directory.directorys
  }

  public get files() {
    return this.directory.files
  }

  public handleContextmenu(event: MouseEvent) {
    this.contextMenu.open(event.clientX, event.clientY)
    // const meunItems = [{
    //     name: '新建文件',
    //     handler: () => { this.openCrfeateNew('file') }
    //   }, {
    //     name: '新建文件夹',
    //     handler: () => { this.openCrfeateNew('directory') }
    //   }, {
    //     name: 'split-line'
    //   }, {
    //     name: '文件夹内查找',
    //     handler: () => { /*  */}
    //   }, {
    //     name: '复制路径',
    //     handler: () => { /*  */}
    //   }
    // ]

    // if (!this.root) {
    //   meunItems.push({
    //     name: 'split-line'
    //   }, {
    //     name: '重命名',
    //     handler: () => {
    //       // this.nameEditor.startInput()
    //     }
    //   }, {
    //     name: '删除',
    //     handler: async () => {
    //       try {
    //         await MessageBox.confirm(`是否删除文件 ${this.directory.name} ！`, '警告')
    //         this.remove()
    //       } catch (error) {/*  */}
    //     }
    //   })
    // }

    // this.appEditor.openContextmenu(event, meunItems)
  }

  public blur () {
    const newInput = this.$refs.newInput as HTMLInputElement
    newInput.blur()
  }

  public openCrfeateNew(type: string) {
    this.expanded = true
    this.$nextTick(() => {
      let createNew!: CreateNew
      if (type === 'directory') {
        createNew = this.$refs.directoryCreateNew as CreateNew
      } else {
        createNew = this.$refs.fileCreateNew as CreateNew
      }
      createNew.open()
    })
  }

  public remove() {
    const parent = this.$parent as DirectoryItem
    const directorys = parent.directory.directorys
    const index = directorys.indexOf(this.directory)
    if (index >= 0) {
      directorys.splice(index, 1);
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
$folderColor: #90a4ae;

.DirectoryItem {
  &.root {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .directory {
    position: relative;
    padding: 0 10px;
    height: 26px;
    line-height: 26px;
    color: #babaca;
    cursor: pointer;
  }
  .fade {
    opacity: 0.25;
  }
  .arrow-icon {
    display: inline-block;
    position: relative;
    top: -3px;
    width: 10px;
    height: 10px;
    margin-top: 6px;
    margin-right: 5px;
    color: rgba(255,255,255,0.5);
  }
  .icon {
    display: inline-block;
    position: relative;
    top: 0px;
    width: 16px;
    height: 16px;
    margin-top: 5px;
    margin-right: 8px;
    color: $folderColor;
  }
  .name {
    display: inline-block;
    width: calc(100% - 40px);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 13px;
    color: $text-color;
    vertical-align: top;
  }
  .new {
    height: 26px;
    line-height: 26px;
  }
  .new input {
    vertical-align: top;
    height: 24px;
    line-height: 22px;
    margin: 0 0 0 -1px;
    padding: 0;
    background: transparent;
    color: white;
    outline: none;
    border: $primary-color-lighten solid 1px;
  }
  .new .file-icon {
    display: inline-block;
    position: relative;
    top: 0px;
    width: 10px;
    height: 16px;
    margin-left: 14px;
    margin-right: 8px;
    margin-top: 5px;
    vertical-align: super;
  }
  .children {
    position: relative;
    padding-left: 13px;
  }
  &:hover .children::after {
    content: '';
    display: block;
    position: absolute;
    left: 15px;
    top: 0;
    width: 1px;
    height: 100%;
    background: rgba(255,255,255,0.25);
  }
}
</style>
