<template>
  <section>
    <h1>News Admin</h1>

    <button @click="create">+ New</button>

    <div v-for="item in news" :key="item.id" style="margin: 12px 0;">
      <strong>{{ item.title.en }}</strong>

      <div>
        <button @click="edit(item.id)">Edit</button>
        <button @click="remove(item.id)">Delete</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const API = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();

const news = ref<any[]>([]);

const load = async () => {
  const res = await fetch(`${API}/api/immigration-news`);
  news.value = await res.json();
};

const edit = (id: string) => {
  router.push(`/news/${id}`);
};

const create = () => {
  router.push(`/news/new`);
};

const remove = async (id: string) => {
  await fetch(`${API}/api/immigration-news/${id}`, {
    method: "DELETE"
  });
  await load();
};

onMounted(load);
</script>