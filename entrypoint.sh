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

# run asset pack
echo "Building assets..."
npm run assetpack

# Start the application
echo "Starting the application..."
exec node ./app/public/dist/server/app/index.js
