require("dotenv").config();
const express = require("express");
const { searchAndScrape } = require("./scraper.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/scrape", async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  // if (!process.env.OPENAI_API_KEY) {
  //   return res.status(500).json({ error: 'OpenAI API key is not set. Please set the OPENAI_API_KEY environment variable.' });
  // }

  try {
    const data = await searchAndScrape(topic);
    res.json(data);
  } catch (error) {
    console.error("Error during scraping and processing:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while processing your request.",
        details: error.message,
      });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
