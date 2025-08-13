<script setup>
import { useRoute } from "vue-router";
import { computed, watch } from "vue";

const route = useRoute();
const coin = computed(() => route.params.coin);
</script>

<template>
  <section
    class="transactionLsit mainBorder py-0 flex-1"
    :class="{ emptyList: !coin }"
  >
    <div class="transactionLsit_tooltip" v-if="!coin">Chose coin</div>
    <router-view />
  </section>
</template>

<style scoped>
.transactionLsit {
  position: relative;
}

.transactionLsit_tooltip {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
}

.emptyList {
  display: flex;
  justify-content: center;
  /* padding: 1rem; */
}
</style>
