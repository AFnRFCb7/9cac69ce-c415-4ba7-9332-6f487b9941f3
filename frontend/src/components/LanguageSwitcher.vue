<template>
  <label class="lang-label">
    <span class="sr-only">{{ t("language") }}</span>
    <select
      v-model="locale"
      class="lang-select"
    >
      <!-- eslint-disable-next-line vue/no-bare-strings-in-template -->
      <option value="en">🇺🇸 English</option>
      <!-- eslint-disable-next-line vue/no-bare-strings-in-template -->
      <option value="es">🇪🇸 Español</option>
      <!-- eslint-disable-next-line vue/no-bare-strings-in-template -->
      <option value="zh">🇨🇳 中文</option>
    </select>
  </label>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { watch } from "vue";

const { locale, t } = useI18n();

// initialize from storage once
const saved = localStorage.getItem("locale");
if (saved) {
  locale.value = saved;
}

// persist changes
watch(locale, (newLocale) => {
  localStorage.setItem("locale", newLocale);
});
</script>
<style scoped>
.lang-select {
  padding: 0.3rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
}

/* optional but good for accessibility */
.lang-select:focus {
  outline: 2px solid #000;
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  left: -9999px;
}
</style>
