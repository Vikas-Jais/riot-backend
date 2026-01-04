import "dotenv/config";
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const RIOT_KEY = process.env.RIOT_API_KEY;

if (!RIOT_KEY) {
  console.error("❌ RIOT_API_KEY missing in .env");
  process.exit(1);
}

// Health check
app.get("/", (req, res) => {
  res.send("Riot Backend Running");
});

// Valorant verification
app.get("/verify/:name/:tag", async (req, res) => {
  try {
    const { name, tag } = req.params;

    const url = `https://apac.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      name
    )}/${encodeURIComponent(tag)}`;

    const riotRes = await axios.get(url, {
      headers: {
        "X-Riot-Token": RIOT_KEY,
      },
    });

    res.json({
      success: true,
      puuid: riotRes.data.puuid,
      gameName: riotRes.data.gameName,
      tagLine: riotRes.data.tagLine,
      region: "apac",
    });
  } catch (err) {
    console.error("RIOT ERROR:", err.response?.data || err.message);

    res.status(400).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🔥 Riot backend running on port ${PORT}`);
});
