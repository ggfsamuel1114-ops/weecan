export default async function handler(req, res) {
  // 设置 CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { user, pass } = req.body;

    // 从 Vercel 环境变量里读取
    const ADMIN_USER = process.env.ADMIN_USER;
    const ADMIN_PASS = process.env.ADMIN_PASS;

    // 🔍 Debug log
    console.log("🟢 Debug 前端传来的:", { user, pass });
    console.log("🟢 Debug ENV:", { ADMIN_USER, ADMIN_PASS });

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("❌ Server error", err);
    res.status(500).json({ success: false, error: "Server error", details: err.message });
  }
}
