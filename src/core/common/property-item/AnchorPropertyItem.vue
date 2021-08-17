<template>
  <div class="AnchorPropertyItem">
    <span class="label">{{ label }}</span>
    <span class="input-group">
      <div class="anchor-border">
        <div
          class="anchor-button left-top"
          :class="{ active: object[prop] === 'left-top'}"
          @click="object[prop] = 'left-top'"
        ></div>
        <div
          class="anchor-button center-top"
          :class="{ active: object[prop] === 'center-top'}"
          @click="object[prop] = 'center-top'"
        ></div>
        <div
          class="anchor-button right-top"
          :class="{ active: object[prop] === 'right-top'}"
          @click="object[prop] = 'right-top'"
        ></div>
        <div
          class="anchor-button left-center"
          :class="{ active: object[prop] === 'left-center'}"
          @click="object[prop] = 'left-center'"
        ></div>
        <div
          class="anchor-button center"
          :class="{ active: object[prop] === 'center'}"
          @click="object[prop] = 'center'"
        ></div>
        <div
          class="anchor-button right-center"
          :class="{ active: object[prop] === 'right-center'}"
          @click="object[prop] = 'right-center'"
        ></div>
        <div
          class="anchor-button left-bottom"
          :class="{ active: object[prop] === 'left-bottom'}"
          @click="object[prop] = 'left-bottom'"
        ></div>
        <div
          class="anchor-button center-bottom"
          :class="{ active: object[prop] === 'center-bottom'}"
          @click="object[prop] = 'center-bottom'"
        ></div>
        <div
          class="anchor-button right-bottom"
          :class="{ active: object[prop] === 'right-bottom'}"
          @click="object[prop] = 'right-bottom'"
        ></div>
      </div>
    </span>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class AnchorPropertyItem extends Vue {
  @Prop({ type: String })
  public label!: string;

  @Prop({ type: Object, required: true })
  public object!: any;

  @Prop({ type: [String, Number] })
  public prop!: string | number;
}
</script>

<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.AnchorPropertyItem {
  height: 64px !important;
  .el-input-number {
    width: 100%;
  }
  .input-group {
    padding: 10px 5px;
  }
  .anchor-border {
    position: relative;
    width: 50px;
    height: 50px;
    border: 1px solid $text-color-gray;
  }
  .anchor-button {
    position: absolute;
    width: 10px;
    height: 10px;
    line-height: 17px;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
    border: 1px solid $text-color-gray;
    background: $panel-background-color;
  }
  .anchor-button.active {
    color: $text-color;
    background: $primary-color-orange;
  }

  .anchor-button.left-top {
    top: -5px;
    left: -5px;
  }

  .anchor-button.right-top {
    top: -5px;
    right: -5px;
  }

  .anchor-button.center-top {
    top: -5px;
    right: 50%;
    margin-right: -5px;
  }

  .anchor-button.left-center {
    top: 50%;
    left: -5px;
    margin-top: -5px;
  }

  .anchor-button.center {
    top: 50%;
    left: 50%;
    margin-left: -5px;
    margin-top: -5px;
  }

  .anchor-button.right-center {
    top: 50%;
    right: -5px;
    margin-top: -5px;
  }

  .anchor-button.left-bottom {
    bottom: -5px;
    left: -5px;
  }

  .anchor-button.center-bottom {
    bottom: -5px;
    left: 50%;
    margin-left: -5px;
  }

  .anchor-button.right-bottom {
    bottom: -5px;
    right: -5px;
  }
}
</style>
