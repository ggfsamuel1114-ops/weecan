// api/updateSaleStatus.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = "Sales";

  try {
    const { recordId, status } = req.body;

    if (!recordId || !status) {
      return res.status(400).json({ error: "Missing recordId or status" });
    }

    console.log("🟡 Updating Airtable record:", recordId, "with status:", status);

    const updateRes = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${recordId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Status: status   // ✅ must be plain string "Cancelled"
          },
        }),
      }
    );

    const data = await updateRes.json();
    console.log("📥 Airtable response:", data);

    if (updateRes.ok) {
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(updateRes.status).json({ success: false, data });
    }
  } catch (err) {
    console.error("🔥 updateStatus error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
