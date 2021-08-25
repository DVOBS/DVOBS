<template>
  <div class="SimpleTextArea" :style="style">{{text}}</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class SimpleTextArea extends Vue {
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

  get style() {
    return {
      color: this.color,
      fontSize: this.fontSize + 'px',
      letterSpacing: this.letterSpacing + 'px',
      lineHeight: this.fontSize + 'px',
      fontFamily: this.fontFamily,
      display: 'inline-block',
    };
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.SimpleTextArea {
  height: 100%;
  overflow: hidden;
}
</style>
