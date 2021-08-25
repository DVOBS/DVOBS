<template>
  <div class="SimpleText" :style="style">{{text}}</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class SimpleText extends Vue {
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
      fontFamily: this.fontFamily,
    };
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.SimpleText {
  height: auto;
  width: auto;
  white-space: nowrap;
}
</style>
