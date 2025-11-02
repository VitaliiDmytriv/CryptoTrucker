import type { CoinGecko, TransactionFormProps, Transaction } from "../types/index";

const LABELS = {
  edit: { header: "Edit Transaction", button: "Edit" },
  add: { header: "Add Transaction", button: "Add transaction" },
  merge: { header: "Merge Transactions", button: "Merge" },
  split: { header: "Split Transaction", button: "Split" },
};

export function useTransactionForm(
  props: TransactionFormProps,
  emit: (e: "close", afterSuccses?: boolean) => void
) {
  const { localTransaction } = useTransactionCalculations({
    mode: props.mode,
    transaction: props.transaction,
  });

  const {
    success: submitSuccess,
    loading: submitLoading,
    error: submitError,
    ...transactionService
  } = useTransaction();

  const { editType, setEditType, ...split } = useSplit(localTransaction.value);

  const isSubmitDisabled = computed(() => {
    const tx = localTransaction.value;
    switch (props.mode) {
      case "edit":
        if (editType.value === "split") {
          return !split.canSplit.value;
        }
        return areTransactionsEqual(tx, props.transaction);
      case "add":
        return !tx.name;
      default:
        return false;
    }
  });
  const headerTxt = computed(() => {
    if (editType.value === "split") return LABELS["split"].header;
    return LABELS[props.mode].header;
  });
  const buttonTxt = computed(() => {
    if (editType.value === "split") return LABELS["split"].button;
    return LABELS[props.mode].button;
  });

  const submitHandlesr: Record<string, () => Promise<void>> = {
    edit: () => transactionService.updateTransaction(localTransaction.value),
    add: () => transactionService.addTransaction(localTransaction.value),
    merge: () =>
      transactionService.mergeTransactions(localTransaction.value, props.mergeSet || new Set()),
    split: () =>
      transactionService.splitTransaction(
        split.sourceTransaction.value,
        split.targetTransaction.value
      ),
  };

  async function handleSubmit() {
    const action = editType.value === "split" ? editType.value : props.mode;

    if (action === "add" && !localTransaction.value.name) return;

    await submitHandlesr[action]?.();

    runAfterSuccess(submitSuccess, onSuccsess);
  }

  function selectNewCoin(coin: CoinGecko) {
    localTransaction.value.pricePerCoinBought = coin.current_price;
    localTransaction.value.image = coin.image;
    localTransaction.value.symbol = coin.symbol.toUpperCase();
    localTransaction.value.name = coin.name;
  }

  async function handleDelete() {
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
    split,
    editType,
    localTransaction,
    headerTxt,
    buttonTxt,
    isSubmitDisabled,
    submitSuccess,
    submitLoading,
    submitError,
    setEditType,
    selectNewCoin,
    handleSubmit,
    handleDelete,
  };
}
