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
    >
      <TaperBar
        v-for="location in locations"
        :key="location[0]"
        :position="latLongToVector3(location[1], location[2], 0)"
        :color="color3"
        :value="location[3]"
      ></TaperBar>
      <ThreeArcsSnake
        v-for="path in paths"
        :key="path[0]"
        :lng="path[1]"
        :lat="path[2]"
        :toLng="path[3]"
        :toLat="path[4]"
        :color="path[5]"
        :show="true"
      />
    </PointsGlobal>
  </MainScene>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import MainScene from './MainScene'
import PointsGlobal from './PointsGlobal'
import TaperBar from './TaperBar'
import ThreeArcsSnake from './ThreeArcsSnake'
import { Color } from 'three'

@Component({
  components: { MainScene, PointsGlobal, TaperBar, ThreeArcsSnake }
})
export default class PointsEarth extends Vue {
  @Prop({ default: '#ee8844' })
  public color1!: string

  @Prop({ default: '#2266ee' })
  public color2!: string

  @Prop({ default: '#2288ff' })
  public color3!: string

  @Prop({ default: '#4488ff' })
  public glowColor!: string

  @Prop({ default: '#ff8800' })
  public outlineColor!: string

  public get locations() {
    const locations = []
    for (let index = 0; index < 250; index++) {
      locations.push(
        ['index-' + index,~~(Math.random() * 360 - 180),~~(Math.random() * 180 - 90),~~(Math.random() * 50 + 15)]
      )
    }
    return locations
  }

  public get paths() {
    const paths = []
    for (let index = 0; index < 1000; index++) {
      paths.push([
        index,
        ~~( Math.random() * 360 - 180),
        ~~( Math.random() * 180 - 90),
        ~~( Math.random() * 360 - 180),
        ~~( Math.random() * 180 - 90),
        '#' + new Color(Math.random(), Math.random(), Math.random()).getHexString()
      ])
    }
    return paths
  }

  public latLongToVector3(lng:number, lat:number, height:number) {
    const r = 200 + height;
    let x = 0;
    let y = 0;
    let z = 0;

    y = Math.sin(lat / 180 * Math.PI) * r;
    const r0 = Math.cos(lat / 180 * Math.PI) * r;

    x = Math.sin(lng / 180 * Math.PI) * r0;
    z = Math.cos(lng / 180 * Math.PI) * r0;

    return [x, y, z];
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.PointsEarth {
  height: 100%;
}
</style>
