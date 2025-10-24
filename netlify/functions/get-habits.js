const { Pool } = require("@neondatabase/serverless")
const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL })

exports.handler = async function (event, context) {
  try {
    let startDate, endDate
    if (event.queryStringParameters) {
      startDate = event.queryStringParameters.start_date
      endDate = event.queryStringParameters.end_date
    } else {
      const url = new URL(event.rawUrl || event.url || "")
      startDate = url.searchParams.get("start_date")
      endDate = url.searchParams.get("end_date")
    }

    console.log("get-habits params:", startDate, endDate)

    const { rows } = await pool.query(
      `SELECT * FROM habit_logs WHERE date BETWEEN $1 AND $2 ORDER BY date DESC`,
      [startDate, endDate]
    )

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
      headers: { "Content-Type": "application/json" },
    }
  } catch (error) {
    console.error("get-habits error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: { "Content-Type": "application/json" },
    }
  }
}
