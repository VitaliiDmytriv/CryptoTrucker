import { Transaction } from "@/types";
import { useDebounceFn } from "@vueuse/core";
import { ref, watch } from "vue";
import { useTransactionCalculations } from "./useTransactionCalculations";
import { cloneTransaction, cloneTransactionWithDefaults } from "@/helpers/transactionCalculations";

type EditType = "edit" | "split";
const message = "It can't be more or equal";

export function useSplit(transaction: Transaction) {
  const baseQuantity = transaction.quantity as number;
  // зробити два клона, current та split, і у режимі split контролити його через useTransacCalculation,
  // привязати до інпутів, і одразу оновлювати
  const { localTransaction: sourceTransaction } = useTransactionCalculations({
    mode: "edit",
    transaction: cloneTransaction(transaction, true),
  });

  const { localTransaction: targetTransaction } = useTransactionCalculations({
    transaction: cloneTransactionWithDefaults(transaction),
    mode: "edit",
  });

  const editType = ref<EditType>("edit");
  // const curentQuantity = ref(baseQuantity);
  // const splitQuantity = ref<null | number>(null);
  const errorMessage = ref<null | string>(null);
  const canSplit = ref(false);

  const debounsedFnDivision = useDebounceFn(handleInputDivision, 400);

  watch(editType, () => {
    reset();
    targetTransaction.value.quantity = null;
  });

  watch(
    () => targetTransaction.value.quantity,
    (newValue) => debounsedFnDivision(newValue)
  );

  function handleInputDivision(input: number | null) {
    const inputQuantity = Number(input);

    // якщо не число або <= 0
    if (!inputQuantity || inputQuantity <= 0) {
      reset();
      return;
    }

    // якщо більше quantity транзакції
    if (inputQuantity >= baseQuantity) {
      errorMessage.value = `It can't be more or equal ${baseQuantity}`;
      canSplit.value = false;
      return;
    }

    errorMessage.value = null;
    sourceTransaction.value.quantity = baseQuantity - inputQuantity;
    canSplit.value = true;
  }

  function setEditType(type: EditType) {
    editType.value = type;
  }

  function reset() {
    canSplit.value = false;
    sourceTransaction.value.quantity = baseQuantity;
    errorMessage.value = null;
  }

  return {
    sourceTransaction,
    targetTransaction,
    canSplit,
    errorMessage,
    editType,
    setEditType,
  };
}
