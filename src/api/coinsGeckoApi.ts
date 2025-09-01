export async function getCoinsList(search = "") {
  const params = new URLSearchParams({ search });
  const response = await fetch(
    `api/coinslist/market?${params.toString().toLowerCase()}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw {
      message: data.message ?? "Failed to fetch coins",
      code: data.code ?? "server-error",
    };
  }
  return data.coins;
}

export async function updateCoinsList() {
  const response = await fetch("api/coinslist/update");
  const data = await response.json();
  if (!response.ok) {
    throw {
      message: data.message ?? "Failed to fetch coins",
      code: data.code ?? "server-error",
    };
  }
  return data;
}
