<template>
  <div class="DataScreenDataInspector">
    <template v-if="selectedWidgetConfigs.length === 1">
      <PropertyItem
        label="数据文件"
        prop="dataFile"
        type="select"
        :object="singleSelectedWidgetConfig"
        :options="fileOptions"
      />
      <div class="editor">
        <component
          v-if="editor"
          :is="editor"
          :object="dataFile"
        ></component>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'
import { getWidgetDefinition } from '@/core/widgets-data-screen'
import DataScreenFileEditor from './DataScreenFileEditor.vue'
import PropertyItem from '@/core/common/property-item/PropertyItem.vue'
import { getEditorInfo } from '../objectEditorUtil'

@Component({
  components: { PropertyItem }
})
export default class DataScreenDataInspector extends Vue {
  @Inject('projectEditor')
  public projectEditor!: ProjectEditor

  public get dataScreenFileEditor() {
    return this.projectEditor.currentObjectEditor as DataScreenFileEditor
  }

  public get dataScreenConfig() {
    return this.dataScreenFileEditor.dataScreenConfig
  }

  public get selectedWidgetConfigs () {
    return this.dataScreenFileEditor.selectedWidgetConfigs
  }

  public get singleSelectedWidgetConfig () {
    return this.dataScreenFileEditor.singleSelectedWidgetConfig
  }

  public get widgetDefinition() {
    return getWidgetDefinition(this.singleSelectedWidgetConfig?.widgetTag || '')
  }

  public get dataFile() {
    const dataFilePath = this.singleSelectedWidgetConfig?.dataFile || ''
    const dataFile = this.projectEditor.allProjectFile.get(dataFilePath)
    return dataFile
  }

  public get editor() {
    if (this.dataFile) {
      return getEditorInfo(this.dataFile).editor
    }
    return null
  }


  public get fileOptions() {
    const allProjectFile = this.projectEditor.allProjectFile
    return [{
      label: '不使数据文件',
      value: ''
    },...Array.from(allProjectFile)
      .filter(([path]) => path.endsWith('.csv') || path.endsWith('.json'))
      .map(([path]) => ({
        label: path,
        value: path
      }))
    ]
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.DataScreenDataInspector {
  height: calc(100% - 10px);
  margin-top: 5px;
  padding: 0px 10px 0;
  overflow-y: auto;
  .editor {
    height: calc(100% - 32px);
  }
}
</style>
