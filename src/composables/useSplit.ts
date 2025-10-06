import { Transaction } from "@/types";
import { useDebounceFn } from "@vueuse/core";
import { ref, watch } from "vue";

type EditType = "edit" | "split";
const message = "It can't be more or equal";

export function useSplit(transaction: Transaction) {
  const editType = ref<EditType>("edit");
  const transactionQuantity = transaction.quantity as number;

  const curentQuantity = ref(transactionQuantity);
  const splitQuantity = ref<null | number>(null);
  const errorMessage = ref<null | string>(null);
  const canSplit = ref(false);

  const debounsedFnDivision = useDebounceFn(handleInputDivision, 400);

  watch(editType, () => {
    reset();
    splitQuantity.value = null;
  });

  watch(splitQuantity, (newValue) => debounsedFnDivision(newValue));

  function handleInputDivision(input: number | null) {
    const inputQuantity = Number(input);

    // якщо не число або <= 0
    if (!inputQuantity || inputQuantity <= 0) {
      reset();
      return;
    }

    // якщо більше quantity транзакції
    if (inputQuantity >= transactionQuantity) {
      errorMessage.value = `It can't be more or equal ${transactionQuantity}`;
      canSplit.value = false;
      return;
    }

    errorMessage.value = null;
    curentQuantity.value = transactionQuantity - inputQuantity;
    canSplit.value = true;
  }

  function setEditType(type: EditType) {
    editType.value = type;
  }

  function reset() {
    canSplit.value = false;
    curentQuantity.value = transactionQuantity;
    errorMessage.value = null;
  }

  return {
    canSplit,
    errorMessage,
    editType,
    setEditType,
    curentQuantity,
    splitQuantity,
  };
}
