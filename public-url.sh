echo "Downloading Cloudflare Tunnel..."

curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared

chmod +x cloudflared

echo "Starting Cloudflare Tunnel..."

./cloudflared tunnel --url http://localhost:8080
