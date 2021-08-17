<template>
  <div class="ImageEditor">
    <coordinate-system
      class="body"
      ref="coordinateSystem"
      :dragable="false"
      @mousedown.native="startDraw"
    >
      <!-- <img :src="base64Url"/> -->
      <canvas
        class="sketch"
        ref="sketch"
        :width="width"
        :height="height"
        @mousedown="startDraw"
      ></canvas>
      <div class=" drawing-board" ref="container" @mousedown.stop>
        <div ref="container"></div>
      </div>
    </coordinate-system>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Ref } from 'vue-property-decorator'
import { addListener, removeListener } from 'resize-detector'
import localforage from 'localforage'
import ProjectFile from '@/core/model/ProjectFile'
import CoordinateSystem from '@/core/common/coordinate-system/CoordinateSystem.vue'
import Konva from 'konva'

@Component({
  components: { }
})
export default class ImageEditor extends Vue {

  @Prop({ type: Object, required: true })
  public object!: ProjectFile

  @Ref()
  public container!: HTMLDivElement

  @Ref()
  public sketch!: HTMLCanvasElement

  @Ref()
  public coordinateSystem!: CoordinateSystem

  public width = 0
  public height = 0

  public stage!: Konva.Stage

  public get base64() {
    return this.object.base64
  }

  public set base64(base64: string) {
    this.object.base64 = base64
  }

  public get base64Url() {
    return 'data:image/png;base64,' + this.base64
  }

  public get tabInfoKey() {
    const id = this.object.id
    return `image-editor:${id}`
  }

  public startDraw(event: MouseEvent) {
    const ctx = this.sketch.getContext('2d')
    const {x, y} = this.coordinateSystem.getAxisPosition(event)
    ctx && ctx.moveTo(x, y)
  
    const onMoving = (event: MouseEvent) => {
      const {x, y} = this.coordinateSystem.getAxisPosition(event)
      ctx && ctx.lineTo(x, y)
      ctx && ctx.stroke()
    }

    const endDraw = () => {
      document.removeEventListener('mousemove', onMoving)
      document.removeEventListener('mouseup', endDraw)
      // const layer = new Konva.Layer()
      const base64url = this.sketch.toDataURL()
      Konva.Image.fromURL(base64url, async (image: Konva.Image) => {
        image.setAttrs({
          x: 0,
          y: 0,
        })
        image.setAttr('src', base64url)
        this.stage.getLayers()[0].add(image)
        this.updateStage()
        ctx?.clearRect(0,0,this.width,this.height)
      })
    }

    document.addEventListener('mousemove', onMoving)
    document.addEventListener('mouseup', endDraw)
  }

  public onResize (div: HTMLElement) {
    this.width = div.clientWidth
    this.height = div.clientHeight
  }

  public updateStage() {
    localforage.setItem(this.object.id, this.stage.toJSON())
    this.base64 = this.stage.toDataURL().replace('data:image/png;base64,', '')
  }

  public async initStage() {
    const json = await localforage.getItem(this.object.id)
    if (json) {
      this.stage = Konva.Node.create(json, this.container)

      this.stage.find('Image').forEach((imageNode) => {
        const src = imageNode.getAttr('src');
        const image = new Image();
        image.onload = () => {
          (imageNode as Konva.Image).image(image);
          imageNode.getLayer()?.batchDraw();
        }
        image.src = src;
      })

      return
    }

    this.stage = new Konva.Stage({
      container: this.container,
      width: 0,
      height: 0
    })

    const layer = new Konva.Layer()

    Konva.Image.fromURL(this.base64Url, async (darthNode: Konva.Image) => {
      darthNode.setAttrs({
        x: 0,
        y: 0,
      })
      darthNode.setAttr('src', darthNode.toDataURL());
      layer.add(darthNode)
      this.stage.setAttrs({
        width:darthNode.width(),
        height: darthNode.height()
      })
      this.updateStage()
    })

    this.stage.add(layer)
  }

  public mounted() {
    this.initStage()
    this.onResize(this.container)
    addListener(this.container, this.onResize)
  }

  public beforeDestroy () {
    removeListener(this.container, this.onResize)
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.ImageEditor {
  font-size: 12px;
  height: 100%;
  padding: 0px;
  background: $panel-background-color;
  padding: 3px;
  .body {
    height: 100%;
    line-height: 100%;
    background: $panel-background-color;
    display: flex;
    align-items:center;
    justify-content:center;
  }
  .code-editor {
    height: 100%;
  }
  ::v-deep .CodeMirror,
  ::v-deep .CodeMirror-gutters {
    background: $panel-background-color;
  }
  .drawing-board {
    display: inline-block;
    background: url('~@/assets/bgTransparent.png');
  }
  .sketch {
    position: absolute;
    z-index: 1;
  }
}
</style>
