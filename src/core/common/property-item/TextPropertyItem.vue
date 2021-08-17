<template>
  <div class="TextPropertyItem">
    <span class="label">{{ label }}</span>
    <span class="input-group">{{object[prop] || ''}}</span>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class TextPropertyItem extends Vue {
  @Prop({ type: String })
  public label!: string;

  @Prop({ type: Object, required: true })
  public object!: any;

  @Prop({ type: [String, Number], required: false })
  public prop!: string | number;

  @Prop({ type: String, required: true })
  public type!: string;
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.TextPropertyItem {
  .input-group {
    line-height: 24px;
    padding-left: 5px;
  }
}
</style>