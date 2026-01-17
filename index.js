import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const EGX_URL = "https://markets.egx.com.eg/api/StockPrices";

app.get("/price", async (req, res) => {
  const symbol = req.query.symbol?.toUpperCase();
  if (!symbol) return res.status(400).json({ error: "symbol required" });

  try {
    const response = await fetch(EGX_URL);
    const data = await response.json();

    const stock = data.find((s) => s.Symbol.toUpperCase() === symbol);
    if (!stock)
      return res.json({ symbol, price: "N/A", message: "Stock not found" });

    res.json({
      symbol: stock.Symbol,
      name: stock.NameE,
      price: stock.Price,
      change: stock.Change,
      percent_change: stock.ChangePercent,
      source: "markets.egx.com.eg",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ EGX Proxy running on port ${PORT}`));
