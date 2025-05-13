const fs = require("fs");
const path = require("path");

// Load environment variables
const indexPath = path.join(__dirname, "/app/build/index.html");
const outputPath = path.join(__dirname, "/app/build/index.html");

// Read the index.html file
let indexHtml = fs.readFileSync(indexPath, "utf8");

// Replace meta tags with environment variables
indexHtml = indexHtml
  .replace(
    /<meta name="theme-color" content=".*?" \/>/,
    `<meta name="theme-color" content="${
      process.env.THEME_COLOR || "#020617"
    }" />`
  )
  .replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${
      process.env.DESCRIPTION ||
      "Easily share photos with a map pin to friends and family."
    }" />`
  )
  .replace(
    /<meta property="og:site_name" content=".*?" \/>/,
    `<meta property="og:site_name" content="${
      process.env.SITE_NAME || "Snapsmaps"
    }" />`
  )
  .replace(
    /<meta property="og:title" content=".*?" \/>/,
    `<meta property="og:title" content="${
      process.env.SITE_NAME || "Snapsmaps"
    }" />`
  )
  .replace(
    /<meta property="og:url" content=".*?" \/>/,
    `<meta property="og:url" content="${
      process.env.START_URL || "https://mydomain.tld"
    }" />`
  )
  .replace(
    /<meta property="og:description" content=".*?" \/>/,
    `<meta property="og:description" content="${
      process.env.DESCRIPTION ||
      "Easily share photos with a map pin to friends and family."
    }" />`
  )
  .replace(
    /<meta name="twitter:title" content=".*?" \/>/,
    `<meta name="twitter:title" content="${
      process.env.SITE_NAME || "Snapsmaps"
    }" />`
  )
  .replace(
    /<meta name="twitter:description" content=".*?" \/>/,
    `<meta name="twitter:description" content="${
      process.env.DESCRIPTION ||
      "Easily share photos with a map pin to friends and family."
    }" />`
  );

// Write the updated index.html back to the file
fs.writeFileSync(outputPath, indexHtml, "utf8");
console.log("Meta tags updated successfully!");
