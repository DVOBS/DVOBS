<template>
  <div class="KonvaFileWidgetLibrary">
    {{brushState}}
    <PropertyItem
      label="线宽"
      prop="lineWidth"
      type="number"
      :object="brushState"
      :min="0"
      :max="120"
      :step="1"
    />
    <PropertyItem
      label="颜色"
      prop="color"
      type="color"
      :object="brushState"
      :min="0"
      :step="1"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'
import PropertyItem from '@/core/common/property-item/PropertyItem.vue'
import KonvaFileEditro from './KonvaFileEditro.vue'

@Component({
  components: {
    PropertyItem
  }
})
export default class KonvaFileWidgetLibrary extends Vue {
  @Inject('projectEditor')
  public projectEditor!: ProjectEditor

  public get konvaFileEditro() {
    return this.projectEditor.currentObjectEditor as KonvaFileEditro
  }

  public get currentBrush() {
    return this.konvaFileEditro.currentBrush
  }

  public get brushState() {
    return this.currentBrush.state
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.KonvaFileWidgetLibrary {
  height: calc(100% - 10px);
  margin-top: 5px;
  padding: 0px 10px 0;
  overflow-y: auto;
}
</style>
