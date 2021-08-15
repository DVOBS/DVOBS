<template>
  <div class="ViewLayout" @drop="handleDrop">
    <HorizontalContainer
      class="root-ontainer"
      :node="rootNode"
    ></HorizontalContainer>
    <div style="display: none">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import ViewPanelTabs from './ViewPanelTabs.vue'
import HorizontalContainer from './HorizontalContainer.vue'
import { defaultLayout } from './layout'

interface viewinfo {
  name: string,
  label: string
}

@Component({
  components: {
    ViewPanelTabs,
    HorizontalContainer
  }
})
export default class ViewLayout extends Vue {
  @Provide('layout')
  public get layout (): ViewLayout { return this }

  public viewinfoMap: { [index:string]: viewinfo} = {}

  public dragTab = ''

  public dragTabs: ViewPanelTabs | null = null

  public isDraging = true

  public rootNode = defaultLayout

  public handleDrop() {
    setTimeout(() => {
      this.dragTab = ''
      this.dragTabs = null
    }, 0);
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.ViewLayout {
  display: flex;
  .root-ontainer {
    flex-grow: 1;
  }
}
</style>
