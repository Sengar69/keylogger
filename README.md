# Made by Apex Forge (Prashant , Shubham,Madhav)

# Keystroke Sentiment Analysis Dashboard

This project combines a keylogger with sentiment analysis and displays the data through an interactive dashboard.

## Components

1. **Keylogger**: Captures keyboard input and sends data to the server
2. **Flask Server**: Processes and stores the keystroke data
3. **React Dashboard**: Visualizes the keystroke data with sentiment analysis and geographical information

## Setup Instructions

### Prerequisites

- Python 3.7+ for the keylogger and server
- Node.js and npm/bun for the React dashboard

### Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd keystroke-sentiment-vision
```

2. Install Python dependencies:
```bash
pip install flask flask-cors pynput requests textblob
python -m textblob.download_corpora
```

3. Install JavaScript dependencies:
```bash
npm install
# or
bun install
```

### Running the Application

1. **Start the Flask server**:
```bash
python server.py
```
This will start the server at http://localhost:8080

2. **Build the React app** (for production):
```bash
npm run build
# or
bun run build
```

3. **Run the keylogger** (in a separate terminal):
```bash
python keylogger.py
```

For development, you can also run the React app separately:
```bash
npm run dev
# or
bun run dev
```

## Configuration

- **Keylogger Configuration**: Edit the `keylogger.py` file to change:
  - `ip_address` - The IP address of the server
  - `port_number` - The port the server is running on
  - `time_interval` - How often to send data (in seconds)

- **Server Configuration**: Edit the `server.py` file to change:
  - Port number (default: 8080)
  - Log file location

## Features

- Real-time keystroke logging with sentiment analysis
- Geographical data collection
- Interactive dashboard with:
  - Live keystroke logs
  - Sentiment analysis chart
  - Key frequency visualization
  - Geolocation data

## Security Notice

**IMPORTANT**: This application records keystrokes, which may include sensitive information like passwords. It should only be used:

1. On your own devices
2. For educational purposes
3. With full consent of all users of the device

## License {owners}

[MIT License](LICENSE)
# keystroke-sentiment-vision-main
