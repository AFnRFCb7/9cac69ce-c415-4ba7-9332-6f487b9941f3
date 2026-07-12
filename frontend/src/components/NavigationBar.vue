<template>
  <nav style="display:flex; gap:1rem; padding:1rem;">
    <div class="left">
      <RouterLink to="/">
        {{ t("home") }}
      </RouterLink>
      <div class="dropdown">
        <span class="menu-label">
             {{ t("apply") }}
        </span>
        <div class="dropdown-menu">
            <RouterLink to="/chat">
                {{ t("do I need a visa?") }}
            </RouterLink>
            <RouterLink to="/apply/work">
              Work Visa
            </RouterLink>
            <RouterLink to="/apply/student">
              Student Visa
            </RouterLink>
            <RouterLink to="/apply/family">
              Family Visa
            </RouterLink>
        </div>
      </div>
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
.nav {
    display: flex;
    gap: 1rem;
    align-items: center;
}

a,
.menu-label {
    display: inline-block;
    color: white;
    text-decoration: none;
    opacity: 0.65;
    cursor: pointer;
    transition: opacity .35s ease;
}

a:hover,
.menu-label:hover {
    opacity: 1;
}

.dropdown {
    position: relative;
}

.dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;

    min-width: 180px;

    background: #1e293b;
    border-radius: 4px;
    padding: .5rem 0;
    z-index: 1000;
}

.dropdown:hover .dropdown-menu {
    display: flex;
    flex-direction: column;
}

.dropdown-menu a {
    margin: 0;
    padding: .5rem 1rem;
    white-space: nowrap;
}

.dropdown-menu a:hover {
    background: #334155;
}
.left {
    display: flex;
    gap: 1rem;
    align-items: center;
}
</style>