<template>
  <div class="SimpleDataView" :style="style">data:{{dataJson}}</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class SimpleDataView extends Vue {
  @Prop()
  public text!: string

  @Prop()
  public color!: string

  @Prop()
  public fontSize!: number

  @Prop()
  public letterSpacing!: number

  @Prop()
  public fontFamily!: string

  @Prop()
  public dataSource!: any

  private get dataJson() {
    return JSON.stringify(this.dataSource)
  }

  get style() {
    return {
      color: this.color,
      fontSize: this.fontSize + 'px',
      letterSpacing: this.letterSpacing + 'px',
      fontFamily: this.fontFamily,
    };
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.SimpleDataView {
  height: auto;
  width: 600px;
}
</style>
