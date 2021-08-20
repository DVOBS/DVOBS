<template>
  <div class="DataScreenPropertyInspector">
    <template v-if="selectedWidgetConfigs.length === 0">
      <PropertyItem
        label="宽度"
        prop="width"
        type="number"
        :object="dataScreenConfig"
        :min="0"
        :step="1"
      />
      <PropertyItem
        label="高度"
        prop="height"
        type="number"
        :object="dataScreenConfig"
        :min="0"
        :step="1"
      />
      <PropertyItem
        label="背景颜色"
        prop="bgColor"
        type="color"
        :object="dataScreenConfig"
        :min="0"
        :step="1"
      />
      <PropertyItem
        label="背景图片"
        prop="bgImage"
        type="select"
        :object="dataScreenConfig"
        :options="fileOptions"
      />
    </template>
    <template v-else-if="selectedWidgetConfigs.length === 1">
      <PropertyItem
        label="ID"
        prop="id"
        type="text"
        :object="singleSelectedWidgetConfig"
      />
      <PropertyItem
        label="名称"
        prop="name"
        type="string"
        :object="singleSelectedWidgetConfig"
      />
      <PropertyItem
        label="X 坐标"
        prop="x"
        type="number"
        :object="singleSelectedWidgetConfig"
        :step="1"
      />
      <PropertyItem
        label="Y 坐标"
        prop="y"
        type="number"
        :object="singleSelectedWidgetConfig"
        :step="1"
      />
      <PropertyItem
        label="宽度"
        prop="width"
        type="number"
        :object="singleSelectedWidgetConfig"
        :step="1"
      />
      <PropertyItem
        label="高度"
        prop="height"
        type="number"
        :object="singleSelectedWidgetConfig"
        :step="1"
      />
      <el-collapse>
        <el-collapse-item
          v-for="propsGroup in propsGroups"
          :key="propsGroup.name"
          :name="propsGroup.name"
          :title="propsGroup.name"
        >
          <template v-for="prop in propsGroup.props">
            <PropertyItem
              type="string"
              v-if="prop.type === 'string'" 
              :key="prop.key"
              :label="prop.name"
              :object="attrs"
              :prop="prop.key"
            />
            <PropertyItem
              type="color"
              v-else-if="prop.type === 'color'" 
              :key="prop.key"
              :label="prop.name"
              :object="attrs"
              :prop="prop.key"
            />
            <PropertyItem
              type="number"
              v-else-if="prop.type === 'number'" 
              :key="prop.key"
              :object="attrs"
              :prop="prop.key"
              :label="prop.name"
              :max="prop.max"
              :min="prop.min"
              :step="prop.step"
            />
            <span v-else type="number" :key="prop.key">{{prop}}</span>
          </template>
        </el-collapse-item>
      </el-collapse>
    </template>
    <template v-else>
      多选
    </template>
    <br>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import PropertyItem from '@/core/common/property-item/PropertyItem.vue'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'
import DataScreenFileEditor from './DataScreenFileEditor.vue'
import { getWidgetDefinition } from '@/widgets-data-screen'

@Component({
  components: {
    PropertyItem
  }
})
export default class DataScreenPropertyInspector extends Vue {
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

  public get propsGroups() {
    return this.widgetDefinition?.propsGroups || []
  }

  public get attrs() {
    return this.singleSelectedWidgetConfig?.attrs || {}
  }

  public get fileOptions() {
    const allProjectFile = this.projectEditor.allProjectFile
    return Array.from(allProjectFile)
      .filter(([path]) => path.endsWith('.png'))
      .map(([path]) => ({
        label: path,
        value: path
      }))
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.DataScreenPropertyInspector {
  height: calc(100% - 10px);
  margin-top: 5px;
  padding: 0px 10px 0;
  overflow-y: auto;
}
</style>
