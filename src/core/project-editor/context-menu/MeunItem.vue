<template>
  <div class="MeunItem" :class="{ disable }" @click="handelClick">{{label}}</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator'
import ProjectEditor from '@/core/project-editor/ProjectEditor.vue'

@Component
export default class MeunItem extends Vue {
  @Inject('projectEditor')
  public projectEditor!: ProjectEditor

  @Prop({ type: String, required: true})
  public label!: string

  @Prop({ type: Boolean, required: false, default: false})
  public disable!: boolean

  public handelClick() {
    this.$emit('click')
    this.projectEditor.closeContextMenu()
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.MeunItem {
  height: 32px;
  line-height: 32px;
  padding: 0 15px 0 15px;
  cursor: pointer;
  border-left: solid 1px transparent;
}

.MeunItem.disable {
  height: 32px;
  line-height: 32px;
  padding: 0 15px 0 15px;
  color: rgba($text-color, 50%);
  cursor: not-allowed;
}

.MeunItem:hover {
  background: rgba(0,0,0,0.25);
  border-left: solid 1px $primary-color;
}
</style>
