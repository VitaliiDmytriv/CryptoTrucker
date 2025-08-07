<script setup lang="ts">
import { Transaction, FormMode } from "@/types";
import { comma } from "postcss/lib/list";
import { computed, defineEmits, ref, toRaw, watch } from "vue";

const emit = defineEmits<{
  (event: "close"): void;
}>();

const props = defineProps<{
  transaction: Transaction;
  mode: FormMode;
}>();

const localTransaction = ref<Transaction>(
  structuredClone(toRaw(props.transaction))
);

const header = computed(() => {
  return props.mode === "edit" ? "Edit Transaction" : "Add Transaction";
});
const formattedProfit = computed(() =>
  localTransaction.value.profit === null
    ? "$"
    : `${localTransaction.value.profit}$`
);

watch(
  [
    () => localTransaction.value.quantity,
    () => localTransaction.value.pricePerCoinBought,
    () => localTransaction.value.pricePerCoinSold,
    () => localTransaction.value.fees,
  ],
  ([quantity, priceBought, priceSold, fee]) => {
    if (!quantity && !priceBought && !priceSold) return;

    const profit = priceSold * quantity - quantity * priceBought - fee;

    localTransaction.value.profit = Number(profit.toFixed(2));

    console.log(localTransaction.value);
  }
);
</script>

<template>
  <section>
    <div class="editTransaction border">
      <!--  -->
      <div class="flex justify-between">
        <h2>{{ header }}</h2>
        <button @click="emit('close')" class="mr-2">X</button>
      </div>
      <!--  -->
      <select v-if="mode === 'add'" v-model="localTransaction.name">
        <option value="ADA">ADA</option>
        <option value="ETH">ETH</option>
        <option value="UNI">UNI</option>
      </select>
      <!--  -->
      <div class="editTransaction_grid">
        <div class="">
          <p class="mb-[2px]">Quantity</p>
          <input
            required
            v-model.number.lazy="localTransaction.quantity"
            class="inputMain border"
            type="number"
          />
        </div>
        <div class="">
          <p class="mb-[2px]">Price Per Coin</p>
          <input
            required
            v-model.number.lazy="localTransaction.pricePerCoinBought"
            class="inputMain border"
            type="number"
            placeholder="$"
          />
        </div>
        <div>
          <p class="mb-[2px]">Date</p>
          <input
            v-model="localTransaction.date"
            class="inputMain border"
            type="date"
          />
        </div>
        <div>
          <p class="mb-[2px]">Fee</p>
          <input
            placeholder="$"
            v-model.number.lazy="localTransaction.fees"
            class="inputMain border"
            type="number"
          />
        </div>
        <div>
          <p class="mb-[2px]">Sell Price</p>
          <input
            v-model.number.lazy="localTransaction.pricePerCoinSold"
            placeholder="$"
            class="inputMain border"
            type="number"
          />
        </div>
        <div class="grid_Stats flex gap-2">
          <div class="flex-1">
            <p class="mb-[2px]">Total Spent</p>
            <span class="w-full inline-block border inputMain"
              >{{ localTransaction.totalSpent }}$</span
            >
          </div>
          <div class="grid_Profit flex-1">
            <p class="mb-[2px]">Profit</p>
            <span class="w-full inline-block border inputMain">{{
              formattedProfit
            }}</span>
          </div>
        </div>
        <div class="grid_Button mt-2">
          <button class="w-full inline-block border inputMain">Edit</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.editTransaction {
  min-width: 70vw;
  max-width: 31rem;
  display: flex;
  flex-direction: column;
  background-color: var(--bodyColor);
  padding-block: 0.6rem;
  gap: 0.5rem;
  padding-inline: 0.5rem;
}

.editTransaction_grid {
  font-size: 0.7rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.3rem;
}

.editTransaction_grid .inputMain {
  padding: 0.2rem;
}

.grid_Button button {
  transition: all 0.2s;
}

.grid_Button button:hover {
  background-color: var(--borderColor);
}

@media (min-width: 680px) {
  .editTransaction {
    font-size: 1rem;
    min-width: 31rem;
    padding-inline: 1rem;
    padding-block: 1.5rem;
  }

  .editTransaction_grid {
    font-size: 0.9rem;
  }
}
@media (min-width: 350px) {
  .editTransaction_grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  .grid_Stats {
    grid-row: 4;
    grid-column: 1/3;
  }

  .grid_Button {
    grid-column: 1/3;
  }
}
</style>
