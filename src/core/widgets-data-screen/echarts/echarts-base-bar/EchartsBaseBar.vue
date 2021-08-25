<template>
  <v-chart class="EchartsBaseBar" :option="option" autoresize/>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class EchartsBaseBar extends Vue {
  public get option() {
    return  {
      xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [120, 200, '-', 80, 70, 110, 130],
          type: 'bar'
      }]
    }
  }
}
</script>
<style scoped lang='scss'>
@import '~@/assets/style/variables.scss';
.EchartsBaseBar {
  width: 100%;
  height: 100%;
}
</style>
