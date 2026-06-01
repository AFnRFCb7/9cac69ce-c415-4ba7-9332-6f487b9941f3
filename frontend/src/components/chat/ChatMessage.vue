<template>
  <div :class="['row', role]">
    <div class="bubble">
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  role: "user" | "assistant";
  content: string;
}>();
</script>

<style scoped>
.row {
  display: flex;
  width: 100%;
}

.row.user {
  justify-content: flex-end;
}

.row.assistant {
  justify-content: flex-start;
}

.bubble {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 16px;

  white-space: pre-wrap;
  word-break: break-word;

  line-height: 1.4;
}

/* user message styling */
.user .bubble {
  background: #dbeafe;
}

/* assistant message styling */
.assistant .bubble {
  background: #f3f4f6;
}
</style>