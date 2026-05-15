<template>
  <main class="chat-page">
    <!-- Messages -->
    <div class="messages">
      <ChatMessage
        v-for="(m, i) in messages"
        :key="i"
        :role="m.role"
        :content="m.content"
      />
    </div>

    <!-- Input -->
    <form class="input-row" @submit.prevent="send">
      <input
        v-model="draft"
        type="text"
        placeholder="Ask about visas..."
        :disabled="pending"
      />

      <button type="submit" :disabled="pending || !draft.trim()">
        Send
      </button>
    </form>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";


const { t , locale } = useI18n();


console.log("CHAT LOCALE",locale.value);
import { ref } from "vue";
import ChatMessage from "@/components/chat/ChatMessage.vue";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const messages = ref<Message[]>([]);
const draft = ref("");
const pending = ref(false);

async function send() {
  const text = draft.value.trim();
  if (!text || pending.value) return;

  draft.value = "";

  messages.value.push({
    role: "user",
    content: text,
  });

  pending.value = true;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages.value,
      })
    });

    const data = await res.json();

    messages.value.push({
      role: "assistant",
      content: t(data.message),
    });
  } catch (e) {
    messages.value.push({
      role: "assistant",
      content: t("CHAT_UNABLE"),
    });
  } finally {
    pending.value = false;
  }
}
</script>

<style scoped>
.chat-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;

  display: flex;
  flex-direction: column;
  gap: 16px;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-row {
  display: flex;
  gap: 8px;
}

.input-row input {
  flex: 1;
  padding: 12px;
}

.input-row button {
  padding: 12px 16px;
}
</style>