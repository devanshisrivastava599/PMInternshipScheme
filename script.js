// Global variables
let currentLanguage = 'en';
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
let recognition;
let synthesis = window.speechSynthesis;

// Sample internship data
const internships = {
    en: [
        {
            title: "Data Analyst - Ministry of Education",
            eligibility: "B.Tech/M.Tech in CS/IT",
            duration: "6 months",
            stipend: "₹15,000/month",
            description: "Analyze educational data and create insights"
        },
        {
            title: "Policy Research - NITI Aayog",
            eligibility: "MBA/MA in Economics",
            duration: "8 months", 
            stipend: "₹20,000/month",
            description: "Research and draft policy recommendations"
        },
        {
            title: "Digital Marketing - Ministry of Tourism",
            eligibility: "BBA/MBA Marketing",
            duration: "4 months",
            stipend: "₹12,000/month",
            description: "Promote tourism through digital channels"
        },
        {
            title: "Software Developer - Ministry of Electronics & IT",
            eligibility: "B.Tech/M.Tech CS/IT",
            duration: "12 months",
            stipend: "₹25,000/month",
            description: "Develop government digital solutions"
        },
        {
            title: "Financial Analyst - Ministry of Finance",
            eligibility: "B.Com/M.Com/MBA Finance",
            duration: "6 months",
            stipend: "₹18,000/month",
            description: "Analyze budget and financial policies"
        },
        {
            title: "Content Writer - Ministry of Information",
            eligibility: "BA/MA English/Journalism",
            duration: "3 months",
            stipend: "₹10,000/month",
            description: "Create content for government communications"
        }
    ],
    hi: [
        {
            title: "डेटा विश्लेषक - शिक्षा मंत्रालय",
            eligibility: "बी.टेक/एम.टेक सीएस/आईटी",
            duration: "6 महीने",
            stipend: "₹15,000/माह",
            description: "शैक्षिक डेटा का विश्लेषण और अंतर्दृष्टि बनाना"
        },
        {
            title: "नीति अनुसंधान - नीति आयोग",
            eligibility: "एमबीए/एमए अर्थशास्त्र",
            duration: "8 महीने",
            stipend: "₹20,000/माह",
            description: "नीति सिफारिशों का अनुसंधान और मसौदा तैयार करना"
        },
        {
            title: "डिजिटल मार्केटिंग - पर्यटन मंत्रालय",
            eligibility: "बीबीए/एमबीए मार्केटिंग",
            duration: "4 महीने",
            stipend: "₹12,000/माह",
            description: "डिजिटल चैनलों के माध्यम से पर्यटन को बढ़ावा देना"
        }
    ]
};

// Chatbot responses
const botResponses = {
    en: {
        eligibility: "For PM Internship Scheme, you need to be a graduate/post-graduate from a recognized university with minimum 60% marks. Age limit is 21-24 years.",
        documents: "Required documents: Degree certificate, Mark sheets, Aadhaar card, Bank details, Passport size photo, and Resume.",
        deadline: "Applications are accepted throughout the year. Each internship has specific deadlines mentioned in the posting.",
        btech_cse: "Great! For B.Tech CSE students, I recommend: Data Analyst positions, Software Developer roles, and Digital Marketing internships. These match your technical background.",
        mba: "For MBA students, consider: Policy Research at NITI Aayog, Financial Analyst roles, and Management positions in various ministries.",
        default: "I can help you with eligibility criteria, required documents, application deadlines, and internship recommendations. What would you like to know?"
    },
    hi: {
        eligibility: "पीएम इंटर्नशिप योजना के लिए, आपको मान्यता प्राप्त विश्वविद्यालय से न्यूनतम 60% अंकों के साथ स्नातक/स्नातकोत्तर होना चाहिए। आयु सीमा 21-24 वर्ष है।",
        documents: "आवश्यक दस्तावेज: डिग्री प्रमाणपत्र, अंक पत्र, आधार कार्ड, बैंक विवरण, पासपोर्ट साइज फोटो, और रिज्यूमे।",
        deadline: "आवेदन साल भर स्वीकार किए जाते हैं। प्रत्येक इंटर्नशिप की विशिष्ट समय सीमा पोस्टिंग में उल्लिखित है।",
        btech_cse: "बहुत बढ़िया! बी.टेक सीएसई छात्रों के लिए, मैं सुझाता हूं: डेटा विश्लेषक पद, सॉफ्टवेयर डेवलपर भूमिकाएं, और डिजिटल मार्केटिंग इंटर्नशिप।",
        mba: "एमबीए छात्रों के लिए, विचार करें: नीति आयोग में नीति अनुसंधान, वित्तीय विश्लेषक भूमिकाएं, और विभिन्न मंत्रालयों में प्रबंधन पद।",
        default: "मैं पात्रता मानदंड, आवश्यक दस्तावेज, आवेदन की समय सीमा, और इंटर्नशिप सिफारिशों में आपकी मदद कर सकता हूं। आप क्या जानना चाहेंगे?"
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadInternships();
    setupEventListeners();
    loadChatHistory();
    initSpeechRecognition();
    initializeAuth(); // Added here to initialize authentication
});

