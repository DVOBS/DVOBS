<template>
  <div
    class="FileItem"
    :class="{ 'is-selected': isSelected }"
    @click="handleClick"
    @dblclick="handleDbClick"
    @contextmenu.stop.prevent="handleContextmenu"
  >
    <font-awesome-icon
      class="object-type-icon"
      :icon="icon"
      :style="{
        color: iconColor,
      }"
    />
    <NameEditor
      class="name"
      ref="nameEditor"
      v-model="file.name"
    ></NameEditor>
    <div class="background"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Inject, Ref } from 'vue-property-decorator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ProjectDirectory from '@/core/model/ProjectDirectory'
import ProjectFile from '@/core/model/ProjectFile'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'
import NameEditor from './NameEditor.vue'
import DirectoryItem from './DirectoryItem.vue'

@Component({
  components: {
    FontAwesomeIcon,
    NameEditor
  }
})
export default class FileItem extends Vue {
  @Inject('projectEditor')
  private projectEditor!: ProjectEditor

  @Ref()
  private nameEditor!: NameEditor

  @Prop()
  private file!: ProjectFile

  @Prop()
  private selected!: (ProjectDirectory | ProjectFile)[]

  public get isSelected () {
    return this.selected.indexOf(this.file) !== -1
  }

  public get siblings() {
    if (this.$parent instanceof DirectoryItem) {
      const directorys = this.$parent.directory.directorys
      const files = this.$parent.directory.files

      return [...directorys, ...files.filter(d => d !== this.file)]
    }
    return []
  }


  private get icon() {
    return ['far', 'file']
  }

  private get iconColor() {
    return '#cd853f'
  }

  private handleContextmenu(event: MouseEvent) {
    console.log(event)
  }

  private handleClick() {
    //
  }

  private handleDbClick() {
    //
  }

  private remove() {
    const parent = this.$parent as DirectoryItem
    const directorys = parent.directory.files
    const index = directorys.indexOf(this.file)
    if (index >= 0) {
      directorys.splice(index, 1);
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.FileItem {
  position: relative;
  height: 26px;
  line-height: 26px;
  color: #babaca;
  cursor: pointer;
  padding: 0 10px;
  .object-type-icon {
    display: inline-block;
    position: relative;
    top: 0px;
    width: 10px;
    height: 16px;
    margin-left: 17px;
    margin-right: 11px;
    margin-top: 5px;
    margin-right: 8px;
    vertical-align: super;
  }
  .name {
    position: relative;
    display: inline-block;
    width: calc(100% - 40px);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 13px;
    color: $text-color;
    z-index: 1;
    vertical-align: top;
  }
  .background {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -1000px;
    right: -6px;
  }
  &:hover .background {
    background: rgba(0,0,0,0.25);
    z-index: 0;
  }
  &.is-selected .background {
    background: red;
  }
}
</style>
