require("dotenv").config();
const { getJson } = require("serpapi");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const {executablePath} = require("puppeteer");

puppeteer.use(StealthPlugin());

const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function searchAndScrape(topic) {

  // Step 1: Use SerpApi to reliably get search results
  console.log(`Using SerpApi to search for "${topic}"...`);
  const searchResults = await getJson({
    engine: "google",
    q: topic,
    api_key: process.env.SERPAPI_API_KEY,
  });

  if (
    !searchResults ||
    !searchResults.organic_results ||
    searchResults.organic_results.length === 0
  ) {
    throw new Error("Could not find any search results via SerpApi.");
  }

  const firstLink = searchResults.organic_results[0].link;
  console.log(`Found link via SerpApi: ${firstLink}. Now scraping page...`);

  // Step 2: Use Puppeteer with stealth to scrape the target page
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process",
    ],
  });
  const page = await browser.newPage();
  await page.goto(firstLink, { waitUntil: "networkidle2" });

  const pageContent = await page.evaluate(() => {
    return {
      textContent: document.body.innerText,
      images: Array.from(document.images).map((img) => img.src),
      videos: Array.from(document.querySelectorAll("video")).map(
        (vid) => vid.src
      ),
      links: Array.from(document.querySelectorAll("a")).map((a) => a.href),
    };
  });

  await browser.close();
  console.log("Scraping complete. Processing with AI...");

  // Step 3: Process with OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a research assistant. Your task is to generate a detailed, well-structured blog post from the provided text. Your response MUST be a valid JSON object with the keys "detailedReport", "links", "images", and "videos".`,
      },
      {
        role: "user",
        content: `Please process the following scraped data for the topic "${topic}".

Text Content:
${pageContent.textContent.substring(0, 4000)}

Your response MUST be a valid JSON object with the following structure:
{
  "detailedReport": "...",
  "links": [
    { "url": "...", "description": "..." }
  ],
  "images": [
    { "url": "...", "description": "..." }
  ],
  "videos": [
    { "url": "...", "description": "..." }
  ]
}

The 'detailedReport' should be a single string of markdown-formatted text.
The 'links', 'images', and 'videos' arrays should be populated with relevant data from the text content.
Do not include any text outside of the JSON object.`,
      },
    ],
  });

  const responseContent = completion.choices[0].message.content;
  let data;

  try {
    data = JSON.parse(responseContent);
  } catch (e) {
    console.error("CRITICAL: Failed to parse AI response even with JSON mode. Response:", responseContent);
    // If parsing fails, which is unlikely in JSON mode, fallback to a safe structure.
    data = { detailedReport: "Error: Could not generate report.", links: [], images: [], videos: [] };
  }

  return {
    topic,
    detailedReport: data.detailedReport || "",
    links: data.links || [],
    images: data.images || [],
    videos: data.videos || [],
  };
}

module.exports = { searchAndScrape };

