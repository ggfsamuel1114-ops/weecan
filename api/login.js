import jwt from "jsonwebtoken";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method not allowed" });

  const { user, pass } = req.body;
  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;
  const SECRET = process.env.JWT_SECRET; // 记得在 Vercel 设置

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    // 生成 JWT token
    const token = jwt.sign({ user }, SECRET, { expiresIn: "2h" });
    return res.status(200).json({ success: true, token });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
}
