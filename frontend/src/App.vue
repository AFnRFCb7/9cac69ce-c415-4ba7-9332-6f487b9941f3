<template>
  <router-view />
</template>
<script setup language="ts">
import { useSiteTitle } from "@/composables/useSiteTitle";
useSiteTitle();
</script>