import type { CoinGecko, TransactionFormProps, Transaction } from "../types/index";

const LABELS = {
  edit: { header: "Edit Transaction", button: "Edit" },
  add: { header: "Add Transaction", button: "Add transaction" },
  merge: { header: "Merge Transactions", button: "Merge" },
  split: { header: "Split Transaction", button: "Split" },
} as const;

type Mode = keyof typeof LABELS;

export function useTransactionForm(
  props: TransactionFormProps,
  emit: (e: "close", afterSuccess?: boolean) => void
) {
  const { localTransaction } = useTransactionCalculations({
    mode: props.mode,
    transaction: props.transaction,
  });

  const {
    success: submitSuccess,
    loading: submitLoading,
    error: submitError,
    resetSuccess,
    ...transactionService
  } = useTransaction();

  const split = useSplit(localTransaction.value);

  const isSubmitDisabled = computed(() => {
    if (!localTransaction.value.name && props.mode === "add") return true;

    if (props.mode === "edit") {
      if (split.editType.value === "split") {
        return !split.canSplit.value;
      }
      return areTransactionsEqual(localTransaction.value, props.transaction);
    }
    return false;
  });

  const headerTxt = computed(() => {
    if (split.editType.value === "split") return LABELS["split"].header;
    return LABELS[props.mode].header;
  });
  const buttonTxt = computed(() => {
    if (split.editType.value === "split") return LABELS["split"].button;
    return LABELS[props.mode].button;
  });

  const submitHandlesr: Record<Mode, () => Promise<void>> = {
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
    const action = split.editType.value === "split" ? split.editType.value : props.mode;

    if (action === "add" && !localTransaction.value.name) return;

    await submitHandlesr[action]?.();

    runAfterSuccess(submitSuccess, onSuccess);
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

    runAfterSuccess(submitSuccess, onSuccess);
  }

  function onSuccess() {
    resetSuccess();
    emit("close", true);
  }

  return {
    split,
    localTransaction,
    headerTxt,
    buttonTxt,
    isSubmitDisabled,
    submitSuccess,
    submitLoading,
    submitError,
    selectNewCoin,
    handleSubmit,
    handleDelete,
  };
}
