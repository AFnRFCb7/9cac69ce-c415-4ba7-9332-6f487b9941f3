<template>
  <main style="padding:2rem;">
    <h1>{{ t("title") }}</h1>
    <p>{{ t("description") }}</p>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>