const API_KEY = "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";
let MODEL = "llama3-8b-8192";
let chatHistory = JSON.parse(localStorage.getItem("mindai_chat")) || [];

document.getElementById("brand").addEventListener("click", () => {
  const menu = document.getElementById("model-dropdown");
  menu.classList.toggle("hidden");
});

function subscribeAlert() {
  alert("To unlock Pro, subscribe to:\nwww.youtube.com/@MindAI-Shorts10");
}

function subscribeNow(e) {
  e.stopPropagation();
  window.open("https://www.youtube.com/@MindAI-Shorts10", "_blank");
}

function setModel(type) {
  MODEL = "llama3-8b-8192"; // Both are same for now
  const options = document.querySelectorAll('.model-option');
  options.forEach(opt => opt.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  document.getElementById("model-dropdown").classList.add("hidden");
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  addToChat("You", message, "user");
  chatHistory.push({ role: "user", content: message });
  input.value = "";
  localStorage.setItem("mindai_chat", JSON.stringify(chatHistory));
  document.getElementById("typing").style.display = "block";

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: chatHistory
      })
    });

    const data = await res.json();
    const reply = data.choices[0].message.content;
    chatHistory.push({ role: "assistant", content: reply });
    localStorage.setItem("mindai_chat", JSON.stringify(chatHistory));
    addToChat("Mind Ai", reply, "bot");
  } catch (err) {
    addToChat("Mind Ai", "⚠️ Error reaching the server. Try again.", "bot");
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
