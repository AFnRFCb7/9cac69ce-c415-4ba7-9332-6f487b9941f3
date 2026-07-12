<template>
  <main class="content">
    <h1>Page Views</h1>

    <table>
      <thead>
        <tr>
          <th>Page</th>
          <th>Views</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(count, page) in views" :key="page">
          <td>{{ page }}</td>
          <td>{{ count }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const API = import.meta.env.VITE_API_BASE_URL;
const views = ref<Record<string, number>>({});

async function loadViews() {
  const res = await fetch(`${API}/api/views`);

  if (!res.ok) {
    console.error("Failed to load views");
    return;
  }

  views.value = await res.json();
}

onMounted(loadViews);
</script>