import { getDefaultTransaction } from "@/helpers/helpFunctions";
import { Transaction } from "@/types";
import { computed, ref, watch } from "vue";

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
      const update = calc();
      Object.assign(defaultTransaction.value, update);
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
  function reset(newSymbol: string) {
    cancelMerging();
    defaultTransaction.value = getDefaultTransaction(newSymbol);
  }
  function toggleTransactionToMerge(transaction: Transaction) {
    const foundIndex = transactionsToMerge.value.findIndex(
      (t) => t.id === transaction.id
    );
    if (foundIndex === -1) {
      transactionsToMerge.value.push(transaction);
    } else {
      transactionsToMerge.value.splice(foundIndex, 1);
    }
  }

  function calc() {
    const quantity = transactionsToMerge.value.reduce(
      (prev, cur) => prev + (cur.quantity || 0),
      0
    );

    const totalSpent = transactionsToMerge.value.reduce(
      (prev, cur) => prev + (cur.quantity || 0) * (cur.pricePerCoinBought || 0),
      0
    );
    const fees = transactionsToMerge.value.reduce(
      (prev, cur) => prev + (cur.fees || 0),
      0
    );
    const pricePerCoinBought = Number((totalSpent / quantity).toFixed(4)) || 0;

    return {
      quantity: Number(quantity.toFixed(5)),
      totalSpent,
      fees,
      pricePerCoinBought,
    };
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
    reset,
    toggleTransactionToMerge,
    setCoinImage,
    toggleMerging,
  };
}
