import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ContextMenuMixins extends Vue {
  public contextMenuId = ''
  public contextMenuX = 0
  public contextMenuY = 0

  public openContextMenu(contextMenuId: string, x: number, y: number) {
    this.contextMenuId = contextMenuId
    this.contextMenuX = x
    this.contextMenuY = y
    console.log(contextMenuId)
  }

  public closeContextMenu() {
    this.contextMenuId = ''
    this.contextMenuX = 0
    this.contextMenuY = 0
  }
}