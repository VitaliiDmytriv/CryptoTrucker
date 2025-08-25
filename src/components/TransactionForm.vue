<script setup lang="ts">
import type { Transaction, FormMode, CoinsCacheStore } from "../types/index";
import { computed, defineEmits, ref, toRaw, watch } from "vue";
import { useTransactionCalculations } from "../composables/useTransactionCalculations";
import { useTransactions } from "../composables/useTransactions";

const emit = defineEmits<{
  (event: "close"): void;
}>();

const props = defineProps<{
  transaction: Transaction;
  mode: FormMode;
}>();

const { localTransaction } = useTransactionCalculations(props.transaction);
const {
  updateTransaction,
  success: submitSuccess,
  loading: submitLoading,
  error: submitError,
  resetSuccess,
} = useTransactions();

const header = computed(() => {
  return props.mode === "edit" ? "Edit Transaction" : "Add Transaction";
});

async function handleSubmit() {
  await updateTransaction(
    localTransaction.value.name,
    localTransaction.value.id,
    localTransaction.value
  );
  if (submitSuccess) {
    setTimeout(resetSuccess, 1000);
    // emit("close");
  }
}
</script>

<template>
  <section class="relative">
    <div
      v-if="submitLoading || submitError || submitSuccess"
      class="absolute left-0 top-0 right-0 bottom-0 bg-[var(--opacityColor)] flex justify-center items-center"
    >
      <div v-if="submitLoading">
        <div
          class="w-6 h-6 border-2 border-black border-dashed rounded-full animate-spin"
        ></div>
      </div>
      <div v-else-if="submitError">
        <object data="" type="">
          {{ submitError }}
        </object>
      </div>
      <div v-else-if="submitSuccess">Transaction edited</div>
    </div>
    <div
      class="bg-[var(--bodyColor)] rounded-md px-2 py-3 min-w-[70vw] sm:min-w-[16rem] max-w-[80vw] sm:max-w-lg md:px-4 md:py-6"
    >
      <!--  -->
      <div class="flex justify-between xs:text-sm md:text-base mb-2">
        <h2>{{ header }}</h2>
        <button @click="emit('close')" class="mr-2">X</button>
      </div>

      <form
        @submit.prevent="handleSubmit"
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
            step="any"
            inputmode="decimal"
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
.form-button button {
  transition: all 0.2s;
}

.form-button button:hover {
  background-color: var(--borderColor);
}
</style>
