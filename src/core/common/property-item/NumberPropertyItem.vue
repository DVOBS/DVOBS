<template>
  <div class="NumberPropertyItem">
    <span class="label">{{ label }}</span>
    <span class="input-group">
      <el-input-number
        class="el-input-number"
        v-model="object[prop]"
        size="mini"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        controls-position="right"
        @keydown.native.stop
      ></el-input-number>
    </span>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class NumberPropertyItem extends Vue {
  @Prop({ type: String })
  public label!: string;

  @Prop({ type: Object, required: true })
  public object!: any;

  @Prop({ type: [String, Number] })
  public prop!: string | number;

  @Prop({ type: Number, default: -Infinity })
  public min!: number;

  @Prop({ type: Number, default: Infinity })
  public max!: number;

  @Prop({ type: Number, default: 1 })
  public step!: number;

  @Prop({ type: Boolean, default: false })
  public disabled!: boolean;
}
</script>

<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.NumberPropertyItem {
  .el-input-number {
    width: 100%;
  }
}
</style>
