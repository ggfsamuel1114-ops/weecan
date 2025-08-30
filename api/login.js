import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = JSON.parse(req.body);

  // 测试用：账号密码写死
  if (username === "admin" && password === "123456") {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h", // token 有效期 1 小时
    });
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }
}
