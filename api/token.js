// api/submit.js
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // 允许所有域访问
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // 预检请求直接返回
  }
  const token = process.env.AIRTABLE_TOKEN; // 从 Vercel 环境变量读取
  const baseId = process.env.AIRTABLE_BASE_ID; // 从 Vercel 环境变量读取
  const tableName = 'Purchases'; // 固定表名

  try {
    const airtableRes = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await airtableRes.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
