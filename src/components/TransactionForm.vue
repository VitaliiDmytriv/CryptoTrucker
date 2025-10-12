<script setup lang="ts">
import type { CoinGecko, TransactionFormProps } from "../types/index";
import { computed, defineEmits, ref, toRefs } from "vue";
import SubmitStatus from "@/components/SubmitStatus.vue";
import CoinSelect from "@/components/CoinSelect.vue";
import { X, Trash } from "lucide-vue-next";
import ConfirmModal from "@/components/ConfirmModal.vue";
import { useTransactionForm } from "@/composables/useTransactionForm";
import { formatter } from "@/helpers/helpFunctions";
import { rules, submitForm } from "@/helpers/formValidation";
import { FormInstance } from "element-plus";

const emit = defineEmits<{
  (event: "close", afterSuccses?: boolean): void;
}>();
const props = defineProps<TransactionFormProps>();
const formRef = ref<FormInstance>();
const { localTransaction, ...formService } = useTransactionForm(props, emit);
</script>

<template>
  <section class="bg-[var(--bodyColor)] p-3 relative" v-if="true">
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
    <div class="flex items-center mb-2">
      <p class="flex-1">{{ formService.headerTxt }}</p>
      <el-button @click="emit('close')" class="close-button">
        <X :size="20" :stroke-width="1.5" />
      </el-button>
    </div>
    <div v-if="props.mode === 'edit'" class="togleContainer mb-2">
      <div :class="{ right: formService.editType.value === 'split' }" class="togleHighlight"></div>
      <span @click="formService.setEditType('edit')" class="togleItem">Edit</span>
      <span @click="formService.setEditType('split')" class="togleItem">Split</span>
    </div>

    <el-form
      :hide-required-asterisk="true"
      :rules="rules"
      :model="localTransaction"
      label-position="top"
      ref="formRef"
    >
      <el-form-item prop="quantity" label="Quantity">
        <el-input v-model.number="localTransaction.quantity" type="number" name="quantity" />
      </el-form-item>

      <el-form-item prop="pricePerCoinBought" label="Price Per Coin">
        <el-input
          v-model.number="localTransaction.pricePerCoinBought"
          type="number"
          name="pricePerCoinBought"
        />
      </el-form-item>

      <el-form-item prop="date" label="Date">
        <el-input v-model.number="localTransaction.date" type="date" />
      </el-form-item>

      <el-form-item prop="fees" label="Fee">
        <el-input v-model.number="localTransaction.fees" type="number" name="fees" />
      </el-form-item>

      <el-form-item prop="pricePerCoinSold" label="Sell Price">
        <el-input
          v-model.number="localTransaction.pricePerCoinSold"
          type="number"
          name="pricePerCoinSold"
        />
      </el-form-item>

      <div class="no-focus xs:col-span-2 flex xs:gap-2 gap-1">
        <el-form-item label="Total Spent">
          <el-input :value="`${localTransaction.totalSpent || ''}$`" readonly />
        </el-form-item>
        <el-form-item label="Profit">
          <el-input
            :class="{
              'profit-minus': (localTransaction.profit || 0) < 0,
              'profit-plus': (localTransaction.profit || 0) > 0,
            }"
            :value="`${localTransaction.profit || ''}$`"
            readonly
          />
        </el-form-item>
      </div>

      <div class="xs:col-span-2 flex xs:gap-2 gap-1 items-center">
        <el-button
          :disabled="formService.isSubmitDisabled.value"
          @click="submitForm(formRef, formService.handleSubmit)"
          class="flex-1"
        >
          {{ formService.buttonTxt }}
        </el-button>
        <el-button class="group" type="danger" @click="formService.openConfirmModal">
          <Trash
            :size="20"
            :stroke-width="1.2"
            class="text-[var(--el-color-danger)] group-hover:text-[var(--el-color-white)]"
          />
        </el-button>
      </div>
    </el-form>
  </section>

  <section v-else class="relative max-h-full">
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
    <div class="transaction_form">
      <div class="flex justify-between xs:text-sm md:text-base mb-2">
        <h2>{{ formService.headerTxt }}</h2>
        <button @click="emit('close')" class="mr-2">
          <X :size="20" :stroke-width="1.5" />
        </button>
      </div>
      <div v-if="props.mode === 'edit'" class="col-span-full">
        <div class="togleContainer">
          <div
            :class="{ right: formService.editType.value === 'split' }"
            class="togleHighlight"
          ></div>
          <span @click="formService.setEditType('edit')" class="togleItem">Edit</span>
          <span @click="formService.setEditType('split')" class="togleItem">Split</span>
        </div>
      </div>
      <div v-if="props.mode === 'add'" class="col-span-2">
        <CoinSelect @handleSelect="formService.selectNewCoin" :transaction="localTransaction" />
      </div>
      <form @submit.prevent="formService.handleSubmit" class="">
        <!-- <div v-if="mode === 'add'"> -->

        <template v-if="formService.editType.value === 'edit'">
          <div>
            <label for="quantity">Quantity</label>
            <input
              id="quantity"
              required
              v-model.lazy="localTransaction.quantity"
              class="input-primary border"
              type="number"
              placeholder="$"
              step="any"
              inputmode="decimal"
              :readonly="props.mode === 'merge'"
            />
          </div>
          <div>
            <label for="price-per-coin">Price Per Coin </label>
            <input
              id="price-per-coin"
              required
              v-model.number.lazy="localTransaction.pricePerCoinBought"
              class="input-primary border"
              type="number"
              placeholder="$"
              step="any"
              inputmode="decimal"
              :readonly="props.mode === 'merge'"
            />
          </div>

          <div>
            <label for="date">Date</label>
            <input
              id="date"
              v-model="localTransaction.date"
              class="input-primary border"
              type="date"
            />
          </div>
          <div>
            <label for="fee">Fee</label>
            <input
              id="fee"
              placeholder="$"
              v-model.number.lazy="localTransaction.fees"
              class="input-primary border"
              type="number"
              step="any"
              inputmode="decimal"
            />
          </div>
          <div>
            <label for="sell-price">Sell Price</label>
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
              <p>Total Spent</p>
              <output class="w-full inline-block border input-primary"
                >{{ localTransaction.totalSpent }}$</output
              >
            </div>
            <div class="flex-1">
              <p>Profit</p>
              <output class="w-full inline-block border input-primary">
                {{ localTransaction.profit }}$
              </output>
            </div>
          </div>
        </template>
        <template v-else>
          <div>
            <label for="quantity">1-st (Current)</label>
            <input
              id="quantity"
              :value="formatter.format(formService.split.sourceTransaction.value.quantity ?? 0)"
              class="input-primary border"
              type="number"
              placeholder="$"
              step="any"
              inputmode="decimal"
              :readonly="true"
            />
          </div>

          <div class="relative">
            <label for="quantity">2-nd </label>
            <input
              id="quantity"
              required
              v-model="formService.split.targetTransaction.value.quantity"
              class="input-primary border"
              type="number"
              placeholder="Write quantity"
              step="any"
              inputmode="decimal"
            />
            <div
              class="absolute text-[.625rem] text-red-400"
              v-if="formService.split.errorMessage.value"
            >
              {{ formService.split.errorMessage.value }}
            </div>
          </div>
          <div class="row-start-2">
            <p>Total Spent</p>
            <output class="w-full inline-block border input-primary"
              >{{ formService.split.sourceTransaction.value.totalSpent }}$</output
            >
          </div>
          <div class="">
            <p>Total Spent</p>
            <output class="w-full inline-block border input-primary"
              >{{ formService.split.targetTransaction.value.totalSpent }}$</output
            >
          </div>
          <div class="xs:col-start-2">
            <label for="sell-price">Sell Price</label>
            <input
              id="sell-price"
              v-model.number="formService.split.targetTransaction.value.pricePerCoinSold"
              placeholder="$"
              class="input-primary border"
              type="number"
              step="any"
              inputmode="decimal"
            />
          </div>
          <div class="xs:col-start-2">
            <p>Profit</p>
            <output class="w-full inline-block border input-primary">
              {{ formService.split.targetTransaction.value.profit }}$
            </output>
          </div>
        </template>
        <div class="mt-2 col-span-full [grid-row-end:-1] form-button">
          <div class="flex gap-2">
            <button
              :disabled="formService.isSubmitDisabled.value"
              type="submit"
              class="w-full inline-block border input-primary"
            >
              {{ formService.buttonTxt }}
            </button>
            <div v-if="props.mode === 'edit'" class="flex justify-center items-center">
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
form {
  @apply text-xs grid gap-1 grid-cols-1 [grid-template-rows:repeat(7,minmax(0,1fr))] mt-1;
  @apply xs:grid-rows-5 xs:grid-cols-2 xs:gap-2 md:text-sm;
  margin-top: 0px !important;
}

