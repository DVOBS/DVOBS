<template>
  <div class="DataScreenWidgetLibrary">
    <div class="filter">
      <el-input placeholder="请输入组件名称" size="mini"></el-input>
    </div>
      <el-collapse>
        <el-collapse-item
          v-for="group in widgetDefinitionGroups"
          :key="group.name"
          :name="group.name"
          :title="group.displayName"
        >
          <div class="widget-definitions">
            <div
              class="widget-definition"
              v-for="widgetDefinition in group.widgetDefinitions"
              :key="widgetDefinition.tag"
              draggable="true"
              @dragstart="handleWidgetDragStart(widgetDefinition, $event)"
              @click="handleWidgetClick(widgetDefinition)"
            >
              <span class="widget-icon">
                <font-awesome-icon
                  :icon="['fas', 'font']"
                />
              </span>
              <span class="widget-name">{{widgetDefinition.displayName}}</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { widgetGroups } from '@/widgets-data-screen/index'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'
import DataScreenFileEditor from './DataScreenFileEditor.vue'
import { WidgetDefinition } from '@/widgets-data-screen/WidgetDefinition'

@Component
export default class DataScreenWidgetLibrary extends Vue {
  @Inject('projectEditor')
  public projectEditor!: ProjectEditor

  public get dataScreenFileEditor() {
    return this.projectEditor.currentObjectEditor as DataScreenFileEditor
  }

  public get widgetDefinitionGroups() {
    return widgetGroups
  }

  private handleWidgetClick(widgetDefinition: WidgetDefinition) {
    this.dataScreenFileEditor.addWidget(widgetDefinition.tag)
  }

  private handleWidgetDragStart (widgetDefinition: WidgetDefinition, event: DragEvent) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('widgetDefinitionTag', widgetDefinition.tag)
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.DataScreenWidgetLibrary {
  height: 100%;
  padding: 10px;
  .filter {
    padding: 0px 0px 5px;
  }
  .widget-definitions {
    padding: 0px 5px;
  }
  .widget-definition {
    border: 1px solid $input-border-color;
    background: $input-background-color;
    height: 32px;
    line-height: 30px;
    cursor: pointer;
    margin-bottom: 5px;
  }
  .widget-icon {
    display: inline-block;
    height: 100%;
    padding: 0 10px;
    border-right: 1px solid $input-border-color;
  }
  .widget-name {
    padding: 0 10px;
  }
}
</style>
