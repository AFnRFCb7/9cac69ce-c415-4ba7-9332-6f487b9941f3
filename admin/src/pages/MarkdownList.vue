<template>
  <div>
    <h2>Markdown Pages</h2>

    <ul>
      <li v-for="page in pages" :key="page">
        <button @click="openPage(page)">
          {{ page }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "MarkdownList",

  data() {
    return {
      pages: []
    };
  },

  async mounted() {
    await this.loadPages();
  },

  methods: {
    async loadPages() {
      // You will need an endpoint like this:
      // GET /api/content
      const res = await fetch("/api/content");
      this.pages = await res.json();
    },

    openPage(page) {
      // emit event or route to editor
      this.$emit("open", page);
    }
  }
};
</script>