<template>
  <div class="app">
    <Header />
    <main class="content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>
<script setup lang="ts">
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
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