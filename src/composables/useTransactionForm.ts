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
};

export function useTransactionForm(
  props: TransactionFormProps,
  emit: (e: "close") => void
) {
  const { localTransaction } = useTransactionCalculations(props);

  const isConfirmModalOpen = ref(false);

  const {
    success: submitSuccess,
    loading: submitLoading,
    error: submitError,
    ...transactionService
  } = useTransaction();

  const isSubmitDisabled = computed(() => {
    if (props.mode === "edit") {
      return areTransactionsEqual(localTransaction.value, props.transaction);
    } else if (props.mode === "add") {
      return !localTransaction.value.name;
    }
  });

  const headerTxt = computed(() => LABELS[props.mode].header);
  const buttonTxt = computed(() => LABELS[props.mode].button);

  function selectNewCoin(coin: CoinGecko) {
    localTransaction.value.pricePerCoinBought = coin.current_price;
    localTransaction.value.image = coin.image;
    localTransaction.value.symbol = coin.symbol.toUpperCase();
    localTransaction.value.name = coin.name;
  }

  async function handleSubmit() {
    const txName = localTransaction.value.name;
    if (props.mode === "edit") {
      await transactionService.updateTransaction(localTransaction.value);
    } else if (props.mode === "add" && txName) {
      await transactionService.addTransaction(localTransaction.value);
    }

    afterHandle(submitSuccess, onSuccsess);
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

    afterHandle(submitSuccess, onSuccsess);
  }

  //   Help functions /////////////////

  function onSuccsess() {
    transactionService.resetSuccess();
    emit("close");
  }

  function afterHandle(condition: Ref<boolean>, callback: () => void) {
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
