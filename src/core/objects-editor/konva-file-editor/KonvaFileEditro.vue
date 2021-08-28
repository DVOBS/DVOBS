<template>
  <div class="KonvaFileEditro" :class="mode">
    <div class="body">
      <div class="tool-bar">
        <el-button v-if="mode === 'design-code'" size="mini" round>拆分</el-button>
        <el-button v-else size="mini" type="text" @click="mode = 'design-code'">拆分</el-button>
        <el-button v-if="mode === 'design'" size="mini" round>视图</el-button>
        <el-button v-else size="mini" type="text" @click="mode = 'design'">视图</el-button>
        <el-button v-if="mode === 'code'" size="mini" round>代码</el-button>
        <el-button v-else size="mini" type="text" @click="mode = 'code'">代码</el-button>
      </div>
      <coordinate-system
        v-show="mode === 'design-code' || mode === 'design'"
        class="preview"
        ref="coordinateSystem"
      >
        <canvas
          class="sketch"
          ref="sketch"
          :width="width"
          :height="height"
          @mousedown.stop="startDraw"
        ></canvas>
        <img class="mask" v-if="base64Url" :src="base64Url"/>
        <div class="drawing-board" ref="container">
          <div ref="container"></div>
        </div>
      </coordinate-system>
      <div class="splitter" v-show="mode === 'design-code'"></div>
      <CodeEditor
        v-show="mode === 'design-code' || mode === 'code'"
        class="code-editor"
        mode="javascript"
        ref="codeEditor"
        v-model="content"
      ></CodeEditor>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Ref, Prop, Watch } from 'vue-property-decorator'
import { addListener, removeListener } from 'resize-detector'
import Konva from 'konva'
import { encode, decode } from 'js-base64'
import CodeEditor from '@/core/objects-editor/code-editor/CodeEditor.vue'
import CoordinateSystem from '@/core/common/coordinate-system/CoordinateSystem.vue'
import ProjectFile from '@/core/model/ProjectFile'
import SimplePencil from './SimplePencil'
import KonvaFileEditroPropertyInspector from './KonvaFileEditroPropertyInspector.vue'
import KonvaFileWidgetLibrary from './KonvaFileWidgetLibrary.vue'

@Component({
  components: { CodeEditor }
})
export default class KonvaFileEditro extends Vue {
  @Ref()
  public container!: HTMLDivElement

  @Ref()
  public sketch!: HTMLCanvasElement
  
  public base64Url = ''

  @Ref()
  public coordinateSystem!: CoordinateSystem

  @Prop({ type: Object, required: true })
  public object!: ProjectFile

  private mode = 'design-code'

  public stage!: Konva.Stage
  public skep = false

  public stageObj: any = { className: 'Stage', attrs: {width: 0, height: 0}}

  public selectedLayerIndex = 0
  public selectedLayerObjectIndex = -1

  public get width() {
    return this.stageObj?.attrs?.width
  }
  public get height() {
    return this.stageObj?.attrs?.height
  }

  public get content() {
    return decode(this.object.base64)
  }
  
  public set content(content: string) {
    this.object.base64 = encode(content)
  }

  public get propertyInspector() {
    return KonvaFileEditroPropertyInspector
  }

  public get widgetLibrary() {
    return KonvaFileWidgetLibrary
  }

  public get simplePencil() {
    return new SimplePencil()
  }

  public get currentBrush() {
    return this.simplePencil
  }

  private resetStageObj() {
    this.stageObj = {
      className: 'Stage',
      attrs: {
        width: 600,
        height: 400
      },
      children: [
        {
          attrs: {},
          className: 'Layer',
        }
      ]
    }
    this.selectedLayerIndex = 0
  }

  private async reCreate() {
    if (this.stage) {
      this.base64Url = this.stage.toDataURL()
      this.stage.destroy()
    }
    this.$nextTick()
    this.stage = Konva.Node.create(this.stageObj, this.container)
    const array = this.stage.find('Image')
    let count = 0
    if (!array.length) {
      this.base64Url = ''
    }
    array.forEach((imageNode) => {
      const src = imageNode.getAttr('src')
      const image = new Image();
      image.onload = () => {
        (imageNode as Konva.Image).image(image)
        imageNode.getLayer()?.batchDraw()
        count++
        if (count === array.length) {
          this.$nextTick()
          this.base64Url = ''
        }
      }
      image.src = src;
    })

  }

  @Watch('stageObj', {deep: true})
  private stageObjChange(stageObj: any, oldStageObj: any) {
    if (stageObj === oldStageObj) {
      this.reCreate()
      this.content = JSON.stringify(this.stageObj, null, 4)
    } else {
      // 新旧值不相同，说明stageObj以重新生成
      // 什么都不做
    }
  }

  @Watch('content')
  private contentChange() {
    try {
      this.stageObj = JSON.parse(this.content)
    } catch (error) {
      this.resetStageObj()
    }

    if (this.skep) {
      this.skep = false
      return
    }
    this.reCreate()
  }

  public startDraw(event: MouseEvent) {
    const layer = this.stage.getLayers()[0]
    const canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    const ctx = canvas.getContext('2d')

    const ctx2 = this.sketch.getContext('2d')
    const {x, y} = this.coordinateSystem.getAxisPosition(event)
    if (ctx) {
      this.currentBrush.startDraw(ctx, x, y)
    }
  
    const onMoving = (event: MouseEvent) => {
      const {x, y} = this.coordinateSystem.getAxisPosition(event)
      if (ctx) {
        this.currentBrush.draw(ctx, x, y)
      }
      ctx2?.drawImage(canvas,0,0)
    }

    const endDraw = (event: MouseEvent) => {
      const {x, y} = this.coordinateSystem.getAxisPosition(event)
      if (ctx) {
        this.currentBrush.endDraw(ctx, x, y)
      }
      document.removeEventListener('mousemove', onMoving)
      document.removeEventListener('mouseup', endDraw)
      if (layer.children && layer.children[layer.children?.length - 1]?.className === 'Image') {
        const image = layer.children[layer.children?.length - 1] as Konva.Image
        const newCanvas = document.createElement('canvas')
        newCanvas.width = this.width
        newCanvas.height = this.height
        const newCcx = newCanvas.getContext('2d')

        const ii = image.image()
        if (ii) {
          newCcx?.drawImage(ii,0,0)
        }
        newCcx?.drawImage(canvas,0,0)
        image.image(newCanvas)
        image.setAttr('src', newCanvas.toDataURL())
      } else {
        const newImage = new Konva.Image({
          image: canvas
        })
        newImage.setAttr('src', canvas.toDataURL())
        layer.add(newImage)
      }
      this.skep = true
      this.content = JSON.stringify(JSON.parse(this.stage.toJSON()), null, 4)
      ctx2?.clearRect(0,0,this.width,this.height)
    }

    document.addEventListener('mousemove', onMoving)
    document.addEventListener('mouseup', endDraw)
  }

  public async initStage() {
    try {
      this.stageObj = JSON.parse(this.content)
    } catch (error) {
      this.resetStageObj()
    }
    this.reCreate()
  }

  public onResize (div: HTMLElement) {
    console.log(div)
    // this.width = div.clientWidth
    // this.height = div.clientHeight
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
.KonvaFileEditro {
  font-size: 12px;
  height: 100%;
  padding: 0px 3px 3px;
  background: $panel-background-color;
  .body {
    height: 100%;
    background: $panel-background-dark-color;
  }
  .tool-bar {
    text-align: left;
    padding-left: 5px;
    height: 32px;
    line-height: 28px;
    background: $panel-background-color;
  }

  .preview,
  .code-editor {
    height: calc(100% - 34px);
  }

  &.design-code {
    .preview,
    .code-editor {
      height: calc(50% - 17px);
    }
  }

  .splitter {
    height: 2px;
    background: $panel-background-color;
  }
  ::v-deep .CodeMirror,
  ::v-deep .CodeMirror-gutters {
    background: $panel-background-dark-color;
  }
  .drawing-board {
    display: inline-block;
    background: url('~@/assets/bgTransparent.png');
  }
  .sketch {
    position: absolute;
    z-index: 1;
  }
  img.mask {
    position: absolute;
    z-index: 2;
  }
}
</style>
