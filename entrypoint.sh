#!/bin/sh

# Build the project
echo "Building the project..."
npm run build

# Start the application
echo "Starting the application..."
exec node ./app/public/dist/server/app/index.js
