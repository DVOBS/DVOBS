export default class SimplePencil {
  start(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.moveTo(x, y)
  }
  move(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.lineTo(x, y)
    ctx.stroke()
  }
  end(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.lineTo(x, y)
    ctx.stroke()
  }
}