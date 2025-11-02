import { Transaction } from "@/types";

export function useMerge(symbol: string) {
  const isMerging = ref(false);
  const transactionsToMerge = ref<Transaction[]>([]);
  const defaultTransaction = ref<Transaction>(getDefaultTransaction(symbol));

  const canOpenMerge = computed(() => !defaultTransaction.value.symbol);
  const canMerge = computed(() => transactionsToMerge.value.length >= 2);
  const mergeSet = computed(() => {
    return new Set(transactionsToMerge.value.map((t) => t.id));
  });

  watch(
    transactionsToMerge,
    () => {
      updateDefaultTransaction();
    },
    { deep: true, immediate: false }
  );

  function startMerging() {
    isMerging.value = true;
  }
  function cancelMerging() {
    isMerging.value = false;
    transactionsToMerge.value = [];
  }
  function toggleMerging() {
    if (isMerging.value) {
      cancelMerging();
    } else {
      startMerging();
    }
  }
  function setCoinImage(url: string) {
    defaultTransaction.value.image = url;
  }
  function setCoinName(coinName: string) {
    defaultTransaction.value.name = coinName;
  }
  function reset(newSymbol: string) {
    cancelMerging();
    defaultTransaction.value = getDefaultTransaction(newSymbol);
  }
  function toggleTransactionToMerge(transaction: Transaction) {
    const foundIndex = transactionsToMerge.value.findIndex((t) => t.id === transaction.id);
    if (foundIndex === -1) {
      transactionsToMerge.value.push(transaction);
    } else {
      transactionsToMerge.value.splice(foundIndex, 1);
    }
  }

  function updateDefaultTransaction() {
    const update = calculateMergedTransaction(transactionsToMerge.value);
    Object.assign(defaultTransaction.value, update);
  }

  return {
    canOpenMerge,
    canMerge,
    mergeSet,
    defaultTransaction,
    isMerging,
    transactionsToMerge,
    cancelMerging,
    startMerging,
    setCoinName,
    reset,
    toggleTransactionToMerge,
    setCoinImage,
    toggleMerging,
  };
}
