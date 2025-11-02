import { ApiResponse, ApiSuccess, Coin, UserPortfolio } from "@/types";
import type { AxiosResponse } from "axios";
import api from "@/api/api";

export async function getCoin(symbol: string) {
  const { data }: AxiosResponse<ApiResponse<Coin>> = await api.get(`/${symbol}`);
  handleApiError(data);
  return data;
}

export async function getUserPortfolio() {
  const { data }: AxiosResponse<ApiResponse<UserPortfolio>> = await api.get("/");
  handleApiError(data);
  return data;
}
