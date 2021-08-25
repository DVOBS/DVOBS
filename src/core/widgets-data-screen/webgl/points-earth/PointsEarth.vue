<template>
  <MainScene class="PointsEarth">
    <PointsGlobal
      pointsFile="/static/points.json"
      outlineFile="/static/map_outline.png"
      :radius="200"
      :pointSize="0.5"
      :pointRatio="0.2"
      :color1="color1"
      :color2="color2"
      :color3="color3"
      :glowColor="glowColor"
      :outlineColor="outlineColor"
    ></PointsGlobal>
  </MainScene>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import MainScene from './MainScene'
import PointsGlobal from './PointsGlobal'

@Component({
  components: { MainScene, PointsGlobal }
})
export default class PointsEarth extends Vue {
  @Prop({ default: '#ee8844' })
  private color1!: string

  @Prop({ default: '#2266ee' })
  private color2!: string

  @Prop({ default: '#2288ff' })
  private color3!: string

  @Prop({ default: '#4488ff' })
  private glowColor!: string

  @Prop({ default: '#ff8800' })
  private outlineColor!: string
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.PointsEarth {
  height: 100%;
}
</style>
