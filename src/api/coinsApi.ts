import { handleApiError } from "@/helpers/helpFunctions";
import { ApiResponse, ApiSuccess, Coin, UserPortfolio } from "@/types";

export async function getCoin(symbol: string) {
  const response = await fetch(`api/${symbol}`);
  const data: ApiResponse<Coin> = await response.json();
  handleApiError(data);

  if (!response.ok) {
    throw {
      message: "Unexpected server response",
      code: "server-error",
    };
  }

  return data;
}

export async function getUserPortfolio() {
  const response = await fetch(`api/`);
  const data: ApiResponse<UserPortfolio> = await response.json();

  handleApiError(data);

  if (!response.ok) {
    throw {
      message: "Unexpected server response",
      code: "server-error",
    };
  }

  return data;
}
