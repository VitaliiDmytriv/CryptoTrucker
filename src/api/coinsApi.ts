import { handleApiError } from "@/helpers/helpFunctions";
import { ApiResponse, ApiSuccess, CoinData, PortfolioData } from "@/types";

export async function getCoin(symbol: string) {
  const response = await fetch(`api/${symbol}`);
  const data: ApiResponse<CoinData> = await response.json();
  handleApiError(data);

  if (!response.ok) {
    throw {
      message: "Unexpected server response",
      code: "server-error",
    };
  }

  return data;
}

export async function getCoinList() {
  const response = await fetch(`api/`);
  const data: ApiResponse<PortfolioData> = await response.json();

  handleApiError(data);

  if (!response.ok) {
    throw {
      message: "Unexpected server response",
      code: "server-error",
    };
  }

  return data;
}
