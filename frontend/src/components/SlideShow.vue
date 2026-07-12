<template>
  <div class="slideshow">
    <img
      v-if="images.length"
      :src="images[current]"
      :alt="`slide-${current}`"
    />

    <div v-else>
      No images
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
  delay: {
    type: Number,
    default: 3000, // 3 seconds per slide
  },
  loop: {
    type: Boolean,
    default: true,
  },
});

const current = ref(0);
let timer = null;

function start() {
  if (!props.images.length) return;

  timer = setInterval(() => {
    if (current.value < props.images.length - 1) {
      current.value++;
    } else {
      current.value = props.loop ? 0 : props.images.length - 1;
    }
  }, props.delay);
}

function stop() {
  if (timer) clearInterval(timer);
  timer = null;
}

onMounted(start);
onBeforeUnmount(stop);
</script>

<style scoped>
.slideshow {
  width: 100%;
}

img {
  width: 100%;
  display: block;
  object-fit: cover;
}
</style>