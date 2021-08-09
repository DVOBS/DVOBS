<template>
  <div class="ViewLayout">
    <div class="left">
      <ViewPanelTabs :tabs="leftViews"></ViewPanelTabs>
    </div>
    <div class="main">
      <portal-target name="main"></portal-target>
    </div>
    <div class="right">
      <ViewPanelTabs :tabs="rightViews"></ViewPanelTabs>
    </div>
    <div style="display: none">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator'
import ViewPanelTabs from './ViewPanelTabs.vue'

interface viewinfo {
  name: string, label: string
}

@Component({
  components: {
    ViewPanelTabs: ViewPanelTabs
  }
})
export default class ViewLayout extends Vue {
  @Provide('layout')
  public get layout (): ViewLayout { return this }

  public leftViews: viewinfo[] = []
  public rightViews: viewinfo[] = []
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.ViewLayout {
  display: flex;
  .left,
  .right {
    width: 320px;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .main {
    flex-grow: 1;
    flex-shrink: 1;
  }
}
</style>
