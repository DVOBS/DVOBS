<template>
  <div class="ProjectEditorHeader">
    <span class="brand">
      <font-awesome-icon
        class="brand-icon"
        :icon="['fas', 'meh-blank']"
      />
    </span>
    <span class="menubar">
      <span class="menu-item">
        <span>项目(P)</span>
        <div class="sub-menu">
          <span>新建</span>
          <span>导入</span>
          <span>导出</span>
          <span>设置</span>
        </div>
      </span>
      <span class="menu-item">
        <span>查看(V)</span>
      </span>
      <span class="menu-item">
        <span>运行(R)</span>
      </span>
      <span class="menu-item">
        <span>设置(R)</span>
      </span>
      <span class="menu-item">
       <span> 帮助(H)</span>
      </span>
    </span>
    <input type="file" ref="fileInput" accept="application/x-zip-compressed" v-show="false">
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ProjectEditorHeader extends Vue {
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.ProjectEditorHeader {
  background: $panel-background-color;
  height: $header-height;
  border-bottom: solid 1px #181818;
  line-height: $header-height;
  padding: 0 10px;
  .brand {
    display: inline-block;
    margin-top: 3px;
    margin-right: 10px;
    height: 25px;
    width: 25px;
    border-radius: 3px;
    line-height: 25px;
    text-align: center;
    font-size: 18px;
    color: #2c9aeb;
    background: #001e36;
  }
  .menubar {
    display: inline-block;
    vertical-align: top;
    .menu-item {
      position: relative;
      display: inline-block;
      height: 100%;
      padding: 0 15px;
      cursor: pointer;
    }
    .menu-item:hover {
      background: lighten($panel-background-color, 5%);
      box-shadow: 0px 1px 2px #000;
    }
    .sub-menu {
      display: none;
      position: absolute;
      left: 0;
      width: 225px;
      background: lighten($panel-background-color, 5%);
      z-index: 100;
    }
    .menu-item:hover .sub-menu {
      display: block;
      box-shadow: 0px 1px 2px #000;
    }
    .sub-menu span {
      display: block;
      padding: 0 15px;
    }
    .sub-menu span:hover {
      background: rgba(0, 0, 0, 0.25);
    }
  }
}
</style>
