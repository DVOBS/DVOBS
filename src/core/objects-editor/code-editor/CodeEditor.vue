<template>
  <div class="CodeEditor">
    <textarea ref="textarea"></textarea>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { addListener, removeListener } from 'resize-detector'
import codemirror from 'codemirror'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-darker.css'
import 'codemirror/mode/vue/vue.js'
import 'codemirror/mode/javascript/javascript'

@Component
export default class CodeEditor extends Vue {
  @Prop()
  public value!: string

  @Prop({ default: 'javascript' })
  public mode!: string

  public cminstance!: codemirror.EditorFromTextArea;

  @Watch('value')
  public handelValue() {
    const value = this.cminstance.getValue()
    if (this.value !== value) {
      const cursorPos = this.cminstance.getCursor()
      this.cminstance.setValue(this.value)
      this.cminstance.setCursor(cursorPos)
    }
  }

  public initialize() {
    this.cminstance  = codemirror.fromTextArea(this.$refs.textarea as HTMLTextAreaElement, {
      value: this.value,
      theme: 'material-darker',
      lineNumbers: true,
      mode: this.mode
    })
    this.cminstance.setValue(this.value)
    this.cminstance.on('change', () => {
      const value = this.cminstance.getValue()
      this.$emit('input', value)
    })
  }

  public setSize() {
    const $el = this.$el as HTMLDivElement
    const w = $el.clientWidth
    const h = $el.clientHeight
    this.cminstance.setSize(w, h)
  }

  public mounted() {
    this.initialize()
    addListener(this.$el as HTMLElement, this.setSize)
    this.setSize()
  }

  public beforeDestroy () {
    removeListener(this.$el as HTMLElement, this.setSize)
  }

  public focusCode (code: string) {
    const searchCursor = this.cminstance.getSearchCursor(code)
    if (searchCursor.findNext()) {
      // this.cminstance.markText(searchCursor.from(), searchCursor.to(), { css: 'color : red' })
      this.cminstance.setSelection(searchCursor.from(), searchCursor.to(), { scroll: true })
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.CodeEditor {
  height: 100%;
  overflow: hidden;
  ::v-deep {
    div.CodeMirror-selected { background: rgba(255,255,255,0.3) !important;}
  }
}
</style>
