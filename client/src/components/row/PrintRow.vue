<script>
export default {
  props: ["item"],
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    async completedHandler(id) {
      this.isLoading = true;
      try {
        await this.$store.dispatch("bookings/markCompleted", id);
      } catch (error) {}
      this.isLoading = false;
    },
    async showPDF(url) {
      window.open(url, "_blank");
    },
  },
};
</script>

<template>
  <td class="pa-0">{{ item?._id }}</td>
  <td class="pa-0">{{ item?.owner?.email }}</td>
  <td class="pa-0">{{ `${item?.from} - ${item?.to}` }}</td>
  <td class="pa-0">{{ item?.totalAmount }}</td>
  <td class="pa-0" :style="{ color: item.isPending ? 'red' : 'green' }">
    <v-icon>{{
      item.isPending ? "mdi-receipt-text-clock" : "mdi-check-circle-outline"
    }}</v-icon>
    {{ item.isPending ? "Pending" : "Completed" }}
  </td>
  <td class="pa-0">
    <v-btn class="mr-3" @click="showPDF(item?.fileUrl)">
      <v-icon>mdi-eye</v-icon>
    </v-btn>
    <v-btn
      color="green"
      @click="completedHandler(item._id)"
      :loading="isLoading"
      :disabled="isLoading || !item.isPending"
    >
      <v-icon>mdi-check</v-icon>
    </v-btn>
  </td>
</template>
