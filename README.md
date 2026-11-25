# Cloud AI Chat

A lightweight, self-hosted browser chat interface for a language model running locally with [Ollama](https://ollama.com/). An Express server proxies chat requests to Ollama and streams generated responses back to the browser.

## Features

- Chat with a locally hosted language model from a browser.
- Stream responses as they are generated.
- Maintain conversation context during the current page session.
- Stop an in-progress response and clear the current conversation.
- Optionally expose the local application through a Cloudflare Tunnel.

## Architecture

```text
Browser UI
   |
   v
Express server (port 8080)
   |
   v
Ollama API (127.0.0.1:11434)
   |
   v
Qwen 2.5 1.5B
```

The frontend sends messages to the Express endpoint at `/api/chat`. The server forwards requests to Ollama and streams the response to the browser.

## Prerequisites

Before setting up the project, make sure you have:

- **Operating system:** Linux (recommended for the included Bash scripts).
- **Docker:** Docker Engine installed and running. The setup script uses Docker to run Ollama.
- **Node.js:** Version 18 or later.
- **npm:** Installed with Node.js, for installing the frontend dependencies.
- **Internet connection:** Required to download the Ollama Docker image and the Qwen model during initial setup.
- **Available ports:** TCP ports `8080` (web application) and `11434` (Ollama API) should be available.
- **Hardware:** A machine capable of running the selected Ollama model. Model performance and memory requirements depend on your hardware; consult the [Ollama model library](https://ollama.com/library) for model-specific information.

You can verify the main tools are installed with:

```bash
docker --version
docker info
node --version
npm --version
```

The supplied shell scripts target Linux/Bash. On Windows, use WSL2 with Docker support or adapt the scripts for your environment.

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/harsh12chauhan/Cloud-AI-Chat.git
cd Cloud-AI-Chat
```

### 2. Start Ollama and download the model

The setup script creates a persistent Docker volume, starts an Ollama container, and downloads the configured model:

```bash
chmod +x setup-ollama.sh
./setup-ollama.sh
```

The frontend currently uses `qwen2.5:1.5b`. If you run Ollama separately, ensure that its API is available at `http://127.0.0.1:11434` and that this model is installed.

### 3. Install Node.js dependencies

```bash
cd frontend
npm install
```

### 4. Run the application

From the `frontend` directory:

```bash
node server.js
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Optional: Cloudflare Tunnel

To create a public tunnel to the local web server, run the helper script from the repository root:

```bash
chmod +x public-url.sh
./public-url.sh
```

**Security warning:** The application currently has no authentication or access control. Anyone with access to a public tunnel URL may be able to use the chat application. Do not expose it publicly with sensitive information; stop the tunnel when it is no longer needed.

## Configuration

The current settings are defined in the source:

| Setting | Default | File |
| --- | --- | --- |
| Web server port | `8080` | `frontend/server.js` |
| Ollama API | `http://127.0.0.1:11434/api/chat` | `frontend/server.js` |
| Model | `qwen2.5:1.5b` | `frontend/script.js` |

Update the relevant source file if you need to change these values.

## Project structure

```text
Cloud-AI-Chat/
├── frontend/
│   ├── index.html       # Chat page
│   ├── style.css        # Chat interface styles
│   ├── script.js        # Browser-side chat logic
│   ├── server.js        # Express server and Ollama proxy
│   └── package.json     # Node.js dependencies
├── setup-ollama.sh      # Starts Ollama and pulls the model
├── public-url.sh        # Starts an optional Cloudflare Tunnel
├── run.sh               # Convenience launcher
├── LICENSE              # MIT License
└── .gitignore
```

## Limitations

- Chat history is kept in browser memory and is not persisted to a database.
- Model and service URLs are configured in source code.
- The helper scripts target Linux/Bash. The included `run.sh` assumes the project is located at `~/ai-chat`; if it is elsewhere, start the server manually using the command above or adjust the script.
- There is currently no login or user access management.

## Contributing

Bug reports, suggestions, and pull requests are welcome. For substantial changes, consider opening an issue to discuss the proposal first.

## License

This project is licensed under the [MIT License](LICENSE).

## Author

Created by [Harsh Chauhan](https://github.com/harsh12chauhan).
