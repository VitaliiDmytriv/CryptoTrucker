import { useTransactionCalculations } from "@/composables/useTransactionCalculations";
import { ref, computed, Ref } from "vue";
import { useTransaction } from "@/composables/useTransactions";
import type {
  CoinGecko,
  TransactionFormProps,
  Transaction,
} from "../types/index";

const LABELS = {
  edit: { header: "Edit Transaction", button: "Edit" },
  add: { header: "Add Transaction", button: "Add transaction" },
  merge: { header: "Merge Transactions", button: "Merge" },
};

export function useTransactionForm(
  props: TransactionFormProps,
  emit: (e: "close", afterSuccses?: boolean) => void
) {
  const isConfirmModalOpen = ref(false);

  const { localTransaction } = useTransactionCalculations(props);
  const {
    success: submitSuccess,
    loading: submitLoading,
    error: submitError,
    ...transactionService
  } = useTransaction();

  const isSubmitDisabled = computed(() => {
    const tx = localTransaction.value;
    switch (props.mode) {
      case "edit":
        return areTransactionsEqual(tx, props.transaction);
      case "add":
        return !tx.name;
      default:
        return false;
    }
  });
  const headerTxt = computed(() => LABELS[props.mode].header);
  const buttonTxt = computed(() => LABELS[props.mode].button);

  const submitHandlesr: Record<string, () => Promise<void>> = {
    edit: () => transactionService.updateTransaction(localTransaction.value),
    add: () => transactionService.addTransaction(localTransaction.value),
    merge: () =>
      transactionService.mergeTransactions(
        localTransaction.value,
        props.mergeSet || new Set()
      ),
  };

  async function handleSubmit() {
    if (props.mode === "add" && !localTransaction.value.name) return;
    await submitHandlesr[props.mode]?.();

    runAfterSuccess(submitSuccess, onSuccsess);
  }

  function selectNewCoin(coin: CoinGecko) {
    localTransaction.value.pricePerCoinBought = coin.current_price;
    localTransaction.value.image = coin.image;
    localTransaction.value.symbol = coin.symbol.toUpperCase();
    localTransaction.value.name = coin.name;
  }

  function openConfirmModal() {
    isConfirmModalOpen.value = true;
  }
  function closeConfirmModal() {
    isConfirmModalOpen.value = false;
  }

  async function handleDelete() {
    closeConfirmModal();
    await transactionService.removeTransaction(
      localTransaction.value.id,
      localTransaction.value.symbol
    );

    runAfterSuccess(submitSuccess, onSuccsess);
  }

  //   Help functions /////////////////

  function onSuccsess() {
    transactionService.resetSuccess();
    emit("close", true);
  }

  function runAfterSuccess(condition: Ref<boolean>, callback: () => void) {
    if (condition.value) {
      setTimeout(() => callback(), 1300);
    }
  }

  function areTransactionsEqual(a: Transaction, b: Transaction) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  return {
    localTransaction,
    closeConfirmModal,
    selectNewCoin,
    handleSubmit,
    openConfirmModal,
    handleDelete,
    headerTxt,
    buttonTxt,
    isSubmitDisabled,
    submitSuccess,
    submitLoading,
    submitError,
    isConfirmModalOpen,
  };
}
