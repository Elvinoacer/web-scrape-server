const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function scrapeTheVerge(topic) {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.theverge.com/search?q=${topic}`);

  const content = await page.content();
  const $ = cheerio.load(content);

  const links = [];
  $('h2.font-polysans a').each((_, element) => {
    const href = $(element).attr('href');
    if (href && href.startsWith('/')) {
      links.push(`https://www.theverge.com${href}`);
    }
  });

  const articles = [];
  for (const link of links) {
    await page.goto(link);
    const articleContent = await page.content();
    const $$ = cheerio.load(articleContent);
    const title = $$('h1').text();
    const body = $$('div.duet--article--article-body-component-container').text();
    articles.push({ title, link, body });
  }

  await browser.close();

  return articles;
}

module.exports = { scrapeTheVerge };