<template>
  <div class="SimpleImage">SimpleImage</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class SimpleImage extends Vue {
}
</script>
<style scoped lang="scss">
@import '~@/assets/style/variables.scss';
.SimpleImage {
  background: red;
}
</style>
