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

function sendError(res, code, message, status = 400) {
  return res.status(status).json({ message, code });
}

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

// Home

app.get("/", authMiddleware, async (req, res) => {
  try {
    await usersDB.read();
    const { userId } = req;
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

app.get("/:coin", authMiddleware, async (req, res) => {
  try {
    await usersDB.read();
    const { coin } = req.params;
    const { userId } = req;

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
  authMiddleware,
  async (req, res) => {
    try {
      const { coin, transactionId } = req.params;
      const { userId } = req;

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
