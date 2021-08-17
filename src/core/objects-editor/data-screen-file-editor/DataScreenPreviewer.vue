<template>
  <div class="DataScreenPreviewer" :style="style">
    <WidgetWrapper
      v-for="widgetConfig in widgetConfigs"
      :key="widgetConfig.id"
      :widgetConfig="widgetConfig"
    ></WidgetWrapper>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'
import { DataScreenConfig } from './DataScreenModels'
import WidgetWrapper from './WidgetWrapper.vue'

@Component({
  components: { WidgetWrapper }
})
export default class DataScreenPreviewer extends Vue {
  @Inject('projectEditor')
  public projectEditor!: ProjectEditor

  @Prop()
  public dataScreenConfig!: DataScreenConfig

  public get style() {
    const imageFile = this.projectEditor.allProjectFile.get(this.dataScreenConfig.bgImage)
    const style = {
      width: this.dataScreenConfig.width + 'px',
      height: this.dataScreenConfig.height + 'px',
      backgroundColor: this.dataScreenConfig.bgColor,
      backgroundSize: '100% 100%',
      backgroundImage: ''
    }
    if (imageFile) {
      const url = 'url(data:image/png;base64,' + imageFile.base64 + ')'
      style.backgroundImage = url
    }
    return style
  }

  public get widgetConfigs() {
    return this.dataScreenConfig.widgetConfigs
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.DataScreenPreviewer {
  position: relative;
  background: rgba(255,255,0,0.25);
}
</style>
