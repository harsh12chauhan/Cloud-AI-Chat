
#!/bin/bash

set -e

echo "Starting Ollama setup..."

docker volume create ollama_data

docker run -d \
  --name ollama \
  -p 11434:11434 \
  -v ollama_data:/root/.ollama \
  --restart unless-stopped \
  ollama/ollama

echo "ollama container up and running."

sleep 5

echo "Downloading Qwen model..."

docker exec -it ollama ollama pull qwen2.5:1.5b

echo "Ollama API is up and running\n"

#echo "Testing Ollama API..."

#curl -s http://localhost:11434/

#echo "running frontent node server"

#node server.js

#echo "node server running on port 8080"

#echo "Downloading Cloudflare Tunnel..."

#curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared

#chmod +x cloudflared

# echo "Starting Cloudflare Tunnel..."

# ./cloudflared tunnel --url http://localhost:11434

