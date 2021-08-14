<template>
  <div class="HorizontalContainer">
    <div
      class="item"
      v-for="(child, i) in children"
      :key="i"
      :style="{
        'width': child.basis + '%'
      }"
    >
      <VerticalContainer
        v-if="child.type==='vertical'"
        :node="child"
        @remove="handelRemove(child)"
      ></VerticalContainer>
      <ViewPanelTabs
        v-if="child.type==='tabs'" v-model="child.children"
        @tabDrop="handleTabDrop($event,i)"
        @remove="handelRemove(child)"
      ></ViewPanelTabs>
      <MainContainer
        v-if="child.type==='main'"
        :node="child"
        @tabDrop="handleTabDrop($event,i)"
      ></MainContainer>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from 'vue-property-decorator'
import { HorizontalLayoutNode, TabsLayoutNode, VerticalLayoutNode } from './layout'
import ViewLayout from './ViewLayout.vue'
import ViewPanelTabs from './ViewPanelTabs.vue'
import VerticalContainer from './VerticalContainer.vue'
import MainContainer from './MainContainer.vue'

@Component({
  components: { ViewPanelTabs, VerticalContainer, MainContainer }
})
export default class HorizontalContainer extends Vue {
  @Inject('layout')
  public layout!: ViewLayout

  @Prop()
  public node!: HorizontalLayoutNode

  public get children() {
    return this.node.children
  }

  public get isEmpty() {
    return this.children.length === 0
  }

  @Watch('isEmpty', { immediate: true})
  public isEmptyChange(isEmpty: boolean) {
    if (isEmpty) {
      this.$emit('remove')
    }
  }

  public async handleTabDrop(postion: string, index: number) {
    await this.$nextTick()
    console.log(postion, index)
    const dragTab = this.layout.dragTab
    const dragTabs = this.layout.dragTabs

    const currentNode = this.node.children[index] as TabsLayoutNode

    const tabNode: TabsLayoutNode = {
      type: 'tabs',
      basis: 10,
      children: [dragTab]
    }

    const newVerticalLayoutNode: VerticalLayoutNode = {
      type: 'vertical',
      basis: 50,
      children: []
    }

    setTimeout(() => {
      if (postion === 'left') {
        currentNode.basis = currentNode.basis / 2
        tabNode.basis = currentNode.basis
        this.node.children.splice(index, 0, tabNode)
      } else if (postion === 'right') {
        currentNode.basis = currentNode.basis / 2
        tabNode.basis = currentNode.basis
        this.node.children.splice(index + 1, 0, tabNode)
      } else if (postion === 'top' || postion === 'bottom') {
        newVerticalLayoutNode.basis = currentNode.basis
        currentNode.basis = 50
        tabNode.basis = 50

        if (postion === 'top') {
          newVerticalLayoutNode.children = [tabNode,currentNode]
        } else {
          newVerticalLayoutNode.children = [currentNode,tabNode]
        }

        this.node.children.splice(index, 1, newVerticalLayoutNode)
      }

      dragTabs?.removeTab(dragTab)
    }, 0);
  }

  public handelRemove(child: any) {
    const index = this.node.children.indexOf(child)
    if (index > -1) { 
      this.node.children.splice(index, 1); 
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.HorizontalContainer {
  display: flex;
  &>.item {
    position: relative;
    flex-grow: 1;
    flex-shrink: 1;
    margin-left: 2px;
  }
  &>.item:first-child {
    margin-left: 0px;
  }
  .drag-container {
    height: 100%;
  }
}
</style>
