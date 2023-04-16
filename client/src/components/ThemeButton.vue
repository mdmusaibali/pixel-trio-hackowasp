<script setup>
import { useTheme } from "vuetify";
import { setTheme } from "../util/helper";
import { computed } from "@vue/reactivity";

const theme = useTheme();
const isDarkMode = computed(() => theme.global.current.value.dark);

const switchTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  if (theme.global.current.value.dark) {
    setTheme(true);
  } else {
    setTheme(false);
  }
};
</script>

<template>
  <div class="theme-switch" @click="switchTheme">
    <div class="switch">
      <v-icon :color="isDarkMode ? 'white' : 'black'"
        >mdi-theme-light-dark</v-icon
      >
    </div>
  </div>
</template>

<style scoped>
.theme-switch {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.2rem;
  border-radius: 8px;
  cursor: pointer;
}
</style>
