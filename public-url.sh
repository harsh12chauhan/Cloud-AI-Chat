#!/bin/bash

echo "Downloading Cloudflare Tunnel..."

curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared

chmod +x cloudflared

echo "Enter your local application URL:"
echo "1. Frontend (http://localhost:8080)"
echo "2. Backend API (http://localhost:11434/api/chat)"

read -p "Choose option (1 or 2 and 0 to exit): " choice

case "$choice" in
    1)	    
        URL="http://localhost:8080"
        ;;
    2)
        URL="http://localhost:11434"
        ;;
    0)
	 exit 1
	 ;;
    *)
        echo "Invalid choice. Using frontend URL."
        URL="http://localhost:8080"
        ;;	
esac

echo "Starting Cloudflare Tunnel for: $URL"

./cloudflared tunnel --no-autoupdate --url "$URL"  2>&1 \
  | grep --line-buffered -oE 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com'

#./cloudflared tunnel --url "$URL"
