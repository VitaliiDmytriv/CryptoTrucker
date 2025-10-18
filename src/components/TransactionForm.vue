<script setup lang="ts">
import type { CoinGecko, TransactionFormProps } from "../types/index";
import { computed, defineEmits, ref, toRefs } from "vue";
import SubmitStatus from "@/components/SubmitStatus.vue";
import CoinSelect from "@/components/CoinSelect.vue";
import { Trash } from "lucide-vue-next";
import { useTransactionForm } from "@/composables/useTransactionForm";
import { mainFormRules, getSplitFormRules, submitForm } from "@/helpers/formValidation";
import { FormInstance } from "element-plus";
import { handleDeleteTransaction } from "@/helpers/helpFunctions";

const emit = defineEmits<{
  (event: "close", afterSuccses?: boolean): void;
}>();
const props = defineProps<TransactionFormProps>();
const formRef = ref<FormInstance>();
const { localTransaction, ...formService } = useTransactionForm(props, emit);

const rules = computed(() =>
  formService.editType.value === "edit"
    ? mainFormRules
    : getSplitFormRules(localTransaction.value.quantity)
);
const transaction = computed(() =>
  formService.editType.value === "edit"
    ? localTransaction.value
    : formService.split.targetTransaction.value
);
</script>

<template>
  <template class="relative" v-if="true">
    <el-dialog
      class="relative max-w-lg"
      width="80%"
      :title="formService.headerTxt.value"
      v-model="props.dialogVisible"
      @close="emit('close')"
      :align-center="true"
    >
      <SubmitStatus
        :submit-error="formService.submitError.value"
        :submit-loading="formService.submitLoading.value"
        :submit-success="formService.submitSuccess.value"
      />

      <div v-if="props.mode === 'edit'" class="togleContainer mb-2">
        <div
          :class="{ right: formService.editType.value === 'split' }"
          class="togleHighlight"
        ></div>
        <span @click="formService.setEditType('edit')" class="togleItem">Edit</span>
        <span @click="formService.setEditType('split')" class="togleItem">Split</span>
      </div>

      <el-form
        :hide-required-asterisk="true"
        :rules="rules"
        :model="transaction"
        label-position="top"
        ref="formRef"
      >
        <el-form-item class="xs:col-span-2" v-if="props.mode === 'add'" label="Select coin">
          <CoinSelect @handleSelect="formService.selectNewCoin" :transaction="localTransaction" />
        </el-form-item>

        <template v-if="formService.editType.value === 'edit'">
          <el-form-item prop="quantity" label="Quantity">
            <el-input v-model="localTransaction.quantity" type="number" name="quantity" />
          </el-form-item>

          <el-form-item prop="pricePerCoinBought" label="Price Per Coin">
            <el-input
              v-model="localTransaction.pricePerCoinBought"
              type="number"
              name="pricePerCoinBought"
            />
          </el-form-item>

          <el-form-item prop="date" label="Date">
            <el-input v-model="localTransaction.date" type="date" />
          </el-form-item>

          <el-form-item prop="fees" label="Fee">
            <el-input v-model="localTransaction.fees" type="number" name="fees" />
          </el-form-item>

          <el-form-item prop="pricePerCoinSold" label="Sell Price">
            <el-input
              v-model="localTransaction.pricePerCoinSold"
              type="number"
              name="pricePerCoinSold"
            />
          </el-form-item>

          <div class="no-focus xs:col-span-2 flex xs:gap-2 gap-1">
            <el-form-item class="flex-1" label="Total Spent">
              <el-input :value="`${localTransaction.totalSpent || ''}$`" readonly />
            </el-form-item>
            <el-form-item class="flex-1" label="Profit">
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
        </template>

        <template v-else>
          <el-form-item class="no-focus" label="1-st (Current)">
            <el-input
              type="number"
              :value="formService.split.sourceTransaction.value.quantity"
              readonly
            />
          </el-form-item>

          <el-form-item label="2-nd" prop="quantity">
            <el-input
              type="number"
              name="quantity"
              v-model="formService.split.targetTransaction.value.quantity"
            />
          </el-form-item>

          <div class="row-start-2">
            <el-form-item class="no-focus" label="Total Spent">
              <el-input
                :value="`${formService.split.sourceTransaction.value.totalSpent}$`"
                readonly
              />
            </el-form-item>
          </div>
          <el-form-item class="no-focus" label="Total Spent">
            <el-input
              :value="`${formService.split.targetTransaction.value.totalSpent || ''}$`"
              readonly
            />
          </el-form-item>

          <div class="xs:col-start-2">
            <el-form-item label="Sell Price">
              <el-input
                placeholder="$"
                type="number"
                v-model="formService.split.targetTransaction.value.pricePerCoinSold"
              />
            </el-form-item>
          </div>
          <div class="xs:col-start-2">
            <el-form-item class="flex-1" label="Profit">
              <el-input
                :class="{
                  'profit-minus': (formService.split.targetTransaction.value.profit || 0) < 0,
                  'profit-plus': (formService.split.targetTransaction.value.profit || 0) > 0,
                }"
                :value="`${formService.split.targetTransaction.value.profit || ''}$`"
                readonly
              />
            </el-form-item>
          </div>
        </template>

        <div class="xs:col-span-2 flex xs:gap-2 gap-1 items-center">
          <el-button
            :disabled="formService.isSubmitDisabled.value"
            @click="submitForm(formRef, formService.handleSubmit)"
            class="flex-1"
          >
            {{ formService.buttonTxt }}
          </el-button>
          <el-button
            v-if="props.mode !== 'add'"
            plain
            class="group"
            type="danger"
            @click="() => handleDeleteTransaction(formService.handleDelete)"
          >
            <Trash
              :size="20"
              :stroke-width="1.2"
              class="text-[var(--el-color-danger)] group-hover:text-[var(--el-color-white)]"
            />
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </template>
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

:deep(.my-danger-btn) {
  background-color: red !important; /* або $danger-color */
  color: white !important;
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
