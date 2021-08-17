<template>
  <div class="FileEditor">
    <div class="body">
      <CodeEditor
        class="code-editor"
        ref="codeEditor"
        v-model="content"
      ></CodeEditor>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { encode, decode } from 'js-base64'
import ProjectFile from '@/core/model/ProjectFile'
import CodeEditor from '@/core/objects-editor/code-editor/CodeEditor.vue'

@Component({
  components: { CodeEditor }
})
export default class FileEditor extends Vue {
  @Prop({ type: Object, required: true })
  public object!: ProjectFile

  public get content() {
    return decode(this.object.base64)
  }

  public set content(content: string) {
    this.object.base64 = encode(content)
  }

  public get tabInfoKey() {
    const id = this.object.id
    return `file-editor:${id}`
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.FileEditor {
  font-size: 12px;
  height: 100%;
  padding: 3px;
  background: $panel-background-color;
  .body {
    height: 100%;
    background: $panel-background-dark-color;
  }
  .code-editor {
    height: 100%;
  }
  ::v-deep .CodeMirror,
  ::v-deep .CodeMirror-gutters {
    background: $panel-background-dark-color;
  }
}
</style>
