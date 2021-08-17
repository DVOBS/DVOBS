<template>
  <div class="ColorPropertyItem">
    <span class="label">{{ label }}</span>
    <span class="input-group">
      <el-input @keydown.native.stop
        size="mini"
        v-model="object[prop]"
        @blur="handleBlur"
      ></el-input>
      <el-color-picker
        class="picker"
        size="mini"
        v-model="object[prop]"
      ></el-color-picker>
    </span>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import isColor from 'is-color'

@Component
export default class ColorPropertyItem extends Vue {
  @Prop({ type: String })
  public label!: string;

  @Prop({ type: Object, required: true })
  public object!: any;

  @Prop({ type: [String, Number], required: false })
  public prop!: string | number;

  @Prop({ type: String, required: true })
  public type!: string;

  private handleBlur () {
    const prop = this.prop
    const object = this.object
    if (!isColor(object && object[prop])) {
      object[prop] = 'rgba(0,0,0,0)'
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.ColorPropertyItem {

  .input-group {
    position: relative;
    padding-right: 28px;
  }

  .picker {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>