export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = "Purchases"; // 固定读取 Purchases 表

  try {
    let allRecords = [];
    let offset = null;

    do {
      const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?pageSize=100&sort[0][field]=Time%20Stamp&sort[0][direction]=desc${offset ? `&offset=${offset}` : ''}`;

      const airtableRes = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await airtableRes.json();
      allRecords = allRecords.concat(data.records);
      offset = data.offset;
    } while (offset);

    res.status(200).json(allRecords);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
