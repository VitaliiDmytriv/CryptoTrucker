<script setup lang="ts">
import type { CoinGecko, TransactionFormProps } from "../types/index";
import { computed, defineEmits, ref, toRefs } from "vue";
import SubmitStatus from "@/components/SubmitStatus.vue";
import CoinSelect from "@/components/CoinSelect.vue";
import { X, Trash } from "lucide-vue-next";
import ConfirmModal from "@/components/ConfirmModal.vue";
import { useTransactionForm } from "@/composables/useTransactionForm";

const emit = defineEmits<{
  (event: "close"): void;
}>();

const props = defineProps<TransactionFormProps>();

const { localTransaction, ...formService } = useTransactionForm(props, emit);
</script>

<template>
  <section class="relative max-h-full h-96">
    <SubmitStatus
      :submit-error="formService.submitError.value"
      :submit-loading="formService.submitLoading.value"
      :submit-success="formService.submitSuccess.value"
    />

    <ConfirmModal
      v-if="formService.isConfirmModalOpen.value"
      @closeModal="formService.closeConfirmModal"
      @handleAction="formService.handleDelete"
    />
    <div
      class="bg-[var(--bodyColor)] rounded-md px-2 py-3 min-w-[70vw] sm:min-w-[16rem] max-w-[80vw] sm:max-w-lg md:px-4 md:py-6"
    >
      <!--  -->
      <div class="flex justify-between xs:text-sm md:text-base mb-2">
        <h2>{{ formService.headerTxt }}</h2>
        <button @click="emit('close')" class="mr-2">
          <X :size="20" :stroke-width="1.5" />
        </button>
      </div>

      <form
        @submit.prevent="formService.handleSubmit"
        class="text-xs grid gap-1 grid-cols-1 xs:grid-cols-2 xs:gap-2 md:text-sm"
      >
        <!-- <div v-if="mode === 'add'"> -->
        <div v-if="props.mode === 'add'" class="col-span-2">
          <CoinSelect
            @handleSelect="formService.selectNewCoin"
            :transaction="localTransaction"
          />
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
          <div class="flex gap-2">
            <button
              :disabled="formService.isSubmitDisabled.value"
              type="submit"
              class="w-full inline-block border input-primary"
            >
              {{ formService.buttonTxt }}
            </button>
            <div
              v-if="props.mode === 'edit'"
              class="flex justify-center items-center"
            >
              <button @click.prevent="formService.openConfirmModal">
                <Trash :size="20" :stroke-width="1.5" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.form-button button {
  transition: all 0.2s;
}

.form-button button[type="submit"]:hover {
  background-color: var(--borderColor);
}
</style>
