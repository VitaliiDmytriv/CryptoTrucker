export async function getCoin(symbol: string) {
  const response = await fetch(`api/${symbol}`);
  const data = await response.json();
  if (!response.ok) {
    throw {
      message: data.message ?? "Unknown server error",
      code: data.code ?? "server-error",
    };
  }
  return data;
}

export async function getCoinList() {
  // console.log("here");

  const response = await fetch(`api/`);
  const data = await response.json();
  if (!response.ok) {
    throw {
      message: data.message ?? "Unknown server error",
      code: data.code ?? "server-error",
    };
  }
  return data;
}
