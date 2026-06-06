<template>
  <nav style="display:flex; gap:1rem; padding:1rem;">
    <div class="left">
      <RouterLink to="/">
        {{ t("home") }}
      </RouterLink>
      <RouterLink to="/apply">
        {{ t("apply") }}
      </RouterLink>
      <RouterLink to="/visa">
        {{ t("visa") }}
      </RouterLink>
      <RouterLink to="/citizenship">
        {{ t("citizenship") }}
      </RouterLink>
      <RouterLink to="/news">
        {{ t("news" ) }}
      </RouterLink>
      <RouterLink to="/status">
        {{ t("status") }}
      </RouterLink>
      <RouterLink to="/support">
        {{ t("support") }}
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
<style scoped>
a {
    display: inline-block;
    color: white;
    text-decoration: none;
    margin-right: 1rem;
    opacity: 0.65;
    transition: opacity 0.35s ease;
}
a:hover {
    opacity: 1;
    transform: scale(1.05);
}
</style>