<template>
  <div class="ViewPanel">
    <!-- <portal class="portal" :to="name"><slot></slot></portal> -->
    <CrossRender class="portal" :name="name"><slot></slot></CrossRender>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator'
import CrossRender from '@/core/common/cross-render/CrossRender.vue'
import ViewLayout from './ViewLayout.vue'

@Component({
  components: { CrossRender }
})
export default class ViewPanel extends Vue {
  @Inject('layout')
  public layout!: ViewLayout

  @Prop({ type: String, required: true })
  public label!: string

  @Prop({ type: String, required: true })
  public name!: string

  public mounted() {
    this.$set(this.layout.viewinfoMap, this.name, {
      name: this.name,
      label: this.label
    })
  }

  public beforeDestroy() {
    this.$delete(this.layout.viewinfoMap, this.name)
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.ViewPanel {
  .portal {
    width: 100%;
    height: 1005;
  }
}
</style>
