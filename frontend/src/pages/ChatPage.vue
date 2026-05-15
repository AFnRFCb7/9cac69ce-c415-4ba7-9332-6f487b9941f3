<template>
  <div class="chat-window">
    <div class="messages">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role]"
      >
        {{ message.content }}
      </div>
    </div>

    <form
      class="input-row"
      @submit.prevent="submit"
    >
      <input
        v-model="draft"
        type="text"
        placeholder="Ask about visas..."
        :disabled="pending"
      />

      <button
        type="submit"
        :disabled="pending || !draft.trim()"
      >
        Send
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const messages = ref<ChatMessage[]>([]);
const draft = ref("");
const pending = ref(false);

async function sendMessage(text: string) {
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
        message: text,
      }),
    });

    const data = await res.json();

    messages.value.push({
      role: "assistant",
      content: data.message,
    });
  } catch (err) {
    messages.value.push({
      role: "assistant",
      content: "Unable to contact support service.",
    });
  } finally {
    pending.value = false;
  }
}

async function submit() {
  const text = draft.value.trim();

  if (!text) {
    return;
  }

  draft.value = "";

  await sendMessage(text);
}
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message {
  padding: 12px;
  border-radius: 12px;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
  background: #dbeafe;
}

.message.assistant {
  align-self: flex-start;
  background: #f3f4f6;
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