let conversationHistory = [{"role": "system", "content": "You are an helpful assistant. Use proper html list format, tables, code snippets, etc. wherever necessary instead of plain text."}];

async function sendMessage() {
    var userInput = document.getElementById('userInput');
    var chatBox = document.getElementById('chatBox');

    // Get user input
    var userMessage = userInput.value.trim();

    if (userMessage !== '') {
        // Display user message in the chat box
        chatBox.innerHTML += '<div class="message user-message">' + userMessage + '</div>';

        // Clear the input field
        userInput.value = '';

        // Simulate a simple chatbot response
        var botMessage = await getChatbotReply(userMessage);
        chatBox.innerHTML += '<div class="message bot-message">' + botMessage + '</div>';

        // Scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function startSpeechRecognition() {
    window.SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        document.getElementById('userInput').value = transcript;
    });
    recognition.start();
}

async function getChatbotReply(userMessage) {
    // This is a simple example; you can replace it with a more sophisticated logic
    const apiKey = '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'; // Replace with your actual API key
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    conversationHistory.push({ role: 'user', content: userMessage });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: conversationHistory,
            max_tokens: 100
        }),
    };

    const response = await fetch(apiUrl, requestOptions);
    const responseData = await response.json();

    conversationHistory.push({ role: 'assistant', content: responseData.choices[0].message.content });

    return responseData.choices[0].message.content;
}

function handleKeyDown(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}