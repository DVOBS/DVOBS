import Vue from "vue";

export default class SimplePencil {
  state = Vue.observable({
    color: '#ff0000',
    lineWidth: 10
  })
  startDraw(ctx: CanvasRenderingContext2D, x: number, y:number) {
    ctx.lineWidth = this.state.lineWidth
    ctx.strokeStyle = this.state.color
    ctx.beginPath()
    ctx.moveTo(x, y)
  }
  draw(ctx: CanvasRenderingContext2D, x: number, y:number) {
    ctx.lineTo(x, y);
    ctx.stroke()
  }
  endDraw(ctx: CanvasRenderingContext2D, x: number, y:number) {
    ctx.lineTo(x, y);
    ctx.stroke()
  }
}