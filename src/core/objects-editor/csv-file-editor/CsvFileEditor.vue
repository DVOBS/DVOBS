<template>
  <div class="CsvFileEditor">
    <div :id="id"  class="csv"></div>
  </div>
</template>
<script lang="ts">
import shortid from 'shortid'
import { Component, Vue } from 'vue-property-decorator'
const DataGridXL = (window as any).DataGridXL

@Component
export default class CsvFileEditor extends Vue {
  public id= shortid()
  public mounted() {
    const dataGridXL = new DataGridXL(this.id, {
      colHeaderHeight: 24,
      rowHeight: 24,
      theme: {
        textColor: "#bfbfbf",
        colHeaderTextColor: "#ffffff",
        rowHeaderTextColor: "#ffffff",
        sheetColor: '#323232',
        documentColor: '#323232',
        colHeaderBackgroundColor: '#323232',
        colHeaderHighlightBackgroundColor: "#212121",
        colHeaderSelectedBackgroundColor: "#212121",
        rowHeaderBackgroundColor: '#323232',
        rowHeaderHighlightBackgroundColor: "#212121",
        rowHeaderSelectedBackgroundColor: "#212121",
        scrollbarBackgroundColor: 'rgba(0,0,0,0)',
        contextMenuTextColor: "#fff",
        contextMenuBackgroundColor: "#212121",
        contextMenuItemBackgroundColor: "transparent",
        contextMenuItemHighlightBackgroundColor: "rgb(10, 46, 85)",
        contextMenuItemDisabledTextColor: "black"
        
      }
    })
    console.log(dataGridXL)
    dataGridXL.setData(DataGridXL.createDummyData(100,26))
    dataGridXL.events.on('documentchange', ()=> {
      console.log(123)
      console.log(dataGridXL.getData())
    })
    dataGridXL.events.on('cellvaluechange', ()=> {
      console.log(123)
      console.log(dataGridXL.getData())
    })
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.CsvFileEditor {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .csv {
    width: 100%;
    height: calc(100% + 24px);
  }
}
</style>
