// api/updateStatus.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = "Purchases";

  try {
    const { receiptNo, status } = req.body;

    if (!receiptNo || !status) {
      return res.status(400).json({ error: "Missing receiptNo or status" });
    }

    // Step 1: 找到该收据
    const findRes = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
        tableName
      )}?filterByFormula=${encodeURIComponent(`{Receipt Number} = "${receiptNo}"`)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const findData = await findRes.json();

    if (!findData.records || findData.records.length === 0) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    const recordId = findData.records[0].id;

    // Step 2: 更新 Status 字段
    const updateRes = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${recordId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: { Status: status },
        }),
      }
    );

    const data = await updateRes.json();
    return res.status(updateRes.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
