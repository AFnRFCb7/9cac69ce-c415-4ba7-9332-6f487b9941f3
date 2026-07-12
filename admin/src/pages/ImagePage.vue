<template>
  <main>
    <h1>Image Manager</h1>

    <!-- UPLOAD SECTION -->
    <section class="upload">
      <h2>Upload new image</h2>

      <input type="file" @change="onFileChange" />
      <button @click="uploadImage" :disabled="!file">
        Upload
      </button>
    </section>

    <hr />

    <!-- TABLE VIEW -->
    <section>
      <h2>All Images</h2>

      <table border="1" cellpadding="8">
        <thead>
          <tr>
            <th>Preview</th>
            <th>URL</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="img in images" :key="img">
            <td>
              <img :src="img" width="120" />
            </td>

            <td>
              <a :href="img" target="_blank">{{ img }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref , onMounted } from 'vue'

const file = ref(null)
const images = ref([])

function onFileChange(event) {
  file.value = event.target.files[0]
}

async function uploadImage() {
  if (!file.value) return

  const formData = new FormData()
  formData.append('file', file.value)

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images`, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    console.error('Upload failed')
    return
  }

  const data = await res.json()

  // backend returns permanent URL
  images.value.push({
    url: data.url,
    name: file.value.name
  })

  file.value = null
}

onMounted(async() => {
    console.log("CONSOLE");
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images`);
  images.value = await res.json();
  console.log(JSON.stringify(metadata.value));
});
</script>