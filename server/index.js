import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 3001;

app.use(cors());

function readDB() {
  const rawData = fs.readFileSync("db/db.json", "utf-8");
  return JSON.parse(rawData);
}

function checkDB(db) {
  return !db || !db.user || !db.user.coins || typeof db.user.coins !== "object";
}

app.get("/", (req, res) => {
  try {
    const db = readDB();
    if (checkDB(db)) {
      return res.status(500).json({ error: "Invalid DB structure" });
    }
    const coins = Object.keys(db.user.coins);
    const totalProfit = db.user.totalProfit;
    const activeInvestment = db.user.activeInvestment;

    res.json({ coins, totalProfit, activeInvestment });
  } catch (error) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

app.get("/:coin", (req, res) => {
  try {
    const { coin } = req.params;
    const db = readDB();

    const data = db?.user?.coins?.[coin];

    if (!data) {
      return res.status(404).json({
        error: `Coin '${coin}' not found`,
        code: "not-found",
      });
    }
    res.json(data);
  } catch (error) {
    console.error("Error reading DB:", error);
    res.status(500).json({
      error: "Failed to get data",
      code: "server-error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