// Event listeners
function setupEventListeners() {
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    document.getElementById('languageToggle').addEventListener('change', changeLanguage);
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    document.getElementById('mobileMenu').addEventListener('click', toggleMobileMenu);
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Dark mode functions
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
}
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
}

// Language functions
function changeLanguage() {
    currentLanguage = document.getElementById('languageToggle').value;
    updateLanguage();
    loadInternships();
    localStorage.setItem('language', currentLanguage);
}
function updateLanguage() {
    document.querySelectorAll('[data-en]').forEach(element => {
        const text = element.getAttribute(`data-${currentLanguage}`);
        if (text) {
            element.textContent = text;
        }
    });
}
const savedLanguage = localStorage.getItem('language');
if (savedLanguage) {
    currentLanguage = savedLanguage;
    document.getElementById('languageToggle').value = currentLanguage;
    updateLanguage();
}

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('mobile-open');
}

// Load internships
function loadInternships() {
    const grid = document.getElementById('internshipGrid');
    const internshipList = internships[currentLanguage];
    grid.innerHTML = internshipList.map(internship => `
        <div style="background: linear-gradient(135deg, #ffffff 0%, #fff5f0 50%, #ffede0 100%);" class="dark:bg-secondary p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <h3 class="text-lg font-semibold mb-3">${internship.title}</h3>
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                <div class="flex items-center">
                    <i class="fas fa-graduation-cap w-4 mr-2 text-primary"></i>
                    <span>${internship.eligibility}</span>
                </div>
                <div class="flex items-center">
                    <i class="fas fa-clock w-4 mr-2 text-primary"></i>
                    <span>${internship.duration}</span>
                </div>
                <div class="flex items-center">
                    <i class="fas fa-rupee-sign w-4 mr-2 text-primary"></i>
                    <span class="font-medium">${internship.stipend}</span>
                </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">${internship.description}</p>
            <button onclick="openApplicationModal('${internship.title}')" class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors text-sm font-medium" 
                    data-en="Apply Now" data-hi="अभी आवेदन करें">
                ${currentLanguage === 'en' ? 'Apply Now' : 'अभी आवेदन करें'}
            </button>
        </div>
    `).join('');
}

// Chatbot functions
function toggleChatbot() {
    const modal = document.getElementById('chatbotModal');
    modal.classList.toggle('hidden');
}
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    addMessage(message, 'user');
    setTimeout(() => {
        const response = generateBotResponse(message);
        addMessage(response, 'bot');
        speakText(response);
    }, 500);
    input.value = '';
    saveChatHistory();
}
function addMessage(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message mb-4`;
    const isUser = sender === 'user';
    if (isUser) {
        messageDiv.innerHTML = `
            <div class="flex justify-end">
                <div class="bg-gradient-to-r from-saffron to-lightOrange text-white p-4 rounded-2xl rounded-br-md shadow-lg max-w-xs ml-8">
                    <div class="flex items-start space-x-2">
                        <p class="text-sm leading-relaxed">${message}</p>
                        <i class="fas fa-user text-xs mt-1 opacity-70"></i>
                    </div>
                </div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="flex justify-start">
                <div class="bg-gradient-to-r from-white to-cream dark:from-gray-600 dark:to-gray-500 p-4 rounded-2xl rounded-bl-md shadow-lg border-l-4 border-emerald max-w-xs mr-8">
                    <div class="flex items-start space-x-3">
                        <i class="fas fa-robot text-emerald text-sm mt-1"></i>
                        <p class="text-sm leading-relaxed text-gray-800 dark:text-gray-200">${message}</p>
                    </div>
                </div>
            </div>
        `;
    }
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    chatHistory.push({ message, sender, timestamp: Date.now() });
}
function generateBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    const isHindi = /[ऀ-ॿ]/.test(message);
    const responseLanguage = isHindi ? 'hi' : 'en';
    const responses = botResponses[responseLanguage];
    if (lowerMessage.includes('eligibility') || lowerMessage.includes('पात्रता') || lowerMessage.includes('eligible') || lowerMessage.includes('योग्य')) {
        return responses.eligibility;
    } else if (lowerMessage.includes('document') || lowerMessage.includes('दस्तावेज') || lowerMessage.includes('paper') || lowerMessage.includes('कागज')) {
        return responses.documents;
    } else if (lowerMessage.includes('deadline') || lowerMessage.includes('समय सीमा') || lowerMessage.includes('last date') || lowerMessage.includes('अंतिम तिथि')) {
        return responses.deadline;
    } else if (lowerMessage.includes('b.tech') || lowerMessage.includes('btech') || lowerMessage.includes('cse') || lowerMessage.includes('computer') || lowerMessage.includes('बीटेक') || lowerMessage.includes('कंप्यूटर')) {
        return responses.btech_cse;
    } else if (lowerMessage.includes('mba') || lowerMessage.includes('management') || lowerMessage.includes('एमबीए') || lowerMessage.includes('प्रबंधन')) {
        return responses.mba;
    } else {
        return responses.default;
    }
}

// Speech recognition
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chatInput').value = transcript;
            setTimeout(() => {
                sendMessage();
            }, 500);
        };
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                alert('Please allow microphone access to use voice input.');
            }
        };
        recognition.onstart = function() {
            const micButton = document.querySelector('[onclick="startVoiceInput()"]');
            if (micButton) {
                micButton.innerHTML = '<i class="fas fa-stop text-red-500"></i>';
            }
        };
        recognition.onend = function() {
            const micButton = document.querySelector('[onclick="startVoiceInput()"]');
            if (micButton) {
                micButton.innerHTML = '<i class="fas fa-microphone"></i>';
            }
        };
    }
}
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Speech recognition not supported in this browser. Please use a modern browser like Chrome.');
        return;
    }
    if (!recognition) {
        initSpeechRecognition();
    }
    if (recognition) {
        recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        try {
            recognition.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            if (error.name === 'InvalidStateError') {
                alert('Voice input is already active. Please wait for it to finish.');
            } else {
                alert('Unable to start voice input. Please check your microphone permissions.');
            }
        }
    }
}
function speakText(text) {
    if (synthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8;
        synthesis.speak(utterance);
    }
}

// Chat history management
function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}
function loadChatHistory() {
    const messagesContainer = document.getElementById('chatMessages');
    const welcomeMessage = messagesContainer.querySelector('.bot-message');
    messagesContainer.innerHTML = '';
    if (welcomeMessage) {
        messagesContainer.appendChild(welcomeMessage);
    }
    const recentHistory = chatHistory.slice(-10);
    recentHistory.forEach(item => {
        if (item.sender !== 'bot' || item.message !== botResponses[currentLanguage].default) {
            addMessageToHistory(item.message, item.sender);
        }
    });
}
function addMessageToHistory(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message mb-4`;
    const isUser = sender === 'user';
    if (isUser) {
        messageDiv.innerHTML = `
            <div class="flex justify-end">
                <div class="bg-gradient-to-r from-saffron to-lightOrange text-white p-4 rounded-2xl rounded-br-md shadow-lg max-w-xs ml-8">
                    <div class="flex items-start space-x-2">
                        <p class="text-sm leading-relaxed">${message}</p>
                        <i class="fas fa-user text-xs mt-1 opacity-70"></i>
                    </div>
                </div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="flex justify-start">
                <div class="bg-gradient-to-r from-white to-cream dark:from-gray-600 dark:to-gray-500 p-4 rounded-2xl rounded-bl-md shadow-lg border-l-4 border-emerald max-w-xs mr-8">
                    <div class="flex items-start space-x-3">
                        <i class="fas fa-robot text-emerald text-sm mt-1"></i>
                        <p class="text-sm leading-relaxed text-gray-800 dark:text-gray-200">${message}</p>
                    </div>
                </div>
            </div>
        `;
    }
    messagesContainer.appendChild(messageDiv);
}

// Scroll to internships
function scrollToInternships() {
    document.getElementById('internships').scrollIntoView({ behavior: 'smooth' });
}

// Application modal functions
function openApplicationModal(internshipTitle) {
    document.getElementById('applicationModal').classList.remove('hidden');
    document.getElementById('applicationTitle').textContent = `Apply for: ${internshipTitle}`;
    document.body.style.overflow = 'hidden';
}
function closeApplicationModal() {
    document.getElementById('applicationModal').classList.add('hidden');
    document.getElementById('applicationForm').reset();
    document.body.style.overflow = 'auto';
}
function showSuccessNotification() {
    const notification = document.getElementById('successNotification');
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}
document.addEventListener('DOMContentLoaded', function() {
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            setTimeout(() => {
                closeApplicationModal();
                showSuccessNotification();
            }, 1000);
        });
    }
});

// Minimal CSS for clean design
const style = document.createElement('style');
style.textContent = `
    .streamlit-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
    }
`;
document.head.appendChild(style);

// ================================
// ✅ SUPABASE AUTHENTICATION CODE
// ================================
function initializeAuth() {
    const SUPABASE_URL = 'https://ntmbdrdlqwxhwcibzsed.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bWJkcmRscXd4aHdjaWJ6c2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzg3MjgsImV4cCI6MjA3MjY1NDcyOH0.jTCPll1xdX5EkWNnZlSqhi7B6a2rOwiOkLd9zWm';

    const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const authSwitch = document.getElementById('auth-switch');
    const logoutBtn = document.getElementById('logout-btn');
    const authButton = document.getElementById('auth-button');
    const authButtonText = document.getElementById('auth-button-text');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submit-btn');
    const messageDiv = document.getElementById('message');
    const userEmailSpan = document.getElementById('user-email');

    let isLogin = true;

    async function handleAuthChange() {
        const { data: { session } } = await supabase.auth.getSession();
        const heroSection = document.getElementById('home');
        const mainContent = document.querySelector('main');

        if (session) {
            authSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            authButtonText.textContent = 'Logout';
            heroSection.classList.add('hidden');
            mainContent.childNodes.forEach(node => {
                if (node.nodeType === 1 && node.id !== 'dashboard-section') {
                    node.classList.add('hidden');
                }
            });
            userEmailSpan.textContent = session.user.email;
        } else {
            authSection.classList.add('hidden');
            dashboardSection.classList.add('hidden');
            authButtonText.textContent = 'Login';
            heroSection.classList.remove('hidden');
            mainContent.childNodes.forEach(node => {
                if (node.nodeType === 1 && node.id !== 'auth-section' && node.id !== 'dashboard-section') {
                    node.classList.remove('hidden');
                }
            });
            emailInput.value = '';
            passwordInput.value = '';
        }
    }

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        messageDiv.textContent = '';
        const email = emailInput.value;
        const password = passwordInput.value;
        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) messageDiv.textContent = error.message;
        } else {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) messageDiv.textContent = error.message;
            else messageDiv.textContent = 'Check your email for confirmation link!';
        }
    });

    authSwitch.addEventListener('click', (e) => {
        e.preventDefault();
        isLogin = !isLogin;
        messageDiv.textContent = '';
        if (isLogin) {
            authTitle.textContent = 'Log In';
            submitBtn.textContent = 'Log In';
            authSwitch.textContent = "Don't have an account? Sign Up.";
        } else {
            authTitle.textContent = 'Sign Up';
            submitBtn.textContent = 'Sign Up';
            authSwitch.textContent = "Already have an account? Log In.";
        }
    });

    authButton.addEventListener('click', async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const { error } = await supabase.auth.signOut();
            if (error) console.error('Logout error:', error.message);
        } else {
            authSection.classList.remove('hidden');
            dashboardSection.classList.add('hidden');
            document.querySelector('main').childNodes.forEach(node => {
                if (node.nodeType === 1 && node.id !== 'auth-section') {
                    node.classList.add('hidden');
                }
            });
        }
    });

    logoutBtn.addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Logout error:', error.message);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
        handleAuthChange();
    });

    handleAuthChange();
}

