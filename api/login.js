export default async function handler(req, res) {
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

    // 从环境变量读取
    const ADMIN_USER = process.env.ADMIN_USER;
    const ADMIN_PASS = process.env.ADMIN_PASS;

    // 🔍 Debug log（部署后在 Vercel Logs 能看到）
    console.log("🟢 Debug 前端传来的:", { user, pass });
    console.log("🟢 Debug ENV:", { 
      ADMIN_USER, 
      ADMIN_PASS_HIDDEN: ADMIN_PASS ? "***" : "(空)" 
    });

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error", details: err.message });
  }
}
