<script setup>
import { onMounted, watch } from "vue";
import RecentPrintsTable from "../../components/RecentPrintsTable.vue";
import ThemeButton from "../../components/ThemeButton.vue";
import { useStore } from "vuex";
import { ref } from "vue";
import { computed } from "@vue/reactivity";
const store = useStore();
const isLoading = ref(false);
const searchText = ref("");

const bookings = computed(() => store.getters["bookings/bookings"]);
const completedBookings = computed(
  () => store.getters["bookings/completedBookings"]
);
const pendingBookings = computed(
  () => store.getters["bookings/pendingBookings"]
);

watch(searchText, (newValue, oldValue) => {
  store.commit("bookings/filterBooking", newValue);
});

onMounted(async () => {
  isLoading.value = true;
  try {
    await store.dispatch("bookings/getBookings");
  } catch (error) {}
  isLoading.value = false;
});
</script>

<template>
  <div class="dashboard">
    <v-card>
      <div class="filter-bar">
        <v-text-field
          label="Search email"
          v-model="searchText"
          variant="outlined"
          class="rounded"
          density="compact"
          append-inner-icon="mdi-magnify"
          hide-details
        ></v-text-field>
        <ThemeButton />
      </div>
    </v-card>
    <v-card class="pa-6 recent-prints-container">
      <div v-if="!isLoading">
        <div class="recent-prints">
          <p>Print Jobs</p>
          <div class="print-stats">
            <div class="print-stats--stat">
              <p>Completed</p>
              <span>{{ completedBookings }}</span>
            </div>
            <div class="print-stats--stat">
              <p>Pending</p>
              <span>{{ pendingBookings }}</span>
            </div>
          </div>
        </div>
        <p class="queue">
          Total <span>{{ bookings?.length }}</span> bookings
        </p>
        <RecentPrintsTable :bookings="bookings" />
      </div>
      <v-progress-circular
        v-else
        indeterminate
        style="align-self: center"
      ></v-progress-circular>
    </v-card>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.filter-bar {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.recent-prints-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.queue {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.queue span {
  color: #d1be13;
  font-weight: 800;
  margin-right: 0.1rem;
}

.recent-prints {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.recent-prints > p {
  font-size: 1.5rem;
  font-weight: 600;
  color: #d1be13;
}
.print-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.print-stats--stat {
  display: flex;
  align-items: center;
}

.print-stats div span {
  font-size: 2rem;
  font-weight: 500;
  color: #d1be13;
  margin-left: 0.4rem;
}
</style>
