<script setup lang="ts">
//
const store = usePortfolioStore();
const router = useRouter();
const { fetchCoinList, loading: coinListLoading, error: coinListError } = useTransaction();

const coins = computed(() =>
  store.coinsList.map((coin) => ({
    name: coin,
  }))
);

onMounted(async () => {
  if (coins.value.length) return;
  await fetchCoinList();
});

function handleClick(row: { name: string }) {
  router.push({ name: "coin", params: { coin: row.name } });
}
//
</script>

<template>
  <!-- <div v-if="true"> -->
  <div v-if="coinListLoading">
    <el-skeleton :rows="4" animated />
  </div>
  <template v-if="store.coinsList.length">
    <el-table
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{ textAlign: 'center' }"
      :data="coins"
      @row-click="handleClick"
    >
      <el-table-column prop="name" label="Name" />
      <el-table-column label="Holdings" />
      <el-table-column label="Invested" />
    </el-table>
  </template>
</template>

<style scoped></style>
