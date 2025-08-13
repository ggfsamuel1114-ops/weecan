export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 从环境变量读取
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = "Purchases";

  // 检查环境变量
  if (!token || !baseId) {
    return res.status(500).json({
      error: "Missing environment variables",
      AIRTABLE_TOKEN: token ? "✅ 已设置" : "❌ 未设置",
      AIRTABLE_BASE_ID: baseId ? "✅ 已设置" : "❌ 未设置",
    });
  }

  try {
    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body || {}),
      }
    );

    const data = await airtableRes.json();

    // 如果 Airtable API 返回错误
    if (!airtableRes.ok) {
      return res.status(airtableRes.status).json({
        error: "Airtable API Error",
        status: airtableRes.status,
        details: data,
      });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      error: "Server error",
      message: err.message,
      stack: err.stack,
    });
  }
}
