<template>
  <main class="page">
    <h1>{{ t("log in") }}</h1>
    <button
      id="loginWithGoogle"
      @click="loginWithGoogle"
    >
      {{ t("sign in") }}
    </button>
  </main>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
function loginWithGoogle() {
  window.location.href = `${import.meta.env.VITE_API_BASE}/auth/google`;
}
</script>

<style scoped>
.page {
  padding: 2rem;
  max-width: 400px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.5rem;
}
</style>