.el-form-item {
  margin-bottom: 0.25rem;
}

:deep(.close-button) {
  padding: 0rem 0.5rem;
}

:deep(.el-form-item__label) {
  margin-bottom: 0.15rem !important;
}

:deep(.no-focus .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}

:deep(.no-focus .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}

:deep(.el-button + .el-button) {
  margin-left: 0;
}

:deep(.profit-minus .el-input__inner) {
  color: var(--el-color-danger);
}
:deep(.profit-plus .el-input__inner) {
  color: var(--el-color-success);
}

.togleContainer {
  font-size: 0.75rem;
  background-color: var(--coinBlockBgActive);
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  color: var(--el-text-color-regular);
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  padding: 1px;
  display: flex;
  text-align: center;
  cursor: pointer;
  position: relative;
  @apply md:text-sm;
}

.togleItem {
  flex: 1;
  border-radius: var(--el-input-border-radius) var(--el-border-radius-base);
  transition: background-color 0.3s ease;
  z-index: 1;
}

.togleHighlight {
  position: absolute;
  height: calc(100% - 2px);
  width: 50%;
  background-color: var(--bodyColor);
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  top: 1px;
  left: 1px;
  transition: transform 0.3s ease;
  transform: translateX(0%);
}

.togleHighlight.right {
  transform: translateX(calc(100% - 2px));
}
</style>

