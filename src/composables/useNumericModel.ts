import { Transaction } from "@/types";

type NumericKeys = {
  [K in keyof Transaction]: Transaction[K] extends number | null ? K : never;
}[keyof Transaction];

// Компосабл, який повертає computed для числового поля Transaction,
// забезпечує двосторонній зв'язок з інпутом і конвертує рядок ↔ number|null.

export function useNumericModel(transaction: ComputedRef<Transaction>) {
  function makeNumerickModel<K extends NumericKeys>(key: K) {
    return computed({
      get: () => (transaction.value[key] === null ? "" : String(transaction.value[key])),
      set: (value: string) => {
        if (value === "") {
          transaction.value[key] = null;
        } else {
          transaction.value[key] = value === "" ? null : Number(value);
        }
      },
    });
  }

  function makeNumerickFields<T extends NumericKeys[]>(keys: [...T]) {
    const fields = {} as { [K in T[number]]: ReturnType<typeof makeNumerickModel> };

    for (const k of keys) {
      fields[k] = makeNumerickModel(k);
    }
    return fields;
  }

  const fields = makeNumerickFields(["quantity", "pricePerCoinBought", "pricePerCoinSold", "fees"]);

  return fields;
}
