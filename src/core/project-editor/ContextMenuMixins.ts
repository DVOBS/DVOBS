import { Component, Ref, Vue } from 'vue-property-decorator'

@Component
export default class ContextMenuMixins extends Vue {
  @Ref()
  public contextMenu!: Vue

  public contextMenuId = ''
  public contextMenuX = 0
  public contextMenuY = 0

  public async openContextMenu(contextMenuId: string, x: number, y: number) {
    this.contextMenuId = contextMenuId
    this.contextMenuX = x
    this.contextMenuY = y
    await this.$nextTick()
    const bcr = this.contextMenu.$el.getBoundingClientRect()
    const w = window.innerWidth
    const h = window.innerHeight
    if (bcr.right > w) {
      this.contextMenuX = w - bcr.width
    }
    if (bcr.bottom > h) {
      this.contextMenuY = h - bcr.height
    }
  }

  public closeContextMenu() {
    this.contextMenuId = ''
    this.contextMenuX = 0
    this.contextMenuY = 0
  }
}