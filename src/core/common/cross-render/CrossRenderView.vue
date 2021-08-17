<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import sharedVnodesContainer from './sharedVnodesContainer'
@Component
export default class CrossRenderView extends Vue {
  @Prop({ required: true })
  public name!: string;

  public get sharedVnodesContainer() {
    return sharedVnodesContainer
  }

  public render(createElement: Vue.CreateElement) {
    const result = createElement('div', { style: {
      height: '100%'
    } })
    return result
  }

  @Watch('name')
  @Watch('sharedVnodesContainer', { deep: true })
  public addEl() {
    const vnode = sharedVnodesContainer.vnodes[this.name]
    const el = vnode?.componentInstance?.$el || vnode?.elm
    if (el) {
      this.$el.appendChild(el)
    }
  }

  public mounted() {
    this.addEl()
  }

  public beforeDestroy() {
    // DO NOTHING
  }
}
</script>
