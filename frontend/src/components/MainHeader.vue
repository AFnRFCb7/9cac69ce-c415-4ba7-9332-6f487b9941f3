<template>
  <header>
    <div class="logo">
        <h1 class="company-name">{{ company }}</h1>
    </div>
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
import { computed, onMounted } from "vue";
import UserControls from "@/components/UserControls.vue";
import NavigationBar from "@/components/NavigationBar.vue";
import { cms } from "@shared/state/cms";

const company = computed(() =>
  cms.data?.metadata?.company?.name ?? ""
);

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
  font-weight: bold;
}
.logo {
  display: flex;
  gap: 1.5rem;
  opacity: 0.9;
}
.company-name {
   font-size: 1.5rem;       /* Larger font size */
   font-weight: bold;       /* Make it bold */
   opacity: 0.95;           /* Slight transparency if desired */
   text-transform: uppercase; /* Make it stand out */
 }
.user-controls {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>