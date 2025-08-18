<script setup lang="ts">
import type { Transaction, FormMode } from "../types/index";
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

// Convert all user inputs to numbers for consistent calculations
const quantity = computed(() => Number(localTransaction.value.quantity));
const priceBought = computed(() =>
  Number(localTransaction.value.pricePerCoinBought)
);
const priceSold = computed(() =>
  Number(localTransaction.value.pricePerCoinSold)
);
const fees = computed(() => Number(localTransaction.value.fees));

// Обчислюємо totalSpent. Залежить від quantity та priceBought, повинно бути > 0
const totalSpent = computed(() => {
  if (quantity.value > 0 && priceBought.value > 0) {
    return Number((quantity.value * priceBought.value).toFixed(2));
  }
  return null;
});

// Обчислюємо profit. Залежить від totalSpent !== null та priceSold, повинно бути > 0
const profit = computed(() => {
  const convertedFee = Math.max(0, fees.value);

  if (totalSpent.value !== null && priceSold.value > 0) {
    const profitValue =
      priceSold.value * quantity.value - totalSpent.value - convertedFee;
    return Number(profitValue.toFixed(2));
  }
  return null;
});

// Watch для побічного ефекту: оновлюємо поля localTransaction
// Computed-властивості лише для читання, тому використовуємо watch для запису
watch([totalSpent, profit], ([newTotalSpent, newProfit]) => {
  localTransaction.value.totalSpent = newTotalSpent;
  localTransaction.value.profit = newProfit;
});

function editTransaction() {
  console.log(localTransaction.value);
}
</script>

<template>
  <section>
    <div
      class="bg-[var(--bodyColor)] rounded-md px-2 py-3 min-w-[70vw] sm:min-w-[16rem] max-w-[80vw] sm:max-w-lg md:px-4 md:py-6"
    >
      <!--  -->
      <div class="flex justify-between xs:text-sm md:text-base mb-2">
        <h2>{{ header }}</h2>
        <button @click="emit('close')" class="mr-2">X</button>
      </div>

      <!--  -->
      <form
        @submit.prevent="editTransaction"
        class="text-xs grid gap-1 grid-cols-1 xs:grid-cols-2 xs:gap-2 md:text-sm"
      >
        <!--  -->
        <div v-if="mode === 'add'">
          <select v-if="mode === 'add'" v-model="localTransaction.name">
            <option value="ADA">ADA</option>
            <option value="ETH">ETH</option>
            <option value="UNI">UNI</option>
          </select>
        </div>
        <div class="">
          <label for="quantity" class="mb-[2px]">Quantity</label>
          <input
            id="quantity"
            required
            v-model.lazy="localTransaction.quantity"
            class="input-primary border"
            type="number"
            placeholder="$"
            step="any"
            inputmode="decimal"
          />
        </div>
        <div class="">
          <label for="price-per-coin" class="mb-[2px]">Price Per Coin</label>
          <input
            id="price-per-coin"
            required
            v-model.number.lazy="localTransaction.pricePerCoinBought"
            class="input-primary border"
            type="number"
            placeholder="$"
            step="any"
            inputmode="decimal"
          />
        </div>
        <div>
          <label for="date" class="mb-[2px]">Date</label>
          <input
            id="date"
            v-model="localTransaction.date"
            class="input-primary border"
            type="date"
          />
        </div>
        <div>
          <label for="fee" class="mb-[2px]">Fee</label>
          <input
            id="fee"
            placeholder="$"
            v-model.number.lazy="localTransaction.fees"
            class="input-primary border"
            type="number"
          />
        </div>
        <div>
          <label for="sell-price" class="mb-[2px]">Sell Price</label>
          <input
            id="sell-price"
            v-model.number.lazy="localTransaction.pricePerCoinSold"
            placeholder="$"
            class="input-primary border"
            type="number"
          />
        </div>
        <div class="flex gap-1 xs:col-span-2 xs:gap-2">
          <div class="flex-1">
            <p class="mb-[2px]">Total Spent</p>
            <output class="w-full inline-block border input-primary"
              >{{ localTransaction.totalSpent }}$</output
            >
          </div>
          <div class="flex-1">
            <p class="mb-[2px]">Profit</p>
            <output class="w-full inline-block border input-primary">
              {{
                localTransaction.profit !== null
                  ? `${localTransaction.profit}$`
                  : "$"
              }}
            </output>
          </div>
        </div>
        <div class="mt-2 col-span-full form-button">
          <button
            type="submit"
            class="w-full inline-block border input-primary"
          >
            Edit
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.editTransaction {
  /* min-width: 70vw;
  max-width: 31rem; */
  /* background-color: var(--bodyColor); */
  /* padding-block: 0.6rem; */
  /* padding-inline: 0.5rem; */
}

.editTransaction_grid {
  /* font-size: 0.7rem; */
  /* display: grid; */
  /* gap: 0.3rem; */
}

/* form .input-primary {
  padding: 0.2rem;
} */

.form-button button {
  transition: all 0.2s;
}

.form-button button:hover {
  background-color: var(--borderColor);
}
</style>
