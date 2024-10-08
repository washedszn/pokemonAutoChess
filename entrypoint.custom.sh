#!/bin/sh

# Install deps
echo "Installing node modules..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Downloading music
echo "Downloading music..."
npm run download-music

# Run asset pack
echo "Building assets..."
npm run assetpack

# Sync the MongoDB with the latest data
echo "Running initial MongoDB data sync..."
node /app/syncDatabase.js &

# Start the application
echo "Starting the application..."
exec node ./app/public/dist/server/app/index.js
