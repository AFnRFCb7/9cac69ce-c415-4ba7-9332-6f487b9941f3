<template>
  <section>
    <h1>{{ isNew ? "Create News" : "Edit News" }}</h1>

    <h2>URL</h2>
    <input v-model="form.url" placeholder="URL" />

    <h2>title</h2>
    <h3>English</h3>
    <input v-model="form.title.en" placeholder="Title EN" />
    <h3>Spanish</h3>
    <input v-model="form.title.es" placeholder="Title ES" />
    <h3>Chinese</h3>
    <input v-model="form.title.zh" placeholder="Title ZH" />

    <h2>Summary</h2>
    <h3>English</h3>
    <textarea v-model="form.summary.en" placeholder="Summary EN" cols="80" rows="5" />
    <h3>Spanish</h3>
    <textarea v-model="form.summary.es" placeholder="Summary ES"  cols="80" rows="5"/>
    <h3>Chinese</h3>
    <textarea v-model="form.summary.zh" placeholder="Summary ZH"  cols="80" rows="5" />


    <br/>
    <button @click="save">Save</button>
  </section>
</template>

<script setup lang="ts">
import { ref, watch , computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const id = route.params.id as string;

const isNew = computed(() => !id || id === "new");

const API = import.meta.env.VITE_API_BASE_URL;

const router = useRouter();

const form = ref({
  title: { en: "", es: "", zh: "" },
  summary: { en: "", es: "", zh: "" },
  url: ""
});

const emptyForm = () => ({
  title: { en: "", es: "", zh: "" },
  summary: { en: "", es: "", zh: "" },
  url: ""
});

watch(
  () => route.params.id,
  async (id) => {
    // NEW ARTICLE
    if (!id || id === "new") {
      form.value = emptyForm();
      return;
    }

    // EDIT EXISTING ARTICLE
    const res = await fetch(`${API}/api/immigration-news`);
    const data = await res.json();

    const item = data.find((n: any) => n.id === id);

    form.value = item ? structuredClone(item) : emptyForm();
  },
  { immediate: true }
);

const save = async () => {
  const id = route.params.id;
  const isNew = !id || id === "new";

  const method = isNew ? "POST" : "PUT";
  const url = isNew
    ? `${API}/api/immigration-news`
    : `${API}/api/immigration-news/${id}`;

  await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(form.value)
  });

  router.push("/news");
};
</script>
<style>
input {
    width: 100%;
    box-sizing: border-box ;
}
</style>