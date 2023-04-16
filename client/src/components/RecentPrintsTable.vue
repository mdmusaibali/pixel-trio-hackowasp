<script setup>
import { ref, defineProps } from "vue";
import PrintRow from "./row/PrintRow.vue";
const props = defineProps(["bookings"]);
</script>

<template>
  <v-table fixed-header height="100%">
    <thead>
      <tr>
        <th class="text-left pa-0">Print Id</th>
        <th class="text-left pa-0">Email Id</th>
        <th class="text-left pa-0">Range</th>
        <th class="text-left pa-0">Amount ₹</th>
        <th class="text-left pa-0">Status</th>
        <th class="text-left pa-0">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-if="props?.bookings?.length !== 0"
        v-for="item in props?.bookings"
        :key="item._id"
      >
        <print-row :item="item"></print-row>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped></style>
