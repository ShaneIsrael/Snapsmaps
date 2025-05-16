const fs = require('node:fs')
const path = require('node:path')

const manifestTemplatePath = path.join(__dirname, '/manifest.template.json')
const manifestOutputPath = path.join(__dirname, '/app/build/manifest.json')

const template = fs.readFileSync(manifestTemplatePath, 'utf8')

const manifest = template
  .replace('${SITE_SHORT_NAME}', process.env.SHORT_NAME || 'Snapsmaps')
  .replace('${SITE_NAME}', process.env.NAME || 'Snapsmaps')
  .replace('${START_URL}', process.env.START_URL || 'https://mydomain.tld')
  .replace('${THEME_COLOR}', process.env.THEME_COLOR || '#020617')
  .replace('${BACKGROUND_COLOR}', process.env.BACKGROUND_COLOR || '#020617')
  .replace('${SCOPE}', process.env.SCOPE || 'https://mydomain.tld')
  .replace('${DESCRIPTION}', process.env.DESCRIPTION || 'Easily share photos with a map pin to friends and family.')
  .replace('${MANIFEST_ID}', process.env.ID || 'asdfasdfasdf')

fs.writeFileSync(manifestOutputPath, manifest, 'utf8')
console.log('Manifest generated successfully!')
