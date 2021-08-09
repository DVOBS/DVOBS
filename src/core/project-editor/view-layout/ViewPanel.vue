<template>
  <div class="ViewPanel">
    <portal class="portal" :to="name"><slot></slot></portal>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator'
import ViewLayout from './ViewLayout.vue'

@Component
export default class ViewPanel extends Vue {
  @Inject('layout')
  public layout!: ViewLayout

  @Prop({ type: String, required: true })
  private label!: string

  @Prop({ type: String, required: true })
  private name!: string

  @Prop({ type: String, required: true })
  private  position!: 'left' | 'right' | 'bottom'

  private created() {
    if (this.position === 'left') {
      this.layout.leftViews.push({
        name: this.name,
        label: this.label
      })
    }
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
