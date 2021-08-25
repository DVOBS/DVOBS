<template>
  <div id="app">
    <router-view class="router-view"/>
  </div>
</template>

<style>
html, body, #app {
  height: 100%;
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
#app {
  .router-view {
    height: 100%;
  }
}
</style>
