<template>
  <div
    class="rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden transition-colors duration-300"
  >
    <div
      class="flex justify-center items-center font-bold text-gray-800 dark:bg-gray-700 dark:text-gray-200 transition-colors duration-300 tracking-wider bg-gray-200 rounded-md px-3 py-2 mx-3 mt-3 mb-2"
    >
      <h1 class="grow">{{ category.title }}</h1>
      <ArrowDown
        :value="isOpen"
        @action="isOpen = !isOpen"
        :ariaLabel="`${isOpen ? 'Close' : 'Open'} ${category.title} category`"
      />
    </div>
    <SubCategory
      v-for="subcategory in category.content"
      :key="subcategory.title"
      :subcategory="subcategory"
      :shouldHide="!isOpen"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SubCategory from "./SubCategory.vue";
import ArrowDown from "./ArrowDown.vue";

import "wc-flow-layout";

const { category } = defineProps<{
  category: Category;
}>();

const isOpen = ref(true);
</script>

<style scoped>
.test {
  padding: 12px;
  font-size: 2em;
  border-radius: 6px;
  background-color: #80808020;
}
div .test:nth-child(4n + 1) {
  height: 200px;
}
div .test:nth-child(4n + 2) {
  height: 120px;
}
div .test:nth-child(4n + 3) {
  height: 150px;
}
div .test:nth-child(4n) {
  height: 260px;
}
</style>
