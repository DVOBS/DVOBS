<template>
  <div class="CsvFileEditor" :class="mode" @keydown="handleKeydown">
    <div class="tool-bar">
      <el-button v-if="mode === 'table'" size="mini">表格</el-button>
      <el-button v-else size="mini" type="text" @click="mode = 'table'">表格</el-button>
      <el-button v-if="mode === 'code'" size="mini">文本</el-button>
      <el-button v-else size="mini" type="text" @click="mode = 'code'">文本</el-button>
      <el-button v-if="mode === 'table-code'" size="mini">拆分</el-button>
      <el-button v-else size="mini" type="text" @click="mode = 'table-code'">拆分</el-button>
    </div>
    <div class="body">
      <HotTable
        v-show="mode === 'table-code' || mode === 'table'"
        class="csv"
        ref="hotTable"
        :settings="hotSettings"
        :afterChange="afterChange"
      ></HotTable>
      <CodeEditor
        v-show="mode === 'table-code' || mode === 'code'"
        class="code-editor"
        ref="codeEditor"
        v-model="content"
      ></CodeEditor>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import { encode, decode } from 'js-base64'
import shortid from 'shortid'
import {parse, unparse} from 'papaparse'
import { HotTable } from '@handsontable/vue'
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n/index'
import { addListener, removeListener } from 'resize-detector'

import ProjectFile from '@/core/model/ProjectFile'
import CodeEditor from '@/core/objects-editor/code-editor/CodeEditor.vue'

registerLanguageDictionary(zhCN);

@Component({
  components: {
    CodeEditor,
    HotTable
  }
})
export default class CsvFileEditor extends Vue {
  public id= shortid()
  public mode = 'table-code' // table code table-code

  @Prop({ type: Object, required: true })
  public object!: ProjectFile

  @Ref()
  public hotTable!: any

  public get content() {
    return decode(this.object.base64)
  }

  public set content(content: string) {
    this.object.base64 = encode(content)
  }

  public get scvData() {
    return parse(this.content, {header: false}).data as any[][]
  }

  public get scvHeaderData() {
    return parse(this.content, {header: true}).data
  }

  public get hotSettings() {
    return {
      data: this.scvData,
      colHeaders: true,
      rowHeaders: true,
      licenseKey: 'non-commercial-and-evaluation',
      colWidths: 100,
      manualColumnResize: true,
      contextMenu: true,
      language: 'zh-CN',
      // afterChange: this.afterChange,
      manualColumnMove: true,
      minCols: 26,
      minRows: 100
    }
  }

  public async afterChange() {
    const scvData = this.hotTable.hotInstance.getData()
    let maxX = 0
    let maxY = 0

    for (let y = 0; y < scvData.length; y++) {
      const row = scvData[y]
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell === '' || cell === null) {
          //
        } else {
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        }
      }
    }
    this.content = unparse(this.hotTable.hotInstance.getData(0,0,maxY,maxX), { skipEmptyLines: 'greedy' })
  }

  @Watch('scvData')
  public contentChange() {
    this.hotTable.hotInstance.loadData(this.scvData)
  }

  @Watch('mode')
  public async modeChange() {
    await this.$nextTick()
    this.hotTable.hotInstance.render()
  }

  private handleKeydown (event: KeyboardEvent) {
    (event as any).skip = true
  }

  public async onResize () {
    await this.$nextTick()
    this.hotTable.hotInstance.render()
  }

  public mounted () {
    this.onResize()
    addListener(this.$el as HTMLDivElement, this.onResize)
  }

  public beforeDestroy () {
    removeListener(this.$el as HTMLDivElement, this.onResize)
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.CsvFileEditor {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 5px;
  .tool-bar {
    text-align: left;
    height: 32px;
    line-height: 32px;
    background: $panel-background-color;
  }
  .body {
    height: calc(100% - 32px);
    .csv {
      height: 100%;
      width: 100%;
      overflow: auto;
    }
    .code-editor {
      width: 100%;
      height: 100%;
    }
  }
  &.table-code .body {
    .code-editor,
    .csv {
      height: 50%;
    }
  }
}
</style>
<style lang="scss">
@import '~@/assets/style/variables.scss';
.handsontable th,
.handsontable td {
  background: $panel-background-color;
  border-color: $border-color !important;
  
}
.colHeader {
  color: $text-color-gray;
}
.rowHeader {
  color: $text-color-gray;
}
.ht__highlight {
  background: $panel-background-dark-color !important;
}
.htContextMenu table tbody tr td {
  background: $panel-background-color;
  border-color: $border-color !important;
  color: $text-color;
  font-size: 12px;
  padding: 2px 6px 2px 6px;
}
.htContextMenu .ht_master table.htCore {
  border-color: $border-color !important;
}
.htContextMenu table tbody tr td.current,
.htContextMenu table tbody tr td.zeroclipboard-is-hover {
  background: $panel-background-dark-color !important;
}
.htContextMenu table tbody tr td.htDisabled {
  background: $panel-background-color !important;
}
.handsontableInput {
  background: $input-background-color !important;
  color: $text-color !important;
}
</style>
