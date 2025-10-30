const fetch = require("node-fetch")

exports.handler = async function (event, context) {
  try {
    const response = await fetch("https://zenquotes.io/api/random")
    const result = await response.json()
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch quote" }),
    }
  }
}
