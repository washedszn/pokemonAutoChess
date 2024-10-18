#!/bin/sh

# Install dependencies
echo "Installing node modules..."
npm install

# Postinstall steps (since it's missing in the current branch)
echo "Running postinstall steps..."
npm run download-music && cd edit/assetpack && npm install

# Run asset pack
echo "Building assets..."
npm run assetpack

# Build the project
echo "Building the project..."
cd /app && npm run build

# Copy assets to the mounted volume directory
echo "Copying assets to the mounted volume..."
cp -r /app/app/public/dist/client /mnt/assets

# Sync the MongoDB with the latest data
echo "Running initial MongoDB data sync..."
node /app/syncDatabase.js &

# Start the application
echo "Starting the application..."
cd /app && npm run start