<template>
  <div class="VerticalContainer">
    <div
      class="item"
      v-for="(child, i) in children"
      :key="i"
      :style="{
        'height': child.basis + '%'
      }"
    >
      <HorizontalContainer
        v-if="child.type==='horizontal'"
        :node="child"
        @remove="handelRemove(child)"
        @single="handleSingle(child)"
      ></HorizontalContainer>
      <ViewPanelTabs
        v-if="child.type==='tabs'"
        v-model="child.children"
        @tabDrop="handleTabDrop($event,i)"
        @remove="handelRemove(child)"
      ></ViewPanelTabs>
      <MainContainer
        v-if="child.type==='main'"
        :node="child"
        @tabDrop="handleTabDrop($event,i)"
        @remove="handelRemove(child)"
      ></MainContainer>
      <div class="resize-handler" @mousedown="resizeHandlerStartDrag($event, i)"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from 'vue-property-decorator'
import { HorizontalLayoutNode, MainLayoutNode, TabsLayoutNode, VerticalLayoutNode } from './layout'
import { addListener, removeListener } from 'resize-detector'
import ViewLayout from './ViewLayout.vue'
import ViewPanelTabs from './ViewPanelTabs.vue'
import MainContainer from './MainContainer.vue'

const HorizontalContainer = () => import('./HorizontalContainer.vue')

@Component({
  name: 'VerticalContainer',
  components: {
    ViewPanelTabs,
    HorizontalContainer,
    MainContainer
  }
})
export default class VerticalContainer extends Vue {
  @Inject('layout')
  public layout!: ViewLayout

  @Prop()
  public node!: VerticalLayoutNode

  public width = 0

  public height = 0

  public get children() {
    return this.node.children
  }

  
  public get isEmpty() {
    return this.children.length === 0
  }

  public get isSingle() {
    return this.children.length === 1
  }

  @Watch('isEmpty', { immediate: true})
  public isEmptyChange(isEmpty: boolean) {
    if (isEmpty) {
      this.$emit('remove')
    }
  }

  @Watch('isSingle', { immediate: true})
  public isSingleChange(isEmpty: boolean) {
    if (isEmpty) {
      this.$emit('single')
    }
  }

  public resizeHandlerStartDrag(event: MouseEvent, index: number) {
    const current = this.children[index]
    const next = this.children[index + 1]
    const initialState = {
      currentBasis: current.basis,
      nextBasis: next.basis,
      clientY: event.clientY
    }
    const totalBasis = initialState.nextBasis + initialState.currentBasis
    const min = 10
    const max = totalBasis - min

    const check = (v: number) => {
      if (v > max) {
        return max
      }
      if (v < min) {
        return min
      }
      return v
    }

    const onMoving = (event: MouseEvent) => {
      const dx = 100 * (event.clientY - initialState.clientY) / this.height
      current.basis = check(initialState.currentBasis + dx)
      next.basis = check(initialState.nextBasis - dx)
    }
    const endDrag = () => {
      document.removeEventListener('mousemove', onMoving)
      document.removeEventListener('mouseup', endDrag)
    }
    document.addEventListener('mousemove', onMoving)
    document.addEventListener('mouseup', endDrag)
  }

  public async handleTabDrop(postion: string, index: number) {
    await this.$nextTick()
    console.log(postion, index)
    const dragTab = this.layout.dragTab
    const dragTabs = this.layout.dragTabs

    const currentNode = this.node.children[index] as TabsLayoutNode

    const tabNode: TabsLayoutNode = {
      type: 'tabs',
      basis: 0,
      children: [dragTab]
    }

    const newHorizontalLayoutNode: HorizontalLayoutNode = {
      type: 'horizontal',
      basis: 0,
      children: []
    }

    setTimeout(() => {
      if (postion === 'top') {
        currentNode.basis = currentNode.basis / 2
        tabNode.basis = currentNode.basis
        this.node.children.splice(index, 0, tabNode)
      } else if (postion === 'bottom') {
        currentNode.basis = currentNode.basis / 2
        tabNode.basis = currentNode.basis
        this.node.children.splice(index + 1, 0, tabNode)
      } else if (postion === 'left' || postion === 'right') {
        newHorizontalLayoutNode.basis = currentNode.basis
        currentNode.basis = 50
        tabNode.basis = 50

        if (postion === 'left') {
          newHorizontalLayoutNode.children = [tabNode,currentNode]
        } else {
          newHorizontalLayoutNode.children = [currentNode,tabNode]
        }

        this.node.children.splice(index, 1, newHorizontalLayoutNode)
      }

      dragTabs?.removeTab(dragTab)
      this.layout.dragTab = ''
      this.layout.dragTabs = null
    }, 0);
  }

  public handelRemove(child: HorizontalLayoutNode | TabsLayoutNode | MainLayoutNode) {
    const children = this.node.children
    const index = children.indexOf(child)
    if (index > -1) { 
      const basis = child.basis
      const prev = children[index - 1]
      const next = children[index + 1]
      children.splice(index, 1)

      if (prev) {
        prev.basis += basis
        return
      }

      
      if (next) {
        next.basis += basis
        return
      }
    }
  }

  public handleSingle(child: HorizontalLayoutNode) {
    const children = this.node.children
    const index = children.indexOf(child)
    const cc = child.children[0]
    if (cc.type === 'tabs' || cc.type === 'main') {
      cc.basis = child.basis
      children.splice(index, 1, cc)
    }
    if (cc.type=== 'vertical') {
      const total = cc.children.reduce((a: number,b) => {
        return a + b.basis
      }, 0)
      cc.children.forEach((ccc) => {
        ccc.basis =  child.basis * ( ccc.basis / total )
      })
      children.splice(index, 1, ...cc.children)
    }
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
.VerticalContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
  &>.item {
    position: relative;
    flex-grow: 1;
    margin-top: 1px;
  }
  &>.item:first-child {
    margin-top: 0px;
  }
  &>.item .resize-handler{
    position: absolute;
    height: 7px;
    bottom: -4px;
    left: 0;
    right: 0;
    background: transparent;
    cursor: ns-resize;
    z-index: 21;
  }
  &>.item .resize-handler:hover {
    background: $primary-color;
    opacity: 0.5;
  }
  &>.item:last-child>.resize-handler {
    display: none;
  }
}
</style>
