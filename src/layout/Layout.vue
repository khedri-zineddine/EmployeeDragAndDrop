<template>
  <div class="flex flex-col h-full">
    <Header />
    <div class="flex w-full" style="height: calc(100% - 4rem)">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";
import Header from "./header/Header.vue";
export default defineComponent({
  name: "Layout",
  components: {
    Header,
  },
  setup() {},
});
</script>
<style lang="sass">
</style>