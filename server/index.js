import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const sessionsAdapter = new JSONFile("db/sessions.json");
const sessionsDB = new Low(sessionsAdapter, { sessions: [] });

const usersAdapter = new JSONFile("db/db.json");
const usersDB = new Low(usersAdapter, { users: [] });

const coinsListAdapter = new JSONFile("db/coinsList.json");
const coinsListDB = new Low(coinsListAdapter, { coins: [] });

function sendError(res, code, message, status = 400) {
  return res.status(status).json({ message, code });
}

async function authMiddleware(req, res, next) {
  // missing-session
  // expired-session
  // invalid-session
  try {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      return sendError(res, "missing-session", "No session ID provided", 401);
    }

    await sessionsDB.read();
    const session = sessionsDB.data.sessions.find(
      (s) => s.sessionId === sessionId
    );

    if (!session) {
      return sendError(res, "missing-session", "Session not found", 401);
    }

    if (new Date(session.expiresAt) < new Date()) {
      return sendError(res, "missing-session", "Session expired", 401);
    }

    req.userId = session.userId;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return sendError(res, "server-error", "Internal server error", 500);
  }
}

const userId = "3986b2f1-f4ed-42c7-b983-1d7144fbbe81";
// Home

app.get("/", async (req, res) => {
  try {
    await usersDB.read();

    const user = usersDB.data.users.find((u) => u.id === userId);

    if (!user || !user.coins) {
      return sendError(res, "server-error", "Invalid DB structure", 500);
    }
    const coins = Object.keys(user.coins);

    res.json({
      coins,
      totalProfit: user.totalProfit,
      activeInvestment: user.activeInvestment,
    });
  } catch (error) {
    sendError(res, "server-error", "Failed to read database", 500);
  }
});

// Coins

app.get("/:coin", async (req, res) => {
  try {
    await usersDB.read();
    const { coin } = req.params;

    const user = usersDB.data.users.find((u) => u.id === userId);

    if (!user || !user.coins) {
      return sendError(res, "not-found", "User isn't found", 404);
    }

    const coinData = user.coins[coin];

    if (!coinData) {
      return sendError(res, "not-found", `Coin '${coin}' not found`, 404);
    }
    res.json(coinData);
  } catch (error) {
    return sendError(res, "server-error", "Failed to get data", 500);
  }
});

// Transactions ========

app.put(
  "/:coin/transactions/:transactionId",

  async (req, res) => {
    try {
      const { coin, transactionId } = req.params;

      await usersDB.read();

      const user = usersDB.data.users.find((u) => u.id === userId);

      if (!user) {
        return sendError(
          res,
          "server-error",
          "Something went wrong on the server",
          500
        );
      }

      const transactions = user.coins[coin]?.transactions || [];

      const transaction = transactions.find((t) => t.id === transactionId);

      if (!transaction) {
        return sendError(res, "not-found", `Transaction is not found`, 404);
      }

      // оновлюємо дані
      Object.assign(transaction, req.body);

      // зберігаємо у базу
      await usersDB.write();

      res.json({ success: true, transaction });
    } catch (err) {
      sendError(
        res,
        "server-error",
        err.message || "Internal Server Error",
        404
      );
    }
  }
);

app.post("/:coin/transactions", async (req, res) => {
  try {
    const { coin: coinSymbol } = req.params;

    await usersDB.read();

    const user = usersDB.data.users.find((u) => u.id === userId);
    const coin = user.coins[coinSymbol];

    if (coin) {
      coin.transactions.push(req.body);
    } else {
      user.coins[coinSymbol] = {
        coinFullName: req.body.name,
        transactions: [req.body],
      };
    }
    res.json({ success: true, transaction: req.body });

    // зберігаємо у базу
    await usersDB.write();
  } catch (err) {
    sendError(res, "server-error", err.message || "Internal Server Error", 404);
  }
});

