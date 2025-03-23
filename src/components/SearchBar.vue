<template>
  <div
    class="border-b theme-bg border-gray-200 dark:border-gray-700 lg:fixed lg:w-full lg:top-0 lg:z-30 lg:left-0"
  >
    <div class="container p-4 mx-auto">
      <div
        class="flex flex-col lg:items-center lg:justify-center lg:flex-row lg:gap-x-4"
      >
        <!-- logo标题 -->
        <div class="flex flex-col items-center sm:flex-row sm:justify-center">
          <div class="flex items-center">
            <img :src="logo" alt="logo" class="object-cover object-left h-10" />
            <p class="ml-2 text-xl text-gray-800 dark:text-gray-200 leading-10">
              大咪的<strong>Tailwind</strong>
            </p>
          </div>
          <h1
            class="flex items-center pl-2 mt-2 text-lg text-gray-600 dark:border-gray-700 dark:text-gray-300 lg:mt-0 sm:ml-2 sm:border-l sm:border-gray-400"
          >
            速查表&nbsp;
            <span
              class="flex items-center h-5 px-2 ml-2 text-xs font-bold text-white dark:text-gray-900 rounded-md bg-primary"
            >
              {{ tailwindVersion }}
            </span>
          </h1>
        </div>
        <!-- 搜索框 -->
        <div
          class="relative h-10 mt-4 sm:w-80 xl:w-80 2xl:w-96 sm:mx-auto lg:m-0"
        >
          <input
            ref="searchInputRef"
            class="w-full h-full text-gray-700 border border-gray-200 rounded-lg peer theme-bg dark:text-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary focus:outline-none focus:ring focus:ring-primary dark:placeholder-gray-400 focus:ring-opacity-20 p-2 leading-6"
            type="text"
            placeholder="Search"
            v-model="searchValue"
          />
          <button
            v-if="searchValue"
            @click="clearInput"
            class="absolute text-gray-500 -translate-y-1/2 right-2 focus:outline-none top-1/2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <span
            v-else
            class="absolute px-2 py-1 text-xs text-gray-400 transition-all duration-300 -translate-y-1/2 border rounded-lg pointer-events-none py- dark:border-gray-700 right-2 top-1/2 peer-focus:opacity-0 dark:text-gray-400"
          >
            Ctrl k
          </span>
        </div>
        <!-- 操作按钮 -->
        <div
          class="flex flex-col mt-4 space-y-3 lg:mt-0 sm:flex-row sm:space-y-0 sm:gap-x-3 sm:items-center sm:justify-center"
        >
          <button
            class="px-4 py-2 text-sm text-gray-600 transition-colors duration-300 transform border rounded-lg dark:text-gray-200 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            @click="emitter.emit('ui/expand')"
          >
            Expand <span class="lg:hidden xl:inline">All</span>
          </button>
          <button
            class="px-4 py-2 text-sm text-gray-600 transition-colors duration-300 transform border rounded-lg dark:text-gray-200 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            @click="emitter.emit('ui/collapse')"
          >
            Collapse <span class="lg:hidden xl:inline">All</span>
          </button>
          <!-- <a
            title="TailwindCSS"
            href="https://www.mida.vip"
            class="flex items-center justify-center h-10 px-4 text-sm font-medium text-center text-white transition-colors duration-300 transform rounded-md dark:text-gray-900 lg:h-10 bg-primary hover:bg-primary/70"
          >
            Back <span class="lg:hidden xl:inline">&nbsp;To Home</span>
          </a> -->
          <div class="flex items-center justify-center">
            <ToggleSwitch v-model="isChecked" />
          </div>
          <a
            class="flex items-center justify-center text-gray-700 transition-colors duration-300 transform dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:underline"
            href="https://github.com/yuxinle1996"
          >
            <IconGithub />
            <span class="sm:hidden text-sm ml-1">去逛逛大咪的github</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconGithub from "@/components/icons/IconGithub.vue";
import ToggleSwitch from "@/components/ToggleSwitch.vue";
import logo from "@/assets/img/logo.png";
import { onBeforeUnmount, onMounted, ref, watchEffect } from "vue";
import emitter from "@/utils/bus";
import useTheme from "@/hooks/useTheme";

const { isChecked } = useTheme();
const emits = defineEmits(["search"]);
const tailwindVersion = ref(
  import.meta.env.VITE_TAILWIND_VERSION || "未知版本"
);
const useSearchParams = () => {
  return new URLSearchParams(window.location.search);
};
const query = useSearchParams().get("q") || "";
const searchValue = ref(query);
const searchInputRef = ref<HTMLInputElement | null>(null);
let searchTimer: number | null = null;

function clearSearch() {
  if (searchTimer !== null) {
    clearTimeout(searchTimer);
  }
}

const handleFocus = (e: KeyboardEvent) => {
  if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    searchInputRef.value?.focus();
  }

  if (e.key === "Escape") {
    searchInputRef.value?.blur();
  }
};

// 输入内容少于5个字符时，延迟搜索
watchEffect(() => {
  clearSearch();
  if (searchValue.value.length < 5) {
    searchTimer = window.setTimeout(() => {
      emits("search", searchValue.value);
    }, 400);
  } else {
    emits("search", searchValue.value);
  }
});

const clearInput = () => {
  searchValue.value = "";
};

onMounted(() => {
  emits("search", query);
  document.addEventListener("keydown", handleFocus);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleFocus);
});
</script>

<style scoped></style>
