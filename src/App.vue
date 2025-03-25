<template>
  <div class="flex flex-col tracking-wide font-roboto min-h-screen theme-bg">
    <SearchBar @search="search" :isInit="isInit" />
    <Tagline />
    <div v-if="isInit" class="autoColumns my-5 px-2.5">
      <template v-for="item in data" :key="item.title">
        <Category :category="item" />
      </template>
    </div>
    <div
      v-else
      class="mt-8 py-5 flex-1 flex flex-col justify-center items-center"
    >
      <Globule />
      <Loading />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import SearchBar from "./components/SearchBar.vue";
import Tagline from "./components/Tagline.vue";
import Category from "./components/Category.vue";
import Footer from "./components/Footer.vue";
import Loading from "./components/Loading.vue";
import Globule from "./components/Globule.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { throttle } from "@/utils/utils";
import axios from "axios";
import nprogress from "nprogress";

nprogress.configure({ easing: "ease", speed: 300, showSpinner: false });

let originJson: Category[] = [];
const data = ref<Category[]>([]);
const cols = ref(4);
const isInit = ref(false);

const search = (text: string) => {
  if (window.history?.pushState) {
    const { origin, pathname } = window.location;
    const newUrl = `${origin}${pathname}${text ? `?q=${text}` : ""}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
  let newCheatsheet = originJson.map((category: Category) => {
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

const getCheatsheet = async () => {
  try {
    nprogress.start();
    const res = await axios.get(
      "https://raw.githubusercontent.com/yuxinle1996/JsonApi/refs/heads/master/cheatsheet.json"
    );
    originJson = res.data;
    isInit.value = true;
  } catch {
  } finally {
    nprogress.done();
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", throttle(handleResize, 300));
  getCheatsheet();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style>
@reference "tailwindcss";

.autoColumns {
  @apply grid auto-rows-[5px] items-start justify-between
        grid-cols-[repeat(auto-fill,100%)]
        xl:grid-cols-[repeat(auto-fill,calc(100%/4))]
        lg:grid-cols-[repeat(auto-fill,calc(100%/3))]
        md:grid-cols-[repeat(auto-fill,calc(100%/2))];
}
</style>
