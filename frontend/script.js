const chatBody = document.getElementById('chat-body');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

let isChatbotTyping = false;
let typingIntervalId = null;
let typingIndicatorMessage = 'Typing';

function createMessageElement(message, isUserMessage) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUserMessage ? 'message user-message' : 'message chatbot-message';

    const avatar = document.createElement('img');
    avatar.src = isUserMessage ? 'assets/user.png' : 'assets/boy.png';
    avatar.alt = isUserMessage ? 'User Avatar' : 'Chatbot Avatar';
    avatar.className = isUserMessage ? 'avatar user-avatar' : 'avatar chatbot-avatar';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerText = message;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);

    return messageDiv;
}

function displayUserMessage(message) {
    const userMessage = createMessageElement(message, true);
    chatBody.appendChild(userMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
    // Display the typing indicator after user's message
    displayTypingIndicator();
}

function displayChatbotMessage(message) {
    if (isChatbotTyping) {
        clearInterval(typingIntervalId);
        const typingIndicator = chatBody.querySelector('.typing-indicator');
        if (typingIndicator) {
            chatBody.removeChild(typingIndicator);
        }
        isChatbotTyping = false;
    } 

    const chatbotMessage = createMessageElement(message, false);
    chatBody.appendChild(chatbotMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function displayTypingIndicator() {
    if (!isChatbotTyping) {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message chatbot-message typing-indicator';
        
        const avatar = document.createElement('img');
        avatar.src = 'assets/boy.png';
        avatar.alt = 'Chatbot Avatar';
        avatar.className = 'avatar chatbot-avatar';

        typingIndicator.appendChild(avatar);
        typingIndicator.appendChild(document.createElement('div')).innerText = typingIndicatorMessage;

        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;
        isChatbotTyping = true;

        typingIntervalId = setInterval(() => {
            if (typingIndicatorMessage === 'Typing...') {
                typingIndicatorMessage = 'Typing';
            } else {
                typingIndicatorMessage += '.';
            }
            typingIndicator.children[1].innerText = typingIndicatorMessage;
        }, 400);
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') {
        return;
    }
    displayUserMessage(message);

    userInput.value = '';

    try {
        const response = await fetch('http://127.0.0.1:3000/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });

        if (!response.ok) {
            console.log(response.status);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const chatbotResponse = data.message;

        // Wait a bit before displaying the chatbot response
        setTimeout(() => {
            displayChatbotMessage(chatbotResponse);
        }, 1000);  // Adjust delay as needed

    } catch (error) {
        console.error('Error:', error);
    }
}

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

displayChatbotMessage("Hi, I'm a Chat Bot. What can I help you with today?");
