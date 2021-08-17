<template>
  <component
    class="PropertyItem"
    v-bind:is="componentName"
    v-bind="{...$props,...$attrs}"
    @keydown.native.stop
  ></component>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import NumberPropertyItem from './NumberPropertyItem.vue'
import StringPropertyItem from './StringPropertyItem.vue'
import TextPropertyItem from './TextPropertyItem.vue'
import AnchorPropertyItem from './AnchorPropertyItem.vue'
import ColorPropertyItem from './ColorPropertyItem.vue'
import SelectPropertyItem from './SelectPropertyItem.vue'

@Component({
  components: {
    NumberPropertyItem,
    StringPropertyItem,
    TextPropertyItem,
    AnchorPropertyItem,
    ColorPropertyItem,
    SelectPropertyItem
  }
})
export default class PropertyItem extends Vue {
  @Prop({ type: String })
  public label!: string;

  @Prop({ type: Object, required: true })
  public object!: any;

  @Prop({ type: [String, Number], required: false })
  public prop!: string | number;

  @Prop({ type: String, required: true })
  public type!: string;

  @Prop({ type: Boolean, default: false })
  public disabled!: boolean;

  get componentName () {
    let componentName = this.type + 'PropertyItem'
    componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1)
    return componentName
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.PropertyItem {
  display: flex;
  margin-bottom: 5px;
  height: 24px;

  ::v-deep .label {
    display: block;
    flex-grow: 0;
    flex-shrink: 0;
    width: 30%;
    min-width: 50px;
    max-width: 100px;
    font-size: 12px;
    line-height: 24px;
    color: $text-color;
  }

  ::v-deep .input-group {
    display: block;
    flex-grow: 1;
    color: $text-color;
  }
}
</style>
