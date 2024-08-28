#!/bin/sh

# Build the project
echo "Building the project..."
npm run build

# run asset pack
echo "Building assets..."
npm run assetpack

# Start the application
echo "Starting the application..."
exec node ./app/public/dist/server/app/index.js
