<template>
  <div class="StringPropertyItem">
    <span class="label">{{ label }}</span>
    <span class="input-group">
      <el-input @keydown.native.stop
        size="mini"
        :type="type"
        v-model="object[prop]"
        spellcheck="false"
      ></el-input>
    </span>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class StringPropertyItem extends Vue {
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
