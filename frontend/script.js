
const API_URL = "/api/chat";
const MODEL = "qwen2.5:1.5b";

let messages = [];

const chat = document.getElementById("chat");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");

// Add message to chat
function addMessage(role, content, extraClass = "") {

    const welcome = document.getElementById("welcome");

    if (welcome) welcome.remove();

    const message = document.createElement("div");

    message.className = `message ${role} ${extraClass}`;
    message.textContent = content;

    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;

    return message;
}

// Send message with streaming
async function sendMessage() {

    const text = promptInput.value.trim();

    if (!text || sendBtn.disabled) return;

    addMessage("user", text);

    messages.push({
        role: "user",
        content: text
    });

    promptInput.value = "";
    promptInput.style.height = "auto";

    sendBtn.disabled = true;
    sendBtn.textContent = "...";

    const loading = addMessage(
        "assistant",
        "Thinking...",
        "typing"
    );

    let reply = "";

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                model: MODEL,
                messages: messages,
                stream: true
            })
        });

        if (!response.ok) {
            throw new Error(
                await response.text() ||
                `API Error: ${response.status}`
            );
        }

        if (!response.body) {
            throw new Error("Streaming not supported.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let buffer = "";
        let finished = false;

        function processLine(line) {

            if (!line.trim()) return;

            const data = JSON.parse(line);

            if (data.error) {
                throw new Error(data.error);
            }

            const content = data.message?.content || "";

            if (content) {

                reply += content;

                loading.classList.remove("typing");
                loading.textContent = reply;

                chat.scrollTop = chat.scrollHeight;
            }

            if (data.done) {
                finished = true;
            }
        }

        while (!finished) {

            const { value, done } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, {
                stream: true
            });

            const lines = buffer.split("\n");

            buffer = lines.pop();

            for (const line of lines) {

                processLine(line);

                if (finished) break;
            }
        }

        buffer += decoder.decode();

        if (buffer.trim()) {
            processLine(buffer);
        }

        if (!reply) {
            throw new Error("Empty response from model.");
        }

        messages.push({
            role: "assistant",
            content: reply
        });

    } catch (error) {

        console.error("Chat error:", error);

        loading.classList.remove("typing");

        if (reply) {

            loading.textContent += "\n[Stream interrupted]";

            messages.push({
                role: "assistant",
                content: reply
            });

        } else {

            loading.remove();
            messages.pop();

            addMessage(
                "assistant",
                "Error: " + error.message,
                "error"
            );
        }

    } finally {

        sendBtn.disabled = false;
        sendBtn.textContent = "Send ↑";

        promptInput.focus();
    }
}

// Clear conversation
function clearChat() {

    messages = [];

    chat.innerHTML = `
        <div class="welcome" id="welcome">
            <h1>How can I help you?</h1>
            <p>Chat with Qwen 2.5 AI</p>
        </div>
    `;
}

// Button events
sendBtn.addEventListener("click", sendMessage);

clearBtn.addEventListener("click", clearChat);

// Enter to send, Shift + Enter for newline
promptInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();
    }
});

// Auto resize textarea
promptInput.addEventListener("input", function() {

    this.style.height = "auto";

    this.style.height =
        Math.min(this.scrollHeight, 130) + "px";
});
