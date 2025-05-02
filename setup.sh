#!/bin/bash

echo "Setting up Keystroke Sentiment Analysis Dashboard..."

# Install Python dependencies
echo -e "\n[1/4] Installing Python dependencies..."
pip install -r requirements.txt
python -m textblob.download_corpora

# Install Node.js dependencies
echo -e "\n[2/4] Installing Node.js dependencies..."
npm install || bun install

# Build the React app
echo -e "\n[3/4] Building React app..."
npm run build || bun run build

echo -e "\n[4/4] Setup complete!"
echo "------------------------------------"
echo "To start the application:"
echo "1. Run the server: python server.py"
echo "2. In a separate terminal, run the keylogger: python keylogger.py"
echo "3. Access the dashboard at: http://localhost:8080"
echo "------------------------------------" 