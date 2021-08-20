<template>
  <MainScene class="V3cTest">
    <PointsGlobal
      pointsFile="/static/points.json"
      outlineFile="/static/map_outline.png"
      :radius="200"
      :pointSize="0.5"
      :pointRatio="0.2"
      color1="#ee8844"
      color2="#2266ee"
      color3="#2288ff"
      glowColor="#4488ff"
      outlineColor="#ff8800"
    ></PointsGlobal>
  </MainScene>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MainScene from './MainScene'
import PointsGlobal from './PointsGlobal'

@Component({
  components: { MainScene, PointsGlobal }
})
export default class V3cTest extends Vue {
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.V3cTest {
  background: rgba(0,0,0,1);
}
</style>
