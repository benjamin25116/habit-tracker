const { Pool } = require("@neondatabase/serverless")
const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL })

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method not allowed",
    }
  }
  let habitId, date, completed, value
  try {
    ;({ habitId, date, completed, value } = JSON.parse(event.body))
    console.log("save-habit payload:", { habitId, date, completed, value })
  } catch (e) {
    return { statusCode: 400, body: "Malformed JSON" }
  }

  try {
    await pool.query(
      `INSERT INTO habit_logs (habit_id, date, completed, value)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (habit_id, date)
       DO UPDATE SET completed = $3, value = $4`,
      [habitId, date, completed, value]
    )
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
      headers: { "Content-Type": "application/json" },
    }
  } catch (error) {
    console.error("save-habit error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: { "Content-Type": "application/json" },
    }
  }
}
