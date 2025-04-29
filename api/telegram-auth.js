import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const SECRET_KEY = crypto
    .createHash("sha256")
    .update(TELEGRAM_BOT_TOKEN)
    .digest();

  const data = req.body;
  const authDate = parseInt(data.auth_date, 10);
  
  if (Math.floor(Date.now() / 1000) - authDate > 60) {
    return res.status(403).send("Request too old");
  }
  
  const checkString = Object.keys(data)
    .filter((key) => key !== "hash")
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  const hmac = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(checkString)
    .digest("hex");

  if (hmac !== data.hash) {
    return res.status(403).send("Invalid data");
  }
  
  const chatId = data.id;
  const firstName = data.first_name || "";

  const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  await fetch(telegramApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: `👋 Hello, ${firstName}! Thanks for signing in through our site.`,
    }),
  });

  return res.status(200).send("Message sent");
}
