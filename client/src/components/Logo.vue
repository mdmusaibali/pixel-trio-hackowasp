<script setup>
import icon from "./../assets/icon.png";
</script>

<template>
  <div class="imageAndText">
    <img :src="icon" class="logo" />
    <p class="xerogo">xero<span>GO</span></p>
  </div>
</template>

<style scoped>
.imageAndText {
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin-bottom: 3rem; */
  gap: 0.4rem;
  /* transform: scale(1.2); */
}

.logo {
  height: 3rem;
}
.xerogo {
  font-weight: 600;
  font-size: 1.5rem;
}

.xerogo span {
  -webkit-text-stroke: 0.53px rgb(0, 0, 0);
  color: #fde616;
}
</style>
