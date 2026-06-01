<template>
  <div class="app">
    <MainHeader />
    <main class="content">
      <router-view />
    </main>
    <MainFooter />
  </div>
</template>
<script setup lang="ts">
import MainHeader from "@/components/MainHeader.vue";
import MainFooter from "@/components/MainFooter.vue";
</script>
<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
}
</style>