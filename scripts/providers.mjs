import fs from 'fs'
import axios from 'axios'

const providerFilePath = './src/data/sources.json'
const updateFrequency = 7 * 24 * 60 * 60 * 1e3 // one week

/**
 * We cannot import the constants from TS files in mjs node scripts.
 */
const endpoints = { audio: 'audio', image: 'images' }

const needsUpdate = () => {
  const lastModified = fs.existsSync(providerFilePath) ?
  fs.statSync(providerFilePath).ctime : new Date(0)
  const timeSinceLastUpdate = Date.now() - lastModified

  return timeSinceLastUpdate > updateFrequency
}

/**
 * Always update for production, only update if the file is older than the update frequency in other environments.
 * @type {boolean}
 */
const shouldUpdate = process.env.CHECK_DATE ? needsUpdate() : true

async function updateProviderData() {
  const providerData = {}
  try {
    for (const [mediaType, endpoint] of Object.entries(endpoints)) {
      const resp = await axios.get(`https://api.openverse.engineering/v1/${endpoint}/stats`)
      providerData[mediaType] = resp.data
    }
    return providerData
  } catch (error) {
    throw new Error(`Failed to update provider data: ${error.message}`)
  }
}

try {
  if (shouldUpdate) {
    updateProviderData().then((providerData) => {
      fs.writeFileSync(providerFilePath, JSON.stringify(providerData, null, 2))
      console.log(`Wrote the updated provider data to ${providerFilePath}`)
    })
  }
} catch (error) {
  console.log(`The providers data is outdated, but there was an error during update: ${error}`)
}
