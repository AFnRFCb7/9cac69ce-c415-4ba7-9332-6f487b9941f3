<template>
  <footer>
    <div class="left">
      <p>{{ t("copyright") }}</p>
    </div>
    <nav class="right">
      <RouterLink to="/privacy">
        {{ t("privacy") }}
      </RouterLink>
      <RouterLink to="/terms">
        {{ t("terms") }}
      </RouterLink>
      <RouterLink to="/support">
        {{ t("support") }}
      </RouterLink>
    </nav>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

</script>

<style scoped>
footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.9rem;
}

.right {
  display: flex;
  gap: 1rem;
}

.right a {
  text-decoration: none;
  color: #475569;
}

.right a:hover {
  text-decoration: underline;
}
</style>