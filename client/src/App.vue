<script setup>
import { RouterView, useRouter } from "vue-router";
import { getSession } from "./util/auth";
import { useStore } from "vuex";
import { computed } from "@vue/reactivity";
import { watch } from "vue";
import { useTheme } from "vuetify";
import { configureTheme } from "./util/helper";

const store = useStore();
const sessionAuth = getSession();
const router = useRouter();
const theme = useTheme();
if (sessionAuth && sessionAuth !== undefined) {
  store.commit("user/login", { token: sessionAuth });
}

const isLoggedIn = computed(() => store.getters["user/isLoggedIn"]);
if (isLoggedIn.value) {
  router.push("/home");
}
watch(isLoggedIn, (currentValue) => {
  if (currentValue) {
    router.push("/home");
  } else {
    router.push("/");
  }
});

configureTheme(theme);
</script>

<template>
  <div class="main-container">
    <div class="container">
      <!-- <v-main> -->
      <RouterView />
    </div>
    <!-- </v-main> -->
  </div>
</template>

<style scoped>
.main-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  width: 100vw;
  height: 100vh;
}
.container {
  height: 90%;
  width: 90%;
  max-width: 1500px;
  overflow: scroll;
}
.container::-webkit-scrollbar {
  display: none;
}
</style>
