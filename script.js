const BACKEND_URL = "https://mind-ai-bot.glitch.me/chat";
let chatHistory = JSON.parse(localStorage.getItem("mindai_chat")) || [];

function startChat() {
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("chat-section").classList.remove("hidden");
  loadHistory();
}

function loadHistory() {
  const chatbox = document.getElementById("chatbox");
  chatbox.innerHTML = "";
  chatHistory.forEach(msg => {
    addToChat(msg.role === "user" ? "You" : "Mind Ai", msg.content, msg.role);
  });
}

async function sendMessage(customPrompt = null) {
  const input = document.getElementById("userInput");
  let message = customPrompt || input.value.trim();
  if (!message) return;

  addToChat("You", message, "user");
  chatHistory.push({ role: "user", content: message });
  input.value = "";
  localStorage.setItem("mindai_chat", JSON.stringify(chatHistory));
  document.getElementById("typing").style.display = "block";

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages: chatHistory })
    });

    const data = await res.json();
    const reply = data.choices[0].message.content;

    chatHistory.push({ role: "assistant", content: reply });
    localStorage.setItem("mindai_chat", JSON.stringify(chatHistory));
    addToChat("Mind Ai", reply, "bot");
  } catch (err) {
    addToChat("Mind Ai", "❌ Error reaching backend. Please try again.", "bot");
  }

  document.getElementById("typing").style.display = "none";
}

function addToChat(sender, text, type) {
  const chatbox = document.getElementById("chatbox");
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.textContent = text;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}
function toggleAbout() {
  const aboutBox = document.getElementById("about-box");
  aboutBox.classList.toggle("hidden");
}

// Prompt templates (bottom button clicks)
document.querySelectorAll(".prompt-btn").forEach(button => {
  button.addEventListener("click", () => {
    const prompt = button.getAttribute("data-prompt");
    sendMessage(prompt);
  });
});