<!-- <style scoped>
.transaction_form {
  background-color: var(--bodyColor);
  @apply rounded-md px-2 py-3 w-[70vw];
  @apply md:px-4 md:py-6 md:max-w-lg;
}

form {
  @apply text-xs grid gap-1 grid-cols-1 [grid-template-rows:repeat(7,minmax(0,1fr))] mt-1;
  @apply xs:grid-rows-5 xs:grid-cols-2 xs:gap-2 md:text-sm;
}

label {
  display: block;
  /* min-width: 100px; */
}

.form-button button {
  transition: all 0.2s;
}

.form-button button[type="submit"]:hover {
  background-color: var(--borderColor);
}

.togleContainer {
  font-size: 0.75rem;
  background-color: var(--coinBlockBgActive);
  border-radius: 0.375rem;
  padding: 1px;
  display: flex;
  text-align: center;
  cursor: pointer;
  position: relative;
  @apply md:text-sm;
}

.togleItem {
  flex: 1;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease;
  z-index: 1;
}

.togleHighlight {
  position: absolute;
  height: calc(100% - 2px);
  width: 50%;
  background-color: var(--bodyColor);
  border-radius: 0.375rem;
  top: 1px;
  left: 1px;
  transition: transform 0.3s ease;
  transform: translateX(0%);
}

.togleHighlight.right {
  transform: translateX(99%);
}
</style> -->
