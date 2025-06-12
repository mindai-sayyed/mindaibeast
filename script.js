const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');
const promptButtons = document.querySelectorAll('.prompt-btn');

const BACKEND_URL = 'https://mindai-backend.sayyedfaeez93.workers.dev/';

function appendMessage(message, className) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    msgDiv.textContent = message;
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage(message) {
    appendMessage(message, 'user');

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error('Server error');
        }

        const data = await response.json();
        appendMessage(data.reply || 'No reply from AI.', 'bot');
    } catch (err) {
        appendMessage('⚠️ Error: ' + err.message, 'bot');
    }
}

sendButton.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
        sendMessage(message);
        userInput.value = '';
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});

promptButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        userInput.value = btn.textContent;
        sendButton.click();
    });
});
