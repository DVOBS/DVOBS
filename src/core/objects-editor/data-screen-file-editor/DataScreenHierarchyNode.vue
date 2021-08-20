<template>
  <div
    class="DataScreenHierarchyNode"
    :class="{
      'is-selected' : isSelected,
      'is-selected-ancestor': isSelectedAncestor
    }"
    @click.stop="handleClick"
  >
    <div class="label">
      <span
        class="button"
        :class="{ active: visible }"
        @click="visible = !visible"
      >
        <font-awesome-icon
          class="button-icon"
          :icon="['fa', 'eye']"
        />
      </span>
      <span
        class="button"
        :class="{ active: lock }"
        @click="lock = !lock"
      >
        <font-awesome-icon
          class="button-icon lock"
          :icon="['fa', 'lock']"
        />
      </span>
      <span
        class="title"
        :style="{ 'padding-left': level * 15 + 'px' }"
      >
        <span
          class="expand-button"
          v-if="hasChildren"
          @click="expanded = !expanded"
        >
          <font-awesome-icon
            v-if="expanded"
            class="button-icon"
            :icon="['fa', 'chevron-down']"
          />
          <font-awesome-icon
            v-else
            class="button-icon"
            :icon="['fa', 'chevron-right']"
          />
        </span>
        <span class="expand-button" v-else></span>
        <span class="name"><TxtEditor trigger-mode="dbclick" v-model="widgetConfig.name" /></span>
        <span class="select-handler">
          <font-awesome-icon
            class="select-handler-icon"
            :icon="['far', 'square']"
          />
        </span>
      </span>
    </div>
    <div class="children" v-show="expanded">
      <vue-drag
        class="scroll-view"
        group="widgetConfigs"
        handle=".label"
        v-model="children"
        :bubbleScroll="false"
        :animation="150"
        @change="handleChange"
      >
        <DataScreenHierarchyNode
          v-for="child in children"
          :key="child.id"
          :widgetConfig="child"
          :level="level+1"
        ></DataScreenHierarchyNode>
      </vue-drag>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator'
import draggable from 'vuedraggable'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'
import TxtEditor from '@/core/common/text-editor/TxtEditor.vue'
import DataScreenFileEditor from './DataScreenFileEditor.vue'
import { WidgetConfig } from './DataScreenModels'

@Component({
  name: 'DataScreenHierarchyNode',
  components: {
    TxtEditor,
    'vue-drag': draggable,
  }
})
export default class DataScreenHierarchyNode extends Vue {
  @Inject('projectEditor')
  public projectEditor!: ProjectEditor

  public get dataScreenFileEditor() {
    return this.projectEditor.currentObjectEditor as DataScreenFileEditor
  }

  @Prop()
  public widgetConfig!: WidgetConfig

  @Prop({ default: 0 })
  public level!: number

  public expanded = false

  public get children() {
    return this.widgetConfig.children
  }

  public set children(children: WidgetConfig[]) {
    this.widgetConfig.children = children
  }

  public get hasChildren() {
    return this.children.length > 0
  }

  private get isSelected() {
    return this.dataScreenFileEditor.isSelectedWidgetConfigId(this.widgetConfig.id)
  }

  private get isSelectedAncestor() {
    return false
  }

  private get lock() {
    return this.widgetConfig.lock
  }

  private set lock(val) {
    this.widgetConfig.lock = val
  }

  private get visible() {
    return this.widgetConfig.visible
  }

  private set visible(val) {
    this.widgetConfig.visible = val
  }

  public handleClick(event: MouseEvent) {
    this.dataScreenFileEditor.selectWidgetConfig(this.widgetConfig.id, event.ctrlKey)
  }

  private handleChange ({ added }: { added: { element: WidgetConfig } }) {
    if (added) {
      const parentWidget = this.widgetConfig
      const widgetConfig = added.element as WidgetConfig
      const {x, y} = this.dataScreenFileEditor.getAbsolutePosition(widgetConfig.id)
      const {x: x0, y: y0} = this.dataScreenFileEditor.getAbsolutePosition(parentWidget.id)
      widgetConfig.x = x - x0
      widgetConfig.y = y - y0
      widgetConfig.parentId = parentWidget.id
    }
    if (
      this.widgetConfig.isGroup &&
      this.children.length === 0
    ) {
      this.dataScreenFileEditor.deleteWidgetConfigById(this.widgetConfig.id)
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.DataScreenHierarchyNode {
  .label {
    position: relative;
    height: 27px;
    line-height: 27px;
    cursor: pointer;
    white-space: nowrap;
    border-bottom: solid 1px rgba($border-color, 0.5);
    overflow: hidden;
  }

  .label:hover {
    background: rgba(0,0,0,0.25);
  }

  &.is-selected>.label {
    background: rgba($primary-color,0.25);
  }

  .label .button {
    display: inline-block;
    width: 26px;
    height: 26px;
    text-align: center;
    border-right: solid 1px rgba($border-color, 0.5);
  }

  .label .button.active {
    color: $primary-color;
    .button-icon {
      opacity: 1;
    }
  }

  .label .title {
    display: inline-block;
    width: calc(100% - 52px);
    height: 26px;
    line-height: 26px;
    vertical-align: top;
    font-size: 13px;
    color: $text-color;
  }

  .label .title .name {
    display: inline-block;
    width: calc(100% - 52px);
    vertical-align: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .button-icon {
    display: inline-block;
    width: 10px;
    height: 26px;
    opacity: 0.125;
  }

  .button-icon.lock {
    width: 8px;
  }

  .expand-button {
    display: inline-block;
    width: 26px;
    height: 26px;
    text-align: center;
    vertical-align: top;
  }

  .button-icon {
    width: 10px;
    height: 10px;
    vertical-align: baseline;
  }

  .select-handler {
    display: inline-block;
    width: 26px;
    height: 26px;
    text-align: center;
  }

  .select-handler-icon {
    display: inline-block;
    width: 8px;
    height: 26px;
    color: $text-color-gray;
    opacity: 0.25;
  }

  &.is-selected>.label .select-handler-icon {
    color: $primary-color;
    opacity: 1;
  }
  &.is-selected-ancestor>.label .select-handler-icon {
    width: 6px;
    color: $primary-color;
    opacity: 1;
  }
}
</style>
