<template>
  <div class="OsmFileEditor">
    <div class="body">
      <CodeEditor
        v-show="false"
        class="code-editor"
        ref="codeEditor"
        v-model="content"
      ></CodeEditor>
      <coordinate-system class="preview">
        <svg :width="600" :height="600">
          <g
            v-for="(feature,i) in featuresPaths"
            :key="i"
            :class="{
              building: feature && feature.properties && (feature.properties.building || feature.properties['building:part']),
              water: feature && feature.properties && feature.properties.water,
              point: feature && feature.geometry.type === 'Point',
              lineString: feature && feature.geometry.type === 'LineString',
              highway: feature && feature.properties && feature.properties.highway,
              area: feature && feature.properties && feature.properties.area,
              barrier: feature && feature.properties && feature.properties.barrier,
              natural: feature && feature.properties && feature.properties.natural,
            }"
          >
            <path :index="i" :d="feature.d" @click="show(i)"></path>
          </g>
        </svg>
      </coordinate-system>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { encode, decode } from 'js-base64'
import { addListener, removeListener } from 'resize-detector'
import * as d3 from 'd3'
import OSMXML from 'ol/format/OSMXML'
import GeoJSON from 'ol/format/GeoJSON'

import ProjectFile from '@/core/model/ProjectFile'
import CodeEditor from '@/core/objects-editor/code-editor/CodeEditor.vue'

@Component({
  components: { CodeEditor }
})
export default class OsmFileEditor extends Vue {
  @Prop({ type: Object, required: true })
  public object!: ProjectFile

  public width = 0
  public height = 0

  public get content() {
    return decode(this.object.base64)
  }

  public set content(content: string) {
    this.object.base64 = encode(content)
  }

  public get featureCollection() {
    const features = new OSMXML().readFeatures(this.content)
    const noboundarys = features.filter(d => !d.getProperties().boundary)
    const json = new GeoJSON().writeFeatures(noboundarys)
    return JSON.parse(json)
  }

  public get features() {
    return this.featureCollection?.features || []
  }


  public get featuresPaths() {
    const projection = d3.geoEquirectangular().fitSize([600, 600], this.featureCollection)
    const geoPath = d3.geoPath(projection)
    return this.features.map((d: any) => {
      return {
        ...d,
        d: geoPath(d)
      }
    })
  }

  public show(index: number) {
    console.log(this.features[index])
  }

  public onResize (event: HTMLElement) {
    this.width = event.clientWidth
    this.height = event.clientHeight
  }

  public mounted () {
    this.onResize(this.$el as HTMLDivElement)
    addListener(this.$el as HTMLDivElement, this.onResize)
  }

  public beforeDestroy () {
    removeListener(this.$el as HTMLDivElement, this.onResize)
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.OsmFileEditor {
  font-size: 12px;
  height: 100%;
  padding: 3px;
  background: $panel-background-color;
  .body {
    height: 100%;
    background: $panel-background-dark-color;
  }
  .code-editor, .preview {
    height: 100%;
  }
  ::v-deep .CodeMirror,
  ::v-deep .CodeMirror-gutters {
    background: $panel-background-dark-color;
  }
  path {
    fill: rgba(0,0,0,0);
    stroke: rgba(255,0,0,0.5);
    stroke-width: 0.1;
  }
  .building path {
    stroke: gray;
    fill: gray;
  }
  .water path {
    stroke: rgba(0,255,255,0.5);
    fill: rgba(0,255,255,0.5);
  }
  .point path {
    display: none;
  }
  .highway path {
    stroke: orange;
    fill: none;
  }
  .area path {
    stroke: none;
    fill: rgba(0,178,178,0.125);
  }
  .barrier path {
    stroke: black;
  }
  .natural path {
    stroke: green;
    fill: green;
  }
  .lineString path {
    fill: none !important;
  }
}
</style>
