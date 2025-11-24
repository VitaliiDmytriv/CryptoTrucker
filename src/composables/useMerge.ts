import { Transaction } from "@/types";

export function useMerge(symbol: string) {
  const isMerging = ref(false);
  const selectedTransactions = ref<Transaction[]>([]);
  const mergedTransaction = ref<Transaction>(getDefaultTransaction(symbol));

  const canOpenMerge = computed(() => !mergedTransaction.value.symbol);
  const canMerge = computed(() => selectedTransactions.value.length >= 2);
  const mergeSet = computed(() => {
    return new Set(selectedTransactions.value.map((t) => t.id));
  });

  function startMerging() {
    isMerging.value = true;
  }

  function resetMerging() {
    isMerging.value = false;
    selectedTransactions.value = [];
    setTransactionField("quantity", null);
    setTransactionField("pricePerCoinBought", null);
  }

  function toggleMerging() {
    if (isMerging.value) {
      resetMerging();
    } else {
      startMerging();
    }
  }

  function setTransactionField<K extends keyof Transaction>(key: K, value: Transaction[K]) {
    mergedTransaction.value[key] = value;
  }

  function toggleTransactionToMerge(transaction: Transaction) {
    const index = selectedTransactions.value.findIndex((t) => t.id === transaction.id);
    if (index === -1) selectedTransactions.value.push(transaction);
    else selectedTransactions.value.splice(index, 1);

    recalculateMergedTransaction();
  }

  function recalculateMergedTransaction() {
    const update = calculateMergedTransaction(selectedTransactions.value);
    Object.assign(mergedTransaction.value, update);
  }

  return {
    canOpenMerge,
    canMerge,
    mergeSet,
    mergedTransaction,
    isMerging,
    setTransactionField,
    resetMerging,
    startMerging,
    toggleTransactionToMerge,
    toggleMerging,
  };
}
