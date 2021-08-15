<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import sharedVnodesContainer from './sharedVnodesContainer'
@Component
export default class CrossRender extends Vue {
  @Prop({ required: true })
  private name!: string;

  private render(createElement: Vue.CreateElement) {
    const defaultSoltNodes = this.$slots.default || []
    for (const defaultSoltNode of defaultSoltNodes) {
      defaultSoltNode.data = defaultSoltNode.data || {}
      defaultSoltNode.data.keepAlive = true
    }
    if (this.$slots.default && this.$slots.default.length) {
      Vue.set(sharedVnodesContainer.vnodes, this.name, this.$slots.default[0])
    }
    return createElement('div', { style: { display: 'none' }} ,this.$slots.default)
  }

  private beforeDestroy() {
    Vue.delete(sharedVnodesContainer.vnodes, this.name)
  }
}
</script>
