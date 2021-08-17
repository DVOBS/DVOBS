<template>
  <div class="SelectPropertyItem">
    <span class="label">{{ label }}</span>
    <span class="input-group">
      <el-select
        size="mini"
        v-model="object[prop]"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </span>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class SelectPropertyItem extends Vue {
  @Prop({ type: String })
  public label!: string;

  @Prop({ type: Object, required: true })
  public object!: any;

  @Prop({ type: [String, Number], required: false })
  public prop!: string | number;

  @Prop({ type: String, required: true })
  public type!: string;

  @Prop({ type: Array, default () { return [] } })
  private options!: any[];
}
</script>
