<script setup lang="ts">
import { ref, onMounted , watch } from "vue";
import { useRoute } from "vue-router";
import EditableString from "@/components/EditableString.vue";

const lang = ref("en") ;
const route = useRoute();
const page = route.params.page as string;

const markdown = ref("en");

onMounted(async () => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/metadata?lang=${lang.value}`);
  const data = await res.json();

  markdown.value = data[`markdown${page}`];
});

watch(lang, async (newLang) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/metadata?lang=${newLang}`
  );

  const data = await res.json();
  markdown.value = data[`markdown${page}`];
});

async function save() {
    console.log("markdowneditpage");
  await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/metadata`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name : page , value: markdown.value })
  });
}

function cancel() {
  history.back();
}
</script>

<template>
        <h1>Language</h1>
          <select v-model="lang">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="zh">Chinese</option>
          </select>
        <h1>Admin</h1>
  <EditableString
    :title="page"
    v-model="markdown"
    type="textarea"
    :attribute="page"
    :lang="lang"
  />
</template>