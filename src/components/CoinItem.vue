<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    image: string;
    name: string;
    symbol: string;
    isBold?: boolean;
  }>(),
  {
    expandName: false,
    isBold: false,
  }
);
</script>

<template>
  <div class="flex gap-1 sm:gap-2 items-center cursor-pointer">
    <div class="crypto_icon">
      <img :src="image" alt="" />
    </div>
    <div class="flex-1">
      <p class="mr-2 truncate coin-select_item-name">
        <b v-if="isBold">{{ name }}</b>
        <span v-else>{{ name }}</span>
      </p>
    </div>
    <p class="coin-select_item-symbol uppercase truncate text-[#808a9d] shrink-0 mr-3">
      {{ symbol }}
    </p>
  </div>
</template>

<style scoped>
.coin-select {
  position: relative;
}

p {
  @apply text-xs sm:text-sm;
}

.coin-select_item-name {
  @apply max-w-[5.625rem] xs:max-w-[9.375rem] sm:max-w-[13rem] md:max-w-[18rem];
}

.coin-select_item-symbol {
  @apply max-w-[3.125rem] md:max-w-[6.25rem];
}
</style>