app.delete("/:coin/transactions/:id", async (req, res) => {
  try {
    const { coin: coinSymbol, id } = req.params;

    await usersDB.read();

    const user = usersDB.data.users.find((u) => u.id === userId);

    if (!user) {
      return sendError(
        res,
        "server-error",
        "Something went wrong on the server",
        500
      );
    }

    const coin = user.coins[coinSymbol];

    if (!coin) {
      return sendError(
        res,
        "server-error",
        `We couln't find ${coinSymbol} coin`,
        404
      );
    }

    const foundIndex = coin.transactions.findIndex(
      (transaction) => transaction.id === id
    );

    if (foundIndex < 0) {
      return sendError(
        res,
        "server-error",
        `We couln't find such transaction in ${coinSymbol} coin`,
        404
      );
    }

    coin.transactions.splice(foundIndex, 1);

    // якщо немає траназкцій, видаляємо монету
    if (!coin.transactions.length) {
      delete user.coins[coinSymbol];
    }

    await usersDB.write();

    res.json({ success: true, coins: Object.keys(user.coins) });

    // зберігаємо у базу
  } catch (err) {
    sendError(res, "server-error", err.message || "Internal Server Error", 404);
  }
});

app.patch("/:coin/transactions/merge", async (req, res) => {
  try {
    const { coin: coinSymbol } = req.params;

    await usersDB.read();

    const user = usersDB.data.users.find((u) => u.id === userId);

    if (!user) {
      return sendError(
        res,
        "server-error",
        "Something went wrong on the server",
        500
      );
    }

    const coin = user.coins[coinSymbol];

    if (!coin) {
      return sendError(
        res,
        "server-error",
        `We couln't find ${coinSymbol} coin`,
        404
      );
    }

    const deleteIds = new Set(
      Array.isArray(req.body.delete) ? req.body.delete : []
    );
    const newTransaction = req.body.add ?? null;

    if (!newTransaction) {
      return sendError(res, "server-error", "No new transaction provided", 400);
    }

    const filteredTransactions = coin.transactions.filter(
      (t) => !deleteIds.has(t.id)
    );

    filteredTransactions.push(newTransaction);

    coin.transactions = filteredTransactions;

    await usersDB.write();

    res.json({ success: true, transactions: filteredTransactions });

    // зберігаємо у базу
  } catch (err) {
    sendError(res, "server-error", err.message || "Internal Server Error", 500);
  }
});

app.patch("/:coin/transactions/split", async (req, res) => {
  try {
    const { coin: coinSymbol } = req.params;

    await usersDB.read();

    const user = usersDB.data.users.find((u) => u.id === userId);

    if (!user) {
      return sendError(
        res,
        "server-error",
        "Something went wrong on the server",
        500
      );
    }

    const coin = user.coins[coinSymbol];

    if (!coin) {
      return sendError(
        res,
        "server-error",
        `We couln't find ${coinSymbol} coin`,
        404
      );
    }

    const { updatedTransaction, splitedTransaction } = req.body;

    const index = coin.transactions.findIndex(
      (t) => t.id === updatedTransaction.id
    );

    if (index === -1) {
      return sendError(res, "not-found", `Transaction is not found`, 404);
    }

    coin.transactions.splice(index, 1, updatedTransaction, splitedTransaction);

    await usersDB.write();

    res.json({ transactions: coin.transactions, success: true });

    // зберігаємо у базу
  } catch (err) {
    sendError(res, "server-error", err.message || "Internal Server Error", 500);
  }
});
// CoinGecko ==============

// fetch coins list from CoinGecko and write it for local base
async function fetchCoinsFromCoinGecko(limit = 1000) {
  let coins = [];
  const perPage = 250;
  const pages = Math.ceil(limit / perPage);

  for (let page = 1; page < pages; page++) {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`
    );
    if (!response.ok) {
      throw {
        message: data.message ?? "Failed to fetch coins",
        code: data.code ?? "server-error",
      };
    }
    const data = await response.json();
    coins = [...coins, ...data];
  }
  return coins.slice(0, limit);
}

app.get("/coinslist/update", async (req, res) => {
  try {
    const coins = await fetchCoinsFromCoinGecko(1250);
    await coinsListDB.read();
    coinsListDB.data.coins = coins;
    await coinsListDB.write();
    res.json({ success: true, message: `Збережено ${coins.length} монет` });
  } catch (error) {
    sendError(res, "server-error", "Failed to fetch coins", 500);
  }
});

app.get("/coinslist/market", async (req, res) => {
  try {
    await coinsListDB.read();
    const search = req.query?.search;

    let slicedCoins;
    if (search) {
      slicedCoins = coinsListDB.data.coins.filter((coin) => {
        return (
          coin.name.toLowerCase().includes(search) ||
          coin.symbol.toLowerCase().includes(search)
        );
      });
    } else {
      slicedCoins = coinsListDB.data.coins.slice(0, 50);
    }

    res.json({
      coins: slicedCoins,
    });
  } catch (error) {
    sendError(res, "server-error", "Failed to read database", 500);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
