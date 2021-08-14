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
        v-if="child.type==='vertical'"
        :node="child"
        @remove="handelRemove(child)"
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
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from 'vue-property-decorator'
import { HorizontalLayoutNode, TabsLayoutNode, VerticalLayoutNode } from './layout'
import ViewLayout from './ViewLayout.vue'
import ViewPanelTabs from './ViewPanelTabs.vue'
import HorizontalContainer from './HorizontalContainer.vue'
import MainContainer from './MainContainer.vue'

@Component({
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

    const newHorizontalLayoutNode: HorizontalLayoutNode = {
      type: 'horizontal',
      basis: 50,
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
.VerticalContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
  &>.item {
    flex-grow: 1;
    margin-top: 2px;
  }
  &>.item:first-child {
    margin-top: 0px;
  }
}
</style>
