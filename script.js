let chatHistory = JSON.parse(localStorage.getItem("mindai_chat")) || [];
let modelType = "normal";

function login() {
  const name = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  if (!name || !pass) return alert("Enter name and password");
  
  localStorage.setItem("mindai_user", name);
  localStorage.setItem("mindai_pass", pass);
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("chat-section").classList.remove("hidden");
  document.getElementById("userDisplay").innerText = `👤 ${name}`;
  loadHistory();
}

function subscribeUser() {
  localStorage.setItem("mindai_sub", "true");
  alert("Subscribed! You can now use Pro model.");
}

function verifyUser() {
  const sub = localStorage.getItem("mindai_sub");
  if (sub === "true") {
    alert("Verified as Pro user ✅");
  } else {
    alert("You're not subscribed ❌");
  }
}

function toggleModel() {
  modelType = modelType === "normal" ? "pro" : "normal";
  document.getElementById("modelButton").innerText = `Model: ${modelType.charAt(0).toUpperCase() + modelType.slice(1)}`;
}

function loadHistory() {
  const chatbox = document.getElementById("chatbox");
  chatbox.innerHTML = "";
  chatHistory.forEach(msg => {
    addToChat(msg.role === "user" ? "You" : "Mind Ai", msg.content, msg.role);
  });
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

  const res = await fetch("https://mind-ai-bot.glitch.me/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: chatHistory,
      model: modelType
    })
  });

  const data = await res.json();
  const reply = data.reply;
  chatHistory.push({ role: "assistant", content: reply });
  localStorage.setItem("mindai_chat", JSON.stringify(chatHistory));
  addToChat("Mind Ai", reply, "bot");
  document.getElementById("typing").style.display = "none";
}

function usePrompt(text) {
  document.getElementById("userInput").value = text;
}

function addToChat(sender, text, type) {
  const chatbox = document.getElementById("chatbox");
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.textContent = text;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}
