<template>
  <div
    class="tracking-wide font-roboto min-h-screen grid content-start theme-bg"
  >
    <SearchBar @search="search" />
    <Tagline />
    <div class="w-full p-4 mx-auto mt-4 overflow-x-hidden">
      <wc-flow-layout :gap="16" :cols="cols">
        <Category v-for="item in data" :key="item.title" :category="item" />
      </wc-flow-layout>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import SearchBar from "./components/SearchBar.vue";
import Tagline from "./components/Tagline.vue";
import Category from "./components/Category.vue";
import Footer from "./components/Footer.vue";
import "wc-flow-layout";
import json from "@/assets/cheatsheet.json";
import { onMounted, onUnmounted, ref } from "vue";
import { throttle } from "@/utils/utils";

const data = ref<Category[]>(json);
const cols = ref(4);

const search = (text: string) => {
  if (window.history?.pushState) {
    const { origin, pathname } = window.location;
    const newUrl = `${origin}${pathname}${text ? `?q=${text}` : ""}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  let newCheatsheet = json.map((category: Category) => {
    if (category.title.toLowerCase().includes(text)) {
      return category;
    } else {
      return {
        title: category.title,
        content: category.content.map((subcategory: Subcategory) => {
          if (
            subcategory.title.toLowerCase().includes(text) ||
            subcategory.description.toLowerCase().includes(text)
          ) {
            return subcategory;
          } else {
            return {
              title: subcategory.title,
              docs: subcategory.docs,
              description: subcategory.description,
              table: subcategory.table.filter((tr) => {
                for (let td = 0; td < tr.length; td++) {
                  if (tr[td].includes(text)) {
                    return true;
                  }
                }
                return false;
              }),
            };
          }
        }),
      };
    }
  });
  data.value = newCheatsheet;
};

const handleResize = () => {
  const width = window.innerWidth;
  if (width <= 640) {
    cols.value = 1;
  } else if (width <= 768) {
    cols.value = 2;
  } else if (width <= 1024) {
    cols.value = 2;
  } else if (width <= 1280) {
    cols.value = 3;
  } else {
    cols.value = 4;
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", throttle(handleResize, 300));
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style></style>
