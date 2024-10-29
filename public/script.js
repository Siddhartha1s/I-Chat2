const socket = io();
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message');
const usernameInput = document.getElementById('username');
const sendButton = document.getElementById('send');

let currentUserId = null; // Store current user's socket ID

socket.on('connect', () => {
    currentUserId = socket.id;
});

function addMessage(data) {
    const messageDiv = document.createElement('div');
    const isSentMessage = data.senderId === currentUserId;
    
    messageDiv.className = `message ${isSentMessage ? 'sent' : ''}`;
    
    messageDiv.innerHTML = `
        <div class="message-content">
            ${data.message}
            <div class="message-info">
                ${isSentMessage ? `
                    <span class="message-status">
                        <i class="fas fa-check-double"></i>
                    </span>
                ` : `
                    <i class="fas fa-user-circle"></i>
                `}
                <span>${isSentMessage ? 'You' : data.username}</span>
                <span>•</span>
                <span>${data.timestamp}</span>
            </div>
        </div>
    `;
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Add entrance animation
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = `translateX(${isSentMessage ? '20px' : '-20px'})`;
    
    requestAnimationFrame(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateX(0)';
    });
}

function sendMessage() {
    const message = messageInput.value.trim();
    const username = usernameInput.value.trim() || 'Anonymous';
    
    if (message) {
        // Add sending animation to button
        sendButton.style.transform = 'scale(0.8) rotate(20deg)';
        setTimeout(() => {
            sendButton.style.transform = 'scale(1) rotate(0)';
        }, 200);

        socket.emit('chat message', { message, username });
        messageInput.value = '';
    }
}

// Input animations
[messageInput, usernameInput].forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
});

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

socket.on('chat message', (data) => {
    addMessage(data);
});

// Generate some sample messages for demonstration
setTimeout(() => {
    addMessage({
        message: "👋 Welcome to the chat!",
        username: "System",
        timestamp: new Date().toLocaleTimeString(),
        senderId: "system"
    });
}, 1000);