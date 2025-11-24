import express from "express";
import type { Response } from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import cookieParser from "cookie-parser";
import type {
  SessionsData,
  User,
  UsersData,
  Transaction,
  Coin,
  CoinListData,
  CoinStats,
  GlobalStats,
} from "server/types";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const sessionsAdapter = new JSONFile<SessionsData>("db/sessions.json");
const sessionsDB = new Low(sessionsAdapter, { sessions: [] });

const usersAdapter = new JSONFile<UsersData>("db/db.json");
const usersDB = new Low(usersAdapter, { users: [] });

const coinsListAdapter = new JSONFile<CoinListData>("db/coinsList.json");
const coinsListDB = new Low(coinsListAdapter, { coins: [] });

// async function authMiddleware(req: Request, res: Response, next: NextFunction) {
//   // missing-session
//   // expired-session
//   // invalid-session
//   try {
//     const sessionId = req.cookies.sessionId;

//     if (!sessionId) {
//       return sendError(res, "missing-session", "No session ID provided", 401);
//     }

//     await sessionsDB.read();
//     const session = sessionsDB.data.sessions.find((s) => s.sessionId === sessionId);

//     if (!session) {
//       return sendError(res, "missing-session", "Session not found", 401);
//     }

//     if (new Date(session.expiresAt) < new Date()) {
//       return sendError(res, "missing-session", "Session expired", 401);
//     }

//     req.userId = session.userId;
//     next();
//   } catch (err) {
//     console.error("Auth middleware error:", err);
//     return sendError(res, "server-error", "Internal server error", 500);
//   }
// }

const userId = "3986b2f1-f4ed-42c7-b983-1d7144fbbe81";
// Home

app.get("/", async (req, res) => {
  try {
    await usersDB.read();

    const user = getUserOrThrow(usersDB.data, userId);
    const data = getDefaultData(user);

    res.json({ success: true, data });
  } catch (error) {
    console.error("🔥 Error in GET /:", error);
    handleError(error, res);
  }
});

// Coins

app.get("/:coin", async (req, res) => {
  try {
    await usersDB.read();
    const { coin } = req.params;

    const user = getUserOrThrow(usersDB.data, userId);
    const coinData = getCoinOrThrow(user, coin);
    res.json({ success: true, data: coinData });
  } catch (error) {
    handleError(error, res);
  }
});

// Transactions ========

app.put("/:coin/transactions/:transactionId", async (req, res) => {
  try {
    await usersDB.read();

    const { coin: coinSymbol, transactionId } = req.params;
    const updTransaction: Transaction = normalizeTransaction(req.body);

    const user = getUserOrThrow(usersDB.data, userId);
    const coin = getCoinOrThrow(user, coinSymbol);
    const transaction = getTransactionOrThrow(coin, transactionId);

    const shoudlRecalc = shouldRecalculate(transaction, updTransaction);

    // upd transaction
    Object.assign(transaction, updTransaction);

    let coinStats;
    let globalStats;

    if (shoudlRecalc) {
      updateCoinStats(coin);
      updateGlobalStats(user);
      coinStats = getCoinStats(coin);
      globalStats = getGlobalStats(user);
    }

    res.json({
      success: true,
      data: { transaction, shoudlRecalc, ...(shoudlRecalc && { coinStats, globalStats }) },
    });

    await usersDB.write();
  } catch (error) {
    handleError(error, res);
  }
});

app.post("/:coin/transactions", async (req, res) => {
  try {
    await usersDB.read();

    const { coin: coinSymbol } = req.params;
    const transaction: Transaction = normalizeTransaction(req.body);
    let isNewCoin = false;

    const user = getUserOrThrow(usersDB.data, userId);
    let coin = user.coins[coinSymbol];

    if (coin) {
      coin.transactions.push(transaction);
    } else {
      coin = createCoinRecord(transaction);
      user.coins[coinSymbol] = coin;
      isNewCoin = true;
    }

    updateCoinStats(coin);
    updateGlobalStats(user);
    const globalStats = getGlobalStats(user);
    const coinStats = getCoinStats(coin);

    res.json({
      success: true,
      data: { isNewCoin, globalStats, ...(isNewCoin ? { coin } : { transaction, coinStats }) },
    });

    // зберігаємо у базу
    await usersDB.write();
  } catch (error) {
    handleError(error, res);
  }
});

app.delete("/:coin/transactions/:id", async (req, res) => {
  try {
    await usersDB.read();
    const { coin: coinSymbol, id: transactionId } = req.params;

    const user = getUserOrThrow(usersDB.data, userId);
    const coin = getCoinOrThrow(user, coinSymbol);
    const index = getTrnsctIndexOrThrow(coin, transactionId);

    coin.transactions.splice(index, 1);

    let isCoinRemoved: boolean;
    let coinStats;

    if (!coin.transactions.length) {
      delete user.coins[coinSymbol];
      isCoinRemoved = true;
    } else {
      isCoinRemoved = false;
      updateCoinStats(coin);
      coinStats = getCoinStats(coin);
    }

    updateGlobalStats(user);
    const globalStats = getGlobalStats(user);

    if (isCoinRemoved) {
      res.json({ success: true, data: { isCoinRemoved, globalStats } });
    } else {
      res.json({ success: true, data: { isCoinRemoved, globalStats, coinStats } });
    }

    await usersDB.write();
  } catch (error) {
    console.error("🔥 Error in DELETE /:coin/transactions/:id:", error);
    handleError(error, res);
  }
});

app.patch("/:coin/transactions/merge", async (req, res) => {
  try {
    await usersDB.read();
    const { coin: coinSymbol } = req.params;
    const updTransaction: Transaction = normalizeTransaction(req.body.add);

    const user = getUserOrThrow(usersDB.data, userId);
    const coin = getCoinOrThrow(user, coinSymbol);

    const deleteIds = new Set(Array.isArray(req.body.delete) ? req.body.delete : []);

    const updatedTransactions = [
      ...coin.transactions.filter((t) => !deleteIds.has(t.id)),
      updTransaction,
    ];

    coin.transactions = updatedTransactions;

    updateCoinStats(coin);
    const coinStats = getCoinStats(coin);
    updateGlobalStats(user);
    const globalStats = getGlobalStats(user);

    res.json({ success: true, data: { updatedTransactions, coinStats, globalStats } });

    await usersDB.write();
  } catch (error) {
    handleError(error, res);
  }
});

app.patch("/:coin/transactions/split", async (req, res) => {
  try {
    await usersDB.read();

    const { coin: coinSymbol } = req.params;
    const updatedTransaction = normalizeTransaction(req.body.updatedTransaction);
    const splitedTransaction = normalizeTransaction(req.body.splitedTransaction);

    const user = getUserOrThrow(usersDB.data, userId);
    const coin = getCoinOrThrow(user, coinSymbol);
    const index = getTrnsctIndexOrThrow(coin, updatedTransaction.id);

    coin.transactions.splice(index, 1, updatedTransaction, splitedTransaction);

    updateCoinStats(coin);
    updateGlobalStats(user);
    const globalStats = getGlobalStats(user);
    const coinStats = getCoinStats(coin);

    res.json({
      success: true,
      data: { updatedTransaction, splitedTransaction, globalStats, coinStats },
    });

    await usersDB.write();
  } catch (error) {
    handleError(error, res);
  }
});
// CoinGecko ==============

// fetch coins list from CoinGecko and write it for local base
// async function fetchCoinsFromCoinGecko(limit = 1000) {
//   let coins = [];
//   const perPage = 250;
//   const pages = Math.ceil(limit / perPage);

//   for (let page = 1; page < pages; page++) {
//     const response = await fetch(
//       `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`
//     );
//     if (!response.ok) {
//       throw {
//         message: data.message ?? "Failed to fetch coins",
//         code: data.code ?? "server-error",
//       };
//     }
//     const data = await response.json();
//     coins = [...coins, ...data];
//   }
//   return coins.slice(0, limit);
// }

// app.get("/coinslist/update", async (req, res) => {
//   try {
//     const coins = await fetchCoinsFromCoinGecko(1250);
//     await coinsListDB.read();
//     coinsListDB.data.coins = coins;
//     await coinsListDB.write();
//     res.json({ success: true, message: `Збережено ${coins.length} монет` });
//   } catch (error) {
//     sendError(res, "server-error", "Failed to fetch coins", 500);
//   }
// });

