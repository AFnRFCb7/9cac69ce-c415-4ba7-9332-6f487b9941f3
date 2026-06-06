<template>
  <section>
    <h1>{{ isNew ? "Create News" : "Edit News" }}</h1>

    <h2>URL</h2>
    <input v-model="form.url" placeholder="URL" />

    <h2>Title</h2>
    <h3>English</h3>
    <input v-model="form.title.en" placeholder="Title EN" />
    <h3>Spanish</h3>
    <input v-model="form.title.es" placeholder="Title ES" />
    <h3>Chinese</h3>
    <input v-model="form.title.zh" placeholder="Title ZH" />

    <h2>Summary</h2>
    <h3>English</h3>
    <textarea v-model="form.summary.en" cols="80" rows="5" />
    <h3>Spanish</h3>
    <textarea v-model="form.summary.es" cols="80" rows="5" />
    <h3>Chinese</h3>
    <textarea v-model="form.summary.zh" cols="80" rows="5" />

    <br />
    <button @click="save">Save</button>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const API = import.meta.env.VITE_API_BASE_URL;

const route = useRoute();
const router = useRouter();

const isNew = computed(() => {
  const id = route.params.id as string | undefined;
  return !id || id === "new";
});

const form = ref({
  title: { en: "", es: "", zh: "" },
  summary: { en: "", es: "", zh: "" },
  url: ""
});

function emptyForm() {
  return {
    title: { en: "", es: "", zh: "" },
    summary: { en: "", es: "", zh: "" },
    url: ""
  };
}

watch(
  () => route.params.id,
  async (id) => {
    if (!id || id === "new") {
      form.value = emptyForm();
      return;
    }

    const res = await fetch(`${API}/api/immigration-news`);
    const data = await res.json();

    const item = data.find((n: any) => n.id === id);

    form.value = item ? structuredClone(item) : emptyForm();
  },
  { immediate: true }
);

const save = async () => {
  const id = route.params.id as string | undefined;
  const newMode = !id || id === "new";

  const url = newMode
    ? `${API}/api/immigration-news`
    : `${API}/api/immigration-news/${id}`;

  await fetch(url, {
    method: newMode ? "POST" : "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form.value)
  });

  router.push("/news");
};
</script>

<style>
input {
  width: 100%;
  box-sizing: border-box;
}
</style>