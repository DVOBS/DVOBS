<template>
  <div class="object-editor-tabs">
    <div
      v-show="tabInfos.length"
      class="tabs"
      ref="tabs"
      @wheel.passive="handleWhell"
    >
      <vue-drag v-model="tabInfos">
        <ObjectEditorTab
          class="tab"
          v-for="(tabInfo, index) in tabInfos"
          :key="index"
          :ref="getTabInfoKey(tabInfo)"
          :tabInfo="tabInfo"
          :active="currentTabInfo && tabInfoEqual(tabInfo, currentTabInfo)"
          @close="handleClose(tabInfo)"
          @click.native="handleClick(tabInfo)"
          @dblclick.native="handleDbClick(tabInfo)"
        ></ObjectEditorTab>
      </vue-drag>
    </div>
    <div
      v-for="tabInfo in tabInfos"
      v-show="tabInfo === currentTabInfo"
      :key="getTabInfoKey(tabInfo)"
      class="editor-container"
    >
      <component
        :is="getEditor(tabInfo.object)"
        :ref="'editor-' + getTabInfoKey(tabInfo)"
        :object="tabInfo.object"
        :active="tabInfo === currentTabInfo"
      ></component>
    </div>
    <div
      v-show="tabInfos.length === 0"
      class="tips"
    >
      <div class="tips-box">
        <br>
        <dl>
          <dt>显示所有命令</dt>
          <dd>
              <span class="key">Ctrl</span>
              <span class="key-separator">+</span>
              <span class="key">Shift</span>
              <span class="key-separator">+</span>
              <span class="key">P</span>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator"
import { getEditorInfo } from "@/core/objects-editor/objectEditorUtil";
import ObjectEditorTab from './ObjectEditorTab.vue'
import TabInfo from "./TabInfo"
import EditableObject from "@/core/model/EditableObject";

/** 对象编辑器标签页 */
@Component({
  components: {
    ObjectEditorTab,
  },
})
export default class ObjectEditorTabs extends Vue {
  @Ref()
  public tabs!: HTMLDivElement

  public tabInfos: TabInfo[] = [];

  public currentTabInfo: TabInfo | null = null;

  public openObjectEditor(
    object: EditableObject,
    isPreview = false
  ) {

    const newTabInfo = {
      object,
      isPreview,
    };

    const repetition = this.tabInfos.find((tabInfo) => {
      return this.tabInfoEqual(tabInfo, newTabInfo);
    });

    if (isPreview) {
      if (!repetition) {
        const previewTabIndex = this.tabInfos.findIndex(function (tabInfo) {
          return tabInfo.isPreview;
        });
        if (previewTabIndex > -1) {
          this.tabInfos.splice(previewTabIndex, 1);
        }
        this.tabInfos.push(newTabInfo);
      }

      this.currentTabInfo = repetition || newTabInfo;
    } else {
      const repetition = this.tabInfos.find((tabInfo) => {
        return this.tabInfoEqual(tabInfo, newTabInfo);
      })

      if (repetition) {
        repetition.isPreview = false;
      } else {
        this.tabInfos.push(newTabInfo);
      }

      this.currentTabInfo = repetition || newTabInfo;
    }

    this.scrollTo(newTabInfo)
  }

  public closeTabInfo(tabInfo: TabInfo) {
    const findIndex = this.tabInfos.findIndex((d) => {
      return this.tabInfoEqual(d, tabInfo)
    })

    if (findIndex > -1) {
      this.tabInfos.splice(findIndex, 1)
    }

    if (this.currentTabInfo && this.tabInfoEqual(this.currentTabInfo, tabInfo)) {
      this.currentTabInfo = this.tabInfos[findIndex - 1] || this.tabInfos[findIndex] || this.tabInfos[0] || null
    }
  }

  public scrollTo (tabInfo: TabInfo) {
    // const tabs = this.tabs
    const refId = this.getTabInfoKey(tabInfo)
    const tabArray = this.$refs[refId] as ObjectEditorTab[] | null
    const tabs = this.tabs

    if (tabArray?.length) {
      const tab = tabArray[0]?.$el
      const tabBCR = tab.getBoundingClientRect()
      const tabsBCR = tabs.getBoundingClientRect()
      const scrollLeft = tabs.scrollLeft
      tabs.scrollTo({
        left: scrollLeft + tabBCR.x - tabsBCR.x
      })
    }
    // tabs.scrollTo({})
  }

  public get currentObjectEditor() {
    if (this.currentTabInfo) {
      return this.getEditor(this.currentTabInfo?.object)
    }
    return null
  }

  /* 监听器 */
  @Watch('currentTabInfo')
  public async handleCurrentTabInfoChange(tabInfo: TabInfo | null) {
    await this.$nextTick()
    if (tabInfo) {
      this.$emit('changeObject', tabInfo.object)
      const refs = this.$refs['editor-' + this.getTabInfoKey(tabInfo)]
      if (Array.isArray(refs)) {
        this.$emit('changeEditor', refs[0])
      }
    } else {
      this.$emit('changeObject', null)
      this.$emit('changeEditor', null)
    }
  }

  /* 事件处理 */
  public handleClose(tabInfo: TabInfo) {
    this.closeTabInfo(tabInfo)
  }

  public handleClick(tabInfo: TabInfo) {
    this.openObjectEditor(tabInfo.object, true)
  }

  public handleDbClick(tabInfo: TabInfo) {
    this.openObjectEditor(tabInfo.object)
  }

  public handleWhell (event: WheelEvent) {
    const dy = event.deltaY / 5
    const tabs = this.tabs
    const scrollLeft = tabs.scrollLeft
    tabs.scrollTo({
      left: scrollLeft + dy
    })
  }

  /* 获取 TAB 的 KEY */
  public getTabInfoKey(tabInfo: TabInfo) {
    return tabInfo.object.id
  }

  /* 判断 TabInfo 是否相同 */
  public tabInfoEqual(a: TabInfo, b: TabInfo) {
    return a.object === b.object
    // return a.object === b.object;.id
  }

  public getEditor(obj: EditableObject) {
    return getEditorInfo(obj).editor
  }
}
</script>
<style scoped lang="scss">
@import "~@/assets/style/variables.scss";
.object-editor-tabs {
  background: transparent;
  height: 100%;
  .tabs {
    width: 100%;
    height: $panel-header-height;
    white-space: nowrap;
    overflow-y: hidden;
    overflow-x: auto;
    border-left: solid 1px $border-color;
    border-right: solid 1px $border-color;
  }
  .editor-container {
    height: calc(100% - #{$panel-header-height});
    background: $panel-background-color;
    border-left: solid 1px $border-color;
    border-right: solid 1px $border-color;
    border-bottom: solid 1px $border-color;
    box-shadow: 0px -1px 0px 0px $border-color;
  }
  .tips {
    text-align: center;
  }
  .tips-box {
    display: inline-block;
  }
  .tips dl {
    display: table-row;
  }
  .tips dt,
  .tips dd {
    display: table-cell;
  }
  .tips dt {
    padding-right: 15px;
  }
  .tips .key {
    background-color: rgba(128, 128, 128, 0.17);
    padding: 3px 5px;
    color: #ccc;
    border-radius: 3px;
  }
  .tips .key-separator {
    margin: 0 3px;
  }
}
</style>
