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

async function authMiddleware(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: "No session" });
  }

  await sessionsDB.read();
  const session = sessionsDB.data.sessions.find(
    (s) => s.sessionId === sessionId
  );

  if (!session) {
    return res.status(401).json({ error: "Invalid session" });
  }

  if (new Date(session.expiresAt) < new Date()) {
    return res.status(401).json({ error: "Session expired" });
  }

  req.userId = session.userId;
  next();
}

// get ======

app.get("/", authMiddleware, async (req, res) => {
  try {
    await usersDB.read();
    const { userId } = req;
    const user = usersDB.data.users.find((u) => u.id === userId);

    if (!user || !user.coins) {
      return res.status(500).json({ error: "Invalid DB structure" });
    }
    const coins = Object.keys(user.coins);

    res.json({
      coins,
      totalProfit: user.totalProfit,
      activeInvestment: user.activeInvestment,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

app.get("/:coin", authMiddleware, async (req, res) => {
  try {
    await usersDB.read();
    const { coin } = req.params;
    const { userId } = req;

    const user = usersDB.data.users.find((u) => u.id === userId);

    if (!user || !user.coins) {
      return res.status(500).json({
        error: `Invalid DB structure ${user}}`,
      });
    }

    const coinData = user.coins[coin];

    if (!coinData) {
      return res.status(404).json({
        error: `Coin '${coin}' not found`,
        code: "not-found",
      });
    }
    res.json(coinData);
  } catch (error) {
    console.error("Error reading DB:", error);
    res.status(500).json({
      error: "Failed to get data",
      code: "server-error",
    });
  }
});

// put ========

app.put(
  "/:coin/transactions/:transactionId",
  authMiddleware,
  async (req, res) => {
    try {
      const { coin, transactionId } = req.params;
      const { userId } = req;

      await usersDB.read();

      const user = usersDB.data.users.find((u) => u.id === userId);

      if (!user) {
        throw new Error("Something went wrong on the server");
      }

      const transactions = user.coins[coin]?.transactions;

      if (!transactions) {
        return res.status(404).json({
          error: `Coin '${coin}' not found`,
          code: "not-found",
        });
      }

      const transaction = transactions.find((t) => t.id === transactionId);

      if (!transaction) {
        return res.status(404).json({
          error: `Transaction is not found`,
          code: "not-found",
        });
      }

      // оновлюємо дані
      Object.assign(transaction, req.body);

      // зберігаємо у базу
      await usersDB.write();

      res.json({ success: true, transaction });
    } catch (err) {
      res.status(500).json({ error: err.message, code: "server-error" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
