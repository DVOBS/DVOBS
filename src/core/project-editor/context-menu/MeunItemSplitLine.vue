<template>
  <div class="MeunItemSplitLine">MeunItemSplitLine</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class MeunItemSplitLine extends Vue {
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.MeunItemSplitLine {
  margin: 2px 15px 2px 15px;
  height: 1px;
  width: calc(100% - 30px);
  background: $text-color-gray;
  color: transparent;
  opacity: 0.35;
}
</style>
