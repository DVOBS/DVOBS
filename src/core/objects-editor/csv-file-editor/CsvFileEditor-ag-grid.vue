<template>
  <ag-grid-vue class="CsvFileEditor ag-theme-balham-dark"
      :columnDefs="columnDefs"
      :rowData="rowData">
  </ag-grid-vue>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class CsvFileEditor extends Vue {
  public rowData = [{0: 'abc'}]
  public get columnDefs() {
    return [
      'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
    ].map((d,i) => ({
      headerName: d,
      field: i+'',
      resizable: true,
      width: 90
    }))
  }
  public async created() {
    const rowData = []
    for (let index = 0; index < 100; index++) {
      const obj = {} as any
      ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'].forEach((d,i) => {
        obj[i] = ''
      })
      rowData.push(obj)
    }
    this.rowData = rowData
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.CsvFileEditor {
  width: 100%;
  height: 100%;
}
</style>
