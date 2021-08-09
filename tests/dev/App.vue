<template>
  <div id="app">
    <div class="nav">
      <router-link to="/foo" />
    </div>
    <router-view class="router-view"/>
  </div>
</template>

<style>
html, body, #app {
  height: 100%;
}
</style>

<style lang="scss" scoped>
#app {
  .router-view {
    height: 100%;
  }
}
</style>
