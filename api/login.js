import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = JSON.parse(req.body);

  // 🔹 从 Vercel 环境变量里读取
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;

  if (username === adminUser && password === adminPass) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }
}
