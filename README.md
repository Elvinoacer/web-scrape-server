# Puppeteer Web Scraping

This project uses Puppeteer and Cheerio to scrape websites.

## Installation

1. Clone the repository.
2. Run `npm install` to install the dependencies.

## Usage

### Generic Scraper

To run the generic scraper, use the following command:

```
node index.js [--no-headless] <url> <selector1> [<selector2>...]
```

- `[--no-headless]`: Optional flag to run the browser in non-headless mode for debugging.
- `<url>`: The URL of the website to scrape.
- `<selector1>`, `<selector2>`, etc.: The CSS selectors of the elements to scrape.

### Example

```
node index.js https://example.com title h1
```

This will scrape the title and the h1 element from example.com and print the result to the console.

### The Verge Scraper

To scrape articles from The Verge for a specific topic, use the following command:

```
node verge-scraper.js <topic>
```

- `<topic>`: The topic to search for on The Verge.

### Example

```
node verge-scraper.js technology
```

This will scrape the titles, links, and bodies of articles related to technology from The Verge and print the result to the console in JSON format.
