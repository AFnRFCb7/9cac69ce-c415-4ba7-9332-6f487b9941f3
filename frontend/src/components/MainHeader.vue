<template>
  <header>
    <div class="navigation-bar">
      <NavigationBar />
    </div>
    <div class="logo" />
    <div class="user-controls">
      <UserControls />
    </div>
  </header>
</template>
<script setup lang="ts">
import UserControls from "@/components/UserControls.vue"
import NavigationBar from "@/components/NavigationBar.vue"
</script>
<style scoped>
header {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #0f172a;
  color: white;
}
.navigation-bar {
    color: white;
    text-decoration: none;
    font-weight: bold ;
}
.logo {
    display: flex;
    gap: 1.5rem;
    opacity: 0.9;
}
.user-controls {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 1rem;
}
</style>