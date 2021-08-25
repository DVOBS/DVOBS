<template>
  <div class="KonvaFileEditroPropertyInspector">
    <PropertyItem
      label="宽度"
      prop="width"
      type="number"
      :object="stageObj.attrs"
      :min="0"
      :step="1"
    />
    <PropertyItem
      label="高度"
      prop="height"
      type="number"
      :object="stageObj.attrs"
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
export default class KonvaFileEditroPropertyInspector extends Vue {
  @Inject('projectEditor')
  public projectEditor!: ProjectEditor

  public get konvaFileEditro() {
    return this.projectEditor.currentObjectEditor as KonvaFileEditro
  }

  public get stageObj() {
    return this.konvaFileEditro.stageObj
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.KonvaFileEditroPropertyInspector {
  height: calc(100% - 10px);
  margin-top: 5px;
  padding: 0px 10px 0;
  overflow-y: auto;
}
</style>
