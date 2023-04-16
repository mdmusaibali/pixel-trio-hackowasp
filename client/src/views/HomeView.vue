<script setup>
import { RouterView } from "vue-router";
import { useStore } from "vuex";
import Navbar from "../components/Navbar.vue";

const store = useStore();
store.dispatch("user/getMyself");
</script>

<template>
  <div class="grid">
    <Navbar />
    <div class="view">
      <Suspense>
        <RouterView />
      </Suspense>
    </div>
  </div>
</template>

<style setup>
.grid {
  display: grid;
  grid-template-columns: 25fr 75fr;
  height: 100%;
}
.view {
  padding: 0rem 2rem;
}
</style>
