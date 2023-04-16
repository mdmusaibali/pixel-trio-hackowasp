<script setup>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import ServiceRow from "./row/ServiceRow.vue";
const store = useStore();
const services = computed(() => store.getters["services/services"]);
</script>
<template>
  <v-table fixed-header height="100%">
    <thead>
      <tr>
        <th class="text-left pa-0">Config Id</th>
        <th class="text-left pa-0">Paper Material</th>
        <th class="text-left pa-0">Page Size</th>
        <th class="text-left pa-0">Print Type</th>
        <th class="text-left pa-0">Per Page ₹</th>
        <th class="text-left pa-0">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-if="services?.length !== 0"
        v-for="item in services"
        :key="item.name"
      >
        <service-row :item="item"></service-row>
      </tr>
    </tbody>
  </v-table>
</template>
