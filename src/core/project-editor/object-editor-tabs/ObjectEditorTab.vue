<template>
  <div
    class="ObjectEditorTab"
    :class="{ active, isPreview }"
  >
    <font-awesome-icon
      class="type-icon"
      :icon="icon"
      :style="{
        color: iconColor
      }"
    />
    <span class="name">{{ objectName }}</span>
    <font-awesome-icon
      class="close-icon"
      title="关闭（ALT + f4）"
      :icon="['fas', 'times']"
      @click.stop="handleCloseBtnClick"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import TabInfo from "./TabInfo";
import { getEditorInfo } from "@/core/objects-editor/objectEditorUtil";

@Component({
  components: { FontAwesomeIcon }
})
export default class ObjectEditorTab extends Vue {
  @Prop()
  public tabInfo!: TabInfo;

  @Prop()
  public active!: boolean;

  public get object() {
    return this.tabInfo.object;
  }

  public get editorInfo() {
    return getEditorInfo(this.object)
  }

  public get icon() {
    return this.editorInfo.icon
  }

  public get iconColor() {
    return this.editorInfo.color
  }


  public get isPreview() {
    return this.tabInfo.isPreview;
  }

  public get objectName() {
    return this.object.name;
  }

  public handleCloseBtnClick () {
    this.$emit('close')
  }
}
</script>
<style scoped lang="scss">
@import "~@/assets/style/variables.scss";

.ObjectEditorTab {
  display: inline-block;
  position: relative;
  min-width: 80px;
  height: $panel-header-height;
  line-height: $panel-header-height;
  padding: 0 20px 0 5px;
  background: transparent;
  // border-top: solid 1px transparent;
  border-right: solid 1px $border-color;
  font-size: 12px;
  color: $text-color;
  cursor: pointer;

  .type-icon {
    position: relative;
    width: 10px;
    height: 10px;
    margin-right: 5px;
    vertical-align: baseline;
  }

  &.isPreview .name {
    font-style: italic;
  }

  &.active {
    // border-top: solid 1px $border-color;
    background: $panel-background-color;
    border-right: solid 1px $border-color;
    box-shadow: 0 0px 1px 0px $border-color;
  }

  .close-icon {
    position: absolute;
    top: 50%;
    right: 5px;
    margin-top: -6px;
    height: 12px;
  }
}
</style>
