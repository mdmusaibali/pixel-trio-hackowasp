<script>
export default {
  props: ["item"],
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    isDeleteLoading() {
      return this.isLoading;
    },
  },
  methods: {
    async deleteService(id) {
      this.isLoading = true;
      try {
        await this.$store.dispatch("services/deleteService", id);
      } catch (error) {}
      this.isLoading = false;
    },
  },
};
</script>

<template>
  <td class="pa-0">{{ item._id }}</td>
  <td class="pa-0">{{ item.paperMaterial }}</td>
  <td class="pa-0">{{ item.paperSize }}</td>
  <td class="pa-0">
    {{ item.printType }}
  </td>
  <td class="pa-0">
    {{ item.perPageCost }}
  </td>
  <td class="pa-0">
    <v-btn class="mr-3">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-btn
      @click="deleteService(item._id)"
      color="red"
      :disabled="isLoading"
      :loading="isLoading"
    >
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </td>
</template>
