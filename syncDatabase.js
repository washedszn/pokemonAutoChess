const https = require('https');
const mongoose = require('mongoose');
const cron = require('cron');

// MongoDB setup
const mongoUri = process.env.MONGO_URI || "YOUR_MONGO_URI_HERE";
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Handle MongoDB connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Endpoints
const endpoints = {
  "pokemons-statistic-v2": "https://pokemon-auto-chess.com/meta/pokemons",
  "meta": "https://pokemon-auto-chess.com/meta",
  "items-statistic": "https://pokemon-auto-chess.com/meta/items"
};

// Helper function to fetch data from an HTTPS endpoint
const fetchData = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(`Error parsing JSON response from ${url}: ${error.message}`);
        }
      });
    }).on('error', (error) => {
      reject(`Error fetching data from ${url}: ${error.message}`);
    });
  });
};

// Function to update collections
const updateCollection = async (collectionName, url) => {
  try {
    const data = await fetchData(url);
    const collection = db.collection(collectionName);

    // Clear existing collection
    await collection.deleteMany({});

    // Insert new data
    if (Array.isArray(data)) {
      await collection.insertMany(data);
    } else {
      await collection.insertOne(data);
    }

    console.log(`[${new Date().toISOString()}] Successfully updated ${collectionName}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Failed to update ${collectionName}: ${error}`);
  }
};

// Main function to iterate over all collections
const main = async () => {
  for (const [collectionName, url] of Object.entries(endpoints)) {
    await updateCollection(collectionName, url);
  }
};

// Schedule the sync process every 12 hours using the cron module
const job = new cron.CronJob('0 */12 * * *', async () => {
  console.log(`[${new Date().toISOString()}] Starting scheduled sync...`);
  await main();
});

// Start the cron job
job.start();

// If you want to run it immediately as well
main();
