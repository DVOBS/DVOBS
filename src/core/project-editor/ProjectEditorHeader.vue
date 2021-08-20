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
          <span
            @click="projectEditor.createNewProject"
          >新建</span>
          <span
            @click="projectEditor.uploadProjectFile"
          >导入</span>
          <span
            @click="projectEditor.donwloadProjectFile"
          >导出</span>
          <span class="disable">设置</span>
        </div>
      </span>
      <span class="menu-item disable">
        <span>查看(V)</span>
      </span>
      <span class="menu-item disable">
        <span>运行(R)</span>
      </span>
      <span class="menu-item disable">
        <span>设置(R)</span>
      </span>
      <span class="menu-item disable">
       <span> 帮助(H)</span>
      </span>
    </span>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'

@Component
export default class ProjectEditorHeader extends Vue {
  @Inject('projectEditor')
  public projectEditor!: ProjectEditor
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
    .menu-item.disable {
      // pointer-events: none;
      opacity: 0.5;
      cursor: not-allowed;
    }
    .menu-item:hover {
      background: lighten($panel-background-color, 5%);
      box-shadow: 0px 1px 2px #000;
    }
    .menu-item.disable:hover {
      background: transparent;
      box-shadow: none;
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
    .menu-item.disable:hover .sub-menu {
      display: none;
    }
    .sub-menu span {
      display: block;
      padding: 0 15px;
    }
    .sub-menu span:hover {
      background: rgba(0, 0, 0, 0.25);
    }
    .sub-menu span.disable {
      cursor: not-allowed;
    }
    .sub-menu span.disable:hover {
      background: none;
    }
  }
}
</style>
