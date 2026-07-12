<template>
  <div class="node">
    <template v-if="isObject(value)">
      <div v-for="(val, key) in value" :key="key" class="pair">
        <strong>{{ key }}:</strong>
        <div class="child">
          <MetadataNode :value="val" :path="path ? `${path}.${key}` : key" />
        </div>
      </div>
    </template>

    <template v-else>
      <span v-if="!isEditing" class="leaf" @click="startEdit">
        {{ value }}
      </span>

      <input
        v-else
        v-model="draft"
        @blur="commit"
        @keydown.enter="commit"
        @keydown.esc="cancel"
        class="leaf-input"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { cms } from "@shared/state/cms";

const props = defineProps<{
  value: any;
  path?: string;
}>();

const isEditing = ref(false);
const draft = ref("");

function startEdit() {
  isEditing.value = true;
  draft.value = String(props.value ?? "");
}

function commit() {
  isEditing.value = false;
  // write back to CMS if path exists
  if (props.path) {
    setValue(props.path, draft.value);
  }
}

function setValue(path: string, value: string) {
  const keys = path.split(".");
  let obj: any = cms.data?.metadata;

  if (!obj) return;

  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
    if (obj == null) return;
  }

  obj[keys[keys.length - 1]] = value;
}

function cancel() {
  isEditing.value = false;
}

function isObject(val: any) {
  return val !== null && typeof val === "object";
}

</script>

<style scoped>
.node {
  padding-left: 1rem;
  border-left: 1px solid #ddd;
}

.pair {
  margin: 0.25rem 0;
}

.child {
  margin-left: 0.5rem;
}

.leaf {
  color: #333;
}
</style>