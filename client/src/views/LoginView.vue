<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { computed } from "@vue/reactivity";
import { useRouter } from "vue-router";
import Logo from "../components/Logo.vue";
import ThemeButton from "../components/ThemeButton.vue";

const store = useStore();
const router = useRouter();

const showPassword = ref(false);
const formData = ref({ email: "", password: "" });
const formRef = ref(null);
const formRules = ref({
  email: [(v) => !!v || "Email is required"],
  password: [(v) => !!v || "Password is required"],
});

///////////////////////////////////////
const isLoggedIn = computed(() => store.getters["user/isLoggedIn"]);
if (isLoggedIn.value) {
  router.push("/home");
}
watch(isLoggedIn, (currentValue) => {
  if (currentValue) {
    router.push("/home");
  }
});
///////////////////////////////////////

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const submitHandler = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  store.dispatch("user/login", {
    email: formData.value.email,
    password: formData.value.password,
  });
};
</script>

<template>
  <div class="container">
    <div style="position: absolute; top: 0; right: 0">
      <ThemeButton />
    </div>
    <v-form class="form" @submit.prevent="submitHandler" ref="formRef">
      <Logo />
      <h1 class="heading">Sign in</h1>
      <div class="input-container">
        <v-text-field
          label="Email"
          type="email"
          v-model="formData.email"
          variant="outlined"
          class="rounded"
          :rules="formRules.email"
          hide-details
        ></v-text-field>
        <v-text-field
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          v-model="formData.password"
          variant="outlined"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="toggleShowPassword"
          class="rounded"
          :rules="formRules.password"
          hide-details
        ></v-text-field>
        <v-btn block type="submit" class="btn text-black">Sign In</v-btn>
      </div>
    </v-form>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.heading {
  font-size: 1.5rem;
  letter-spacing: 0.5px;
  text-align: center;
  margin-bottom: 3rem;
  margin-top: 2rem;
}

.btn {
  background-color: #fde616;
  border: 1px solid #000;
  height: 3rem !important;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.input-container {
  width: 20rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
