<script setup>
import { ref } from "vue";
import Logo from "./Logo.vue";
import { useRoute, useRouter } from "vue-router";
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";

const route = useRoute();
const router = useRouter();
const currentRoute = computed(() => route.fullPath);
const store = useStore();
const navItems = ref([
  {
    icon: "mdi-view-dashboard",
    name: "Dashboard",
    id: "dashboard",
    path: "/home/dashboard",
  },
  {
    icon: "mdi-washing-machine",
    name: "Services",
    id: "services",
    path: "/home/services",
  },
  // {
  //   icon: "mdi-cog",
  //   name: "Settings",
  //   id: "settings",
  //   path: "/home/settings",
  // },
  { icon: "mdi-logout", name: "Logout", id: "logout", path: "/home/logout" },
]);

const logoutHandler = () => {
  store.dispatch("user/logout").finally(() => {
    router.push("/");
  });
};

const handleRouteChange = (path) => {
  if (path === "/home/logout") {
    return logoutHandler();
  }
  router.push(path);
};
</script>

<template>
  <v-card class="navbar">
    <Logo />
    <nav>
      <div
        v-for="item of navItems"
        :class="`${
          item.path === currentRoute ? 'nav-item selected' : 'nav-item'
        }`"
        @click="handleRouteChange(item.path)"
      >
        <v-icon class="icon">{{ item.icon }}</v-icon>
        <p>{{ item.name }}</p>
      </div>
    </nav>
  </v-card>
</template>

<style scoped>
nav {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 2.5rem;
}
.navbar {
  height: 100%;
  padding: 2rem;
}
.nav-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  border-radius: 2rem;
  cursor: pointer;
  color: "#000000";
  opacity: 50%;
  gap: 1rem;
}

.nav-item.selected {
  background-color: #fde616;
  color: black;
  opacity: 100%;
}
</style>
