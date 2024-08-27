# Use Node.js LTS as the base image
FROM node:20.16.0

# Set the working directory inside the container
WORKDIR /app

# Copy the entire project into the working directory
COPY . .

# Install project dependencies
RUN npm install

# Copy the entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose the port your app runs on
EXPOSE 3000

# Use the entrypoint script as the default command
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