app.get("/coinslist/market", async (req, res) => {
  try {
    await coinsListDB.read();
    const search = typeof req.query.search === "string" ? req.query.search : "";

    let slicedCoins;
    if (search) {
      slicedCoins = coinsListDB.data.coins.filter((coin) => {
        return (
          coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search)
        );
      });
    } else {
      slicedCoins = coinsListDB.data.coins.slice(0, 50);
    }

    res.json({ success: true, data: { coins: slicedCoins } });
  } catch (error) {
    handleError(error, res);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// #############################################
// =============================================
// Helper Functions
// =============================================
// #############################################

// Errors Handlig ==============================
class HttpError extends Error {
  public status: number;
  public code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function sendError(res: Response, code: string, message: string, status: number = 400) {
  return res.status(status).json({ success: false, message, code });
}

function handleError(error: unknown, res: Response) {
  if (error instanceof HttpError) {
    return sendError(res, error.code, error.message, error.status);
  }

  // логування помилки на сервері
  console.error("🔥 Unhandled error:", error);

  // повертаємо реальне повідомлення помилки
  const message = error instanceof Error ? error.message : String(error);

  sendError(res, "server-error", message, 500);
}
// ==============================================

// Validation ===================================
function getUserOrThrow(base: UsersData, userId: string) {
  const user = base.users.find((u) => u.id === userId);

  if (!user) {
    throw new HttpError(404, "user-not-found", "User not found");
  }

  return user;
}

function getCoinOrThrow(user: User, coin: string) {
  const coinData = user.coins[coin];

  if (!coinData) {
    throw new HttpError(404, "not-found", `Coin '${coin}' not found`);
  }
  return coinData;
}

function getTransactionOrThrow(coin: Coin, id: string) {
  const transaction = coin.transactions.find((t) => t.id === id);

  if (!transaction) {
    throw new HttpError(404, "not-found", `Transaction is not found`);
  }
  return transaction;
}

function getTrnsctIndexOrThrow(coin: Coin, id: string) {
  const index = coin.transactions.findIndex((t) => t.id === id);
  if (index < 0) {
    throw new HttpError(404, "not-found", `Such transaction is not found in ${coin.symbol}`);
  }
  return index;
}
// ==============================================

// getData  =====================================
function getDefaultData(user: User) {
  const data = {
    activeInvestment: user.activeInvestment,
    coins: user.coins,
    totalProfit: user.totalProfit,
  };

  data.coins = Object.fromEntries(
    Object.entries(data.coins).map(([key, value]) => {
      return [key, { ...value, transactions: [] }];
    })
  );

  return data;
}

function getCoinStats(coin: Coin): CoinStats {
  const { activeInvestment, avgPrice, holdings, totalProfit } = coin;
  return { activeInvestment, avgPrice, holdings, totalProfit };
}

function getGlobalStats(user: User): GlobalStats {
  const { activeInvestment, totalProfit } = user;
  return { activeInvestment, totalProfit };
}

function getAvgPrice(totalInvest: number, totalQuantity: number) {
  return totalInvest / totalQuantity;
}

function getHoldings(coin: Coin) {
  return coin.transactions.reduce((acc, t) => (t.pricePerCoinSold ? acc : acc + t.quantity), 0);
}

function getActiveInvest(coin: Coin) {
  return coin.transactions.reduce((acc, t) => (t.pricePerCoinSold ? acc : acc + t.totalSpent), 0);
}
function getTotalProfit(coin: Coin) {
  return coin.transactions.reduce((acc, t) => acc + (t.profit || 0), 0);
}

function updateCoinStats(coin: Coin) {
  coin.activeInvestment = getActiveInvest(coin);
  coin.holdings = getHoldings(coin);
  coin.totalProfit = getTotalProfit(coin);
  coin.avgPrice = getAvgPrice(coin.activeInvestment, coin.holdings);
}

// Mutation =====================================

function createCoinRecord(transaction: Transaction): Coin {
  const coin = {
    symbol: transaction.symbol,
    name: transaction.name,
    image: transaction.image,
    activeInvestment: 0,
    avgPrice: 0,
    holdings: 0,
    totalProfit: 0,
    transactions: [transaction],
  };

  return coin;
}

function updateGlobalStats(user: User) {
  user.totalProfit = Object.values(user.coins).reduce((acc, curr) => acc + curr.totalProfit, 0);
  user.activeInvestment = Object.values(user.coins).reduce(
    (acc, curr) => acc + curr.activeInvestment,
    0
  );
}

// ==============================================

// Other ========================================

function shouldRecalculate(trn: Transaction, updTrn: Transaction) {
  return (
    trn.quantity !== updTrn.quantity ||
    trn.pricePerCoinBought !== updTrn.pricePerCoinBought ||
    trn.pricePerCoinSold !== updTrn.pricePerCoinSold ||
    trn.fees !== updTrn.fees
  );
}

function normalizeTransaction(transaction: Transaction) {
  return {
    ...transaction,
    pricePerCoinBought: Number(transaction.pricePerCoinBought),
    quantity: Number(transaction.quantity),
    pricePerCoinSold:
      transaction.pricePerCoinSold != null ? Number(transaction.pricePerCoinSold) : null,
    fees: transaction.fees != null ? Number(transaction.fees) : null,
  };
}

// ==============================================
