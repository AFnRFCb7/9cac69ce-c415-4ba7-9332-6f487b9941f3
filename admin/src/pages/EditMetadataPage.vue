<template>
  <main class="metadata">
    <h1>Metadata</h1>

    <div v-if="metadata">
      <MetadataNode :value="metadata" />
    </div>

    <p v-else>Loading...</p>
    <span> <router-link to="/admin/edit"> edit </router-link> </span>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { cms } from "@shared/state/cms";
import MetadataNode from "@/components/MetadataNode.vue";

const metadata = computed(() => cms.data?.metadata);
</script>