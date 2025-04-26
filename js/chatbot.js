// Global variables
let currentLanguage = 'ar';
let responses = {};
let isWaitingForEmail = false;

// DOM Elements
const chatButton = document.getElementById('chat-button');
const chatContainer = document.getElementById('chat-container');
const minimizeBtn = document.getElementById('minimize-btn');
const closeBtn = document.getElementById('close-btn');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const arBtn = document.getElementById('ar-btn');
const frBtn = document.getElementById('fr-btn');

// Load responses from JSON file
async function loadResponses() {
    try {
        const response = await fetch('js/responses.json');
        responses = await response.json();
        console.log('Responses loaded successfully');
    } catch (error) {
        console.error('Error loading responses:', error);
        // Fallback responses in case the JSON file fails to load
        responses = {
            ar: {
                welcome: "مرحبًا بك في موقع جمعيتنا 👋 كيف يمكنني مساعدتك؟",
                options: ["أريد التبرع", "أبحث عن مساعدة", "أنشطة الجمعية", "الأسئلة الشائعة", "اتصل بنا"],
                fallback: "عذرًا، لم أفهم طلبك. هل يمكنك إعادة صياغته أو اختيار أحد الخيارات المتاحة؟"
            },
            fr: {
                welcome: "Bienvenue sur notre site associatif 👋 Comment puis-je vous aider ?",
                options: ["Je veux faire un don", "Je cherche une aide", "Activités de l'association", "FAQ", "Contactez-nous"],
                fallback: "Désolé, je n'ai pas compris votre demande. Pouvez-vous la reformuler ou choisir l'une des options disponibles ?"
            }
        };
    }
}

// Initialize the chatbot
async function initChatbot() {
    await loadResponses();
    
    // التحقق من اللغة المفضلة المخزنة
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
    
    // Event listeners
    chatButton.addEventListener('click', toggleChat);
    minimizeBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', closeChat);
    sendBtn.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });
    
    // Language switchers
    arBtn.addEventListener('click', () => switchLanguage('ar'));
    frBtn.addEventListener('click', () => switchLanguage('fr'));
    
    // تحديث واجهة الشات بوت بناءً على اللغة الحالية
    if (currentLanguage === 'fr') {
        document.documentElement.setAttribute('lang', 'fr');
        document.documentElement.setAttribute('dir', 'ltr');
        frBtn.classList.add('active');
        arBtn.classList.remove('active');
        userInput.placeholder = 'Tapez votre message ici...';
        document.querySelector('.chat-title').textContent = 'Assistant Virtuel';
    }
    
    // Send welcome message after a short delay
    setTimeout(() => {
        sendBotMessage(responses[currentLanguage].welcome);
        showOptions(responses[currentLanguage].options);
    }, 500);
}

// Toggle chat open/close
function toggleChat() {
    chatContainer.classList.toggle('chat-closed');
    if (!chatContainer.classList.contains('chat-closed')) {
        userInput.focus();
    }
}

// Close chat
function closeChat() {
    chatContainer.classList.add('chat-closed');
}

// تعديل وظيفة switchLanguage لجعلها متاحة عالمياً
function switchLanguage(lang) {
    if (lang === currentLanguage) return;
    
    currentLanguage = lang;
    
    // Update UI language
    if (lang === 'ar') {
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.setAttribute('dir', 'rtl');
        arBtn.classList.add('active');
        frBtn.classList.remove('active');
        userInput.placeholder = 'اكتب رسالتك هنا...';
        document.querySelector('.chat-title').textContent = 'المساعد الافتراضي';
    } else {
        document.documentElement.setAttribute('lang', 'fr');
        document.documentElement.setAttribute('dir', 'ltr');
        frBtn.classList.add('active');
        arBtn.classList.remove('active');
        userInput.placeholder = 'Tapez votre message ici...';
        document.querySelector('.chat-title').textContent = 'Assistant Virtuel';
    }
    
    // Clear chat and restart conversation
    chatMessages.innerHTML = '';
    sendBotMessage(responses[currentLanguage].welcome);
    showOptions(responses[currentLanguage].options);
}

// جعل الوظيفة متاحة عالمياً
window.switchChatbotLanguage = switchLanguage;

// Send a bot message to the chat
function sendBotMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'bot-message');
    messageElement.innerHTML = message;
    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

// Send a user message to the chat
function sendUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user-message');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

// Show options as clickable buttons
function showOptions(options) {
    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option-button');
        button.textContent = option;
        button.addEventListener('click', () => {
            handleOptionClick(option);
        });
        optionsContainer.appendChild(button);
    });
    
    chatMessages.appendChild(optionsContainer);
    scrollToBottom();
}

// Handle user input from text field
function handleUserInput() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    sendUserMessage(message);
    userInput.value = '';
    
    // Check if waiting for email input
    if (isWaitingForEmail) {
        if (validateEmail(message)) {
            isWaitingForEmail = false;
            // Here you would typically save the email to your database
            // For now, we'll just acknowledge it
            sendBotMessage(responses[currentLanguage].email_thanks);
            setTimeout(() => {
                showOptions(responses[currentLanguage].options);
            }, 1000);
        } else {
            sendBotMessage(currentLanguage === 'ar' ? 
                "يرجى إدخال بريد إلكتروني صالح." : 
                "Veuillez entrer une adresse email valide.");
        }
        return;
    }
    
    // Process the message
    processUserMessage(message);
}

// Handle option button clicks
function handleOptionClick(option) {
    sendUserMessage(option);
    processUserMessage(option);
}

// Process user messages and provide appropriate responses
function processUserMessage(message) {
    const lang = currentLanguage;
    const r = responses[lang];
    
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Main menu options
    if (r.options.includes(message)) {
        switch(r.options.indexOf(message)) {
            case 0: // Donate
                sendBotMessage(r.donate.text);
                showOptions(r.donate.options);
                break;
            case 1: // Help
                sendBotMessage(r.help.text);
                showOptions(r.help.options);
                break;
            case 2: // Activities
                sendBotMessage(r.activities.text);
                showOptions(r.activities.options);
                break;
            case 3: // FAQ
                sendBotMessage(r.faq.text);
                showOptions(r.faq.options);
                break;
            case 4: // Contact
                sendBotMessage(r.contact.text);
                showOptions(r.contact.options);
                break;
        }
        return;
    }
    
    // Donation options
    if (r.donate.options.includes(message)) {
        switch(r.donate.options.indexOf(message)) {
            case 0: // Online donation
                sendBotMessage(r.online_donation);
                break;
            case 1: // Bank transfer
                sendBotMessage(r.bank_donation);
                break;
            case 2: // In-kind donation
                sendBotMessage(r.in_kind_donation);
                break;
        }
        setTimeout(() => {
            showOptions(r.options);
        }, 2000);
        return;
    }
    
    // Help options
    if (r.help.options.includes(message)) {
        switch(r.help.options.indexOf(message)) {
            case 0: // Financial help
                sendBotMessage(r.financial_help);
                break;
            case 1: // Medical help
                sendBotMessage(r.medical_help);
                break;
            case 2: // Legal help
                sendBotMessage(r.legal_help);
                break;
            case 3: // Educational help
                sendBotMessage(r.educational_help);
                break;
        }
        setTimeout(() => {
            showOptions(r.options);
        }, 2000);
        return;
    }
    
    // Activities options
    if (r.activities.options.includes(message)) {
        switch(r.activities.options.indexOf(message)) {
            case 0: // Upcoming events
                sendBotMessage(r.upcoming_events);
                break;
            case 1: // Workshops
                sendBotMessage(r.workshops);
                break;
            case 2: // Awareness campaigns
                sendBotMessage(r.awareness_campaigns);
                break;
            case 3: // Summer camps
                sendBotMessage(r.summer_camps);
                break;
        }
        setTimeout(() => {
            showOptions(r.options);
        }, 2000);
        return;
    }
    
    // FAQ options
    if (r.faq.options.includes(message)) {
        switch(r.faq.options.indexOf(message)) {
            case 0: // Join association
                sendBotMessage(r.join_association);
                break;
            case 1: // Working hours
                sendBotMessage(r.working_hours);
                break;
            case 2: // Volunteer
                sendBotMessage(r.volunteer);
                break;
            case 3: // Donations usage
                sendBotMessage(r.donations_usage);
                break;
        }
        setTimeout(() => {
            showOptions(r.options);
        }, 2000);
        return;
    }
    
    // Contact options
    if (r.contact.options.includes(message)) {
        switch(r.contact.options.indexOf(message)) {
            case 0: // Email
                sendBotMessage(r.email_contact);
                // Ask for user's email for newsletter
                setTimeout(() => {
                    sendBotMessage(r.email_collection);
                    isWaitingForEmail = true;
                }, 1000);
                return;
            case 1: // Phone
                sendBotMessage(r.phone_contact);
                break;
            case 2: // Visit headquarters
                sendBotMessage(r.visit_headquarters);
                break;
            case 3: // Social media
                sendBotMessage(r.social_media);
                break;
        }
        if (r.contact.options.indexOf(message) !== 0) { // If not email option
            setTimeout(() => {
                showOptions(r.options);
            }, 2000);
        }
        return;
    }
    
    // If no specific match, try to find keywords in the message
    if (containsKeyword(lowerMessage, ['تبرع', 'don', 'donate', 'donation'])) {
        sendBotMessage(r.donate.text);
        showOptions(r.donate.options);
        return;
    }
    
    if (containsKeyword(lowerMessage, ['مساعدة', 'aide', 'help', 'assist'])) {
        sendBotMessage(r.help.text);
        showOptions(r.help.options);
        return;
    }
    
    if (containsKeyword(lowerMessage, ['نشاط', 'فعالية', 'activité', 'activity', 'event'])) {
        sendBotMessage(r.activities.text);
        showOptions(r.activities.options);
        return;
    }
    
    if (containsKeyword(lowerMessage, ['سؤال', 'question', 'faq'])) {
        sendBotMessage(r.faq.text);
        showOptions(r.faq.options);
        return;
    }
    
    if (containsKeyword(lowerMessage, ['اتصال', 'contact', 'تواصل'])) {
        sendBotMessage(r.contact.text);
        showOptions(r.contact.options);
        return;
    }
    
    // If we get here, we didn't understand the message
    sendBotMessage(r.fallback);
    setTimeout(() => {
        showOptions(r.options);
    }, 1000);
}

// Helper function to check if message contains any of the keywords
function containsKeyword(message, keywords) {
    return keywords.some(keyword => message.includes(keyword));
}

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Scroll chat to bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialize the chatbot when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initChatbot);

