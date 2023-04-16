<script setup>
import { ref } from "vue";
import ConfigureServiceTable from "../../components/ConfigureServiceTable.vue";
import { useStore } from "vuex";
import { onMounted } from "vue";
const dialog = ref(false);
const isLoading = ref(false);
const store = useStore();

onMounted(async () => {
  isLoading.value = true;
  try {
    await store.dispatch("services/getServices");
  } catch (error) {
    console.log("ERROR");
  }
  isLoading.value = false;
});

///////////////////////////////////////////////////////////
const paperMaterials = ["Standard", "Glossy", "Bond", "Glossy Cardboard"];
const paperSizes = ["A1", "A2", "A3", "A4", "Legal", "Letter"];
const printTypes = ["Grayscale", "Color"];

const service = ref({
  paperMaterial: "",
  paperSize: "",
  printType: "",
  perPageCost: "",
});

const formRef = ref(null);
const formRules = ref({
  paperMaterial: [(v) => !!v || "paperMaterial is required"],
  paperSize: [(v) => !!v || "paperSize is required"],
  printType: [(v) => !!v || "printType is required"],
  perPageCost: [(v) => !!v || "perPageCost is required"],
});
const isAddServiceLoading = ref(false);

async function addServices() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  isAddServiceLoading.value = true;

  const serviceData = { ...service.value };
  try {
    await store.dispatch("services/addService", serviceData);
  } catch (error) {}
  isAddServiceLoading.value = false;
  toggleDialog();
}
//////////////////////////////////////////////////////

const toggleDialog = () => {
  dialog.value = !dialog.value;
};
</script>

<template>
  <v-card class="d-flex flex-column">
    <div class="configuration" v-if="!isLoading">
      <div class="d-flex justify-space-between">
        <p>Configure Services</p>
        <v-btn color="#fde616" @click="toggleDialog">Add service</v-btn>
      </div>
      <ConfigureServiceTable />
    </div>
    <v-progress-circular
      v-else
      indeterminate
      style="align-self: center"
    ></v-progress-circular>
  </v-card>

  <v-dialog v-model="dialog" width="auto">
    <v-card>
      <v-form @submit.prevent="addServices" class="form pa-3" ref="formRef">
        <v-container>
          <p class="addService mb-8">Add Service</p>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="service.paperMaterial"
                :items="paperMaterials"
                variant="outlined"
                label="Paper Material"
                placeholder="Paper Material"
                :rules="formRules.paperMaterial"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="service.paperSize"
                :items="paperSizes"
                variant="outlined"
                label="Paper Size"
                :rules="formRules.paperSize"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="service.printType"
                :items="printTypes"
                variant="outlined"
                label="Print Type"
                :rules="formRules.printType"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="service.perPageCost"
                variant="outlined"
                label="Per Page Cost"
                :rules="formRules.perPageCost"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn
                type="submit"
                color="#d1be13"
                :loading="isAddServiceLoading"
                :disabled="isAddServiceLoading"
                >Add Service</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.configuration {
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
}
.configuration p {
  font-size: 1.5rem;
  font-weight: 600;
  color: #d1be13;
}
.addService {
  font-size: 1.5rem;
  font-weight: 600;
  color: #d1be13;
}

.form {
  width: 40rem;
}
</style>
