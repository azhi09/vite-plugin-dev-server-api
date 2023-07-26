<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";

const url_1 = "/dev/server/api/ts/export/default";
const url_1_response = ref({});

const url_2 = "/dev/server/api/mjs/pending";
const url_2_response = ref({});

const url_3 = "/dev/server/api/js/export/default";
const url_3_response = ref({});

axios.get(url_1).then((res) => {
  url_1_response.value = res.data;
});

axios.get(url_2).then((res) => {
  url_2_response.value = res.data;
});

axios.get(url_3).then((res) => {
  url_3_response.value = res.data;
});
</script>

<template>
  <div>
    <h1>Vite-plugin-dev-server-api</h1>
    <hr />
    <h3>{{ url_1 }}</h3>
    <div>{{ url_1_response }}</div>
    <hr />
    <h3>{{ url_2 }}</h3>
    <div>{{ url_2_response }}</div>
    <hr />
    <h3>{{ url_3 }}</h3>
    <div>{{ url_3_response }}</div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
