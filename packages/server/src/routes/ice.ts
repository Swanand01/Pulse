import { Router, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import { originCheck } from "../middleware/originCheck";

const router = Router();

const iceRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get(
  "/api/ice-servers",
  originCheck,
  iceRateLimit,
  async (_req: Request, res: Response) => {
    const tokenId = process.env.CLOUDFLARE_TURN_TOKEN_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!tokenId || !apiToken) {
      res.status(500).json({ error: "TURN credentials not configured" });
      return;
    }

    const response = await fetch(
      `https://rtc.live.cloudflare.com/v1/turn/keys/${tokenId}/credentials/generate-ice-servers`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ttl: 86400 }),
      },
    );

    if (!response.ok) {
      res.status(502).json({ error: "Failed to fetch TURN credentials" });
      return;
    }

    const data = await response.json();
    res.json(data);
  },
);

export default router;
