<template>
  <nav>
    <RouterLink
      v-if="!auth.user"
      to="/login"
    >
      {{ t("login") }}
    </RouterLink>
    <div
      v-else
      class="user"
      @click="logout"
    >
      <img
        v-if="auth.user?.photo"
        :src="avatarUrl(auth.user.photo)"
        alt=""
        class="avatar"
      >
      <span v-else-if="auth.user?.profileName">{{ auth.user?.profileName }}</span>
      <span v-else>{{ auth.user?.email }}</span>
    </div>
    <div v-if="auth.user">
      <label
        for="magic-number-input"
        class="sr-only"
      >
        {{ t("magic number") }}
      </label>
      <input
        id="magic-number-input"
        v-model="draftMagicNumber"
        type="number"
      >
      <button @click="saveMagicNumber">
        {{ t("save") }}
      </button>
    </div>
  </nav>
  <LanguageSwitcher />
</template>
<script setup lang="ts">

import { ref , watch } from "vue";
const draftMagicNumber = ref<number>(0);
async function saveMagicNumber() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/me/magic-number`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      magicNumber: draftMagicNumber.value
    })
  });

  const updatedUser = await res.json();
  auth.user = updatedUser;
}

watch(
  () => auth.user,
  (user) => {
    if (user) {
      draftMagicNumber.value = user.magicNumber;
    }
  },
  { immediate: true }
);


import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import { auth , logout } from "@/auth.ts";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const API_BASE = import.meta.env.VITE_API_BASE;

function avatarUrl(url: string) {
  return `${API_BASE}/avatar?url=${encodeURIComponent(url)}`;
}

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
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.logout-btn {
  outline: 2px solid #000;
  outline-offset: 2px;
}
</style>