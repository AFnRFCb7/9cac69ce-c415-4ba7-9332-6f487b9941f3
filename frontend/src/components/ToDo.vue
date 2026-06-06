<template>
  <main style="padding: 2rem;">
    <h1>{{ t("todo") }}</h1>
  </main>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>