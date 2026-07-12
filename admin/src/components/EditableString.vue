<template>
  <strong class="label">{{ title }}</strong>

  <span v-if="editing" class="editor">
    <input v-model="local" v-if="type === 'input'"/>
    <textarea rows="30" cols="80" v-model="local" v-else></textarea>
    <button @click="cancel">Cancel</button>
    <button @click="save">Save</button>
  </span>

  <span v-else class="viewer">
    <pre>{{ modelValue }}</pre>
    <button @click="editing = true">Edit</button>
  </span>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  title: String,
  modelValue: String,
  attribute: String,
  type: String,
    lang : String
});

const emit = defineEmits([
  "update:modelValue"
]);

const editing = ref(false);
const local = ref(props.modelValue ?? "");

watch(
  () => props.modelValue,
  (value) => {
    if (!editing.value) {
      local.value = value ?? "";
    }
  }
);

async function save() {
    console.log("editablestring");
  emit("update:modelValue", local.value);
  editing.value = false;
  await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/metadata?lang=${props.lang}`,
      {
          method: "PUT",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ name : props.attribute , value : local.value })
      });
}

function cancel() {
  local.value = props.modelValue ?? "";
  editing.value = false;
}
</script>
<style scoped>
.label {
  margin-right: 0.75rem;
}

.editor input {
  margin-right: 0.5rem;
}

.editor button {
  margin-right: 0.25rem;
}

.viewer button {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}
</style>