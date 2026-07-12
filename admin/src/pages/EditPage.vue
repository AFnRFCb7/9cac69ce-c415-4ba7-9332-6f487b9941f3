<template>
    <ol>
        <li> <router-link to="/admin/edit/metadata"> metadata </router-link> </li>
        <li> <router-link to="/admin/edit/markup"> markup </router-link> </li>
        <li>     <button class="push" @click="pushChanges">
                   PUSH
                 </button> </li>
    </ol>
</template>

<script setup lang="ts">
import MetadataNode from "@/components/MetadataNode.vue";
import { cms } from "@shared/state/cms";

const API = import.meta.env.VITE_API_BASE;

async function pushChanges() {
  await fetch(`${API}/api/cms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cms.data)
  });

  // optional: re-sync published snapshot
  alert("Pushed!");
}
</script>