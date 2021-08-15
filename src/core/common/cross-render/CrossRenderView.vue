<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import sharedVnodesContainer from './sharedVnodesContainer'
@Component
export default class CrossRenderView extends Vue {
  @Prop({ required: true })
  private name!: string;

  private get sharedVnodesContainer() {
    return sharedVnodesContainer
  }

  private render(createElement: Vue.CreateElement) {
    const result = createElement('div', { style: {
      height: '100%'
    } })
    return result
  }

  @Watch('name')
  @Watch('sharedVnodesContainer', { deep: true })
  private addEl() {
    const vnode = sharedVnodesContainer.vnodes[this.name]
    const el = vnode?.componentInstance?.$el || vnode?.elm
    if (el) {
      this.$el.appendChild(el)
    }
  }

  private mounted() {
    this.addEl()
  }

  private beforeDestroy() {
    // DO NOTHING
  }
}
</script>
