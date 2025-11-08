// Configuration
const API_URL = 'http://localhost:5000'; // Change this to your deployed backend URL

// State management
let isVoiceEnabled = true;
let isRecording = false;
let recognition = null;
let selectedVoice = null;
let availableVoices = [];
let currentUtterance = null;
let isPaused = false;
let speechQueue = [];
let recognitionLanguage = 'en-US'; // Default recognition language

// DOM Elements
const chatContainer = document.getElementById('chatContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const micButton = document.getElementById('micButton');
const voiceToggle = document.getElementById('voiceToggle');
const voiceSelector = document.getElementById('voiceSelector');
const voiceModal = document.getElementById('voiceModal');
const voiceList = document.getElementById('voiceList');
const closeModal = document.getElementById('closeModal');
const statusIndicator = document.getElementById('statusIndicator');

// Initialize Speech Recognition
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = recognitionLanguage; // Use selected language
        
        recognition.onstart = () => {
            isRecording = true;
            micButton.classList.add('recording');
            const langName = recognitionLanguage === 'hi-IN' ? 'Hindi' : 
                           recognitionLanguage === 'mr-IN' ? 'Marathi' : 'English';
            showStatus(`Listening in ${langName}...`, 'info');
            console.log('Speech recognition started with language:', recognitionLanguage);
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            messageInput.value = transcript;
            showStatus('Got it!', 'success');
            
            // Automatically send the message
            setTimeout(() => {
                sendMessage();
            }, 500);
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            
            // Handle different error types
            if (event.error === 'network') {
                showStatus('Network error - trying again...', 'info');
                // Auto-retry after a short delay
                setTimeout(() => {
                    if (!isRecording) {
                        recognition.start();
                    }
                }, 1000);
            } else if (event.error === 'no-speech') {
                showStatus('No speech detected. Please try again.', 'info');
            } else if (event.error === 'aborted') {
                showStatus('Speech recognition aborted', 'info');
            } else if (event.error === 'not-allowed') {
                showStatus('Microphone access denied. Please allow microphone permissions.', 'error');
                micButton.disabled = true;
                micButton.style.opacity = '0.5';
            } else {
                showStatus(`Error: ${event.error}`, 'error');
            }
            
            isRecording = false;
            micButton.classList.remove('recording');
        };
        
        recognition.onend = () => {
            isRecording = false;
            micButton.classList.remove('recording');
        };
        
        return true;
    } else {
        console.warn('Speech recognition not supported');
        showStatus('Voice input not supported in this browser', 'error');
        return false;
    }
}

// Clean text for speech (remove emojis, special chars, keep only sentences)
function cleanTextForSpeech(text) {
    // Remove emojis and special unicode characters
    let cleaned = text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
    
    // Remove markdown formatting
    cleaned = cleaned.replace(/[*_~`#]/g, '');
    
    // Remove URLs
    cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '');
    
    // Remove HTML tags but keep the content
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    
    // Add natural pauses for better speech
    cleaned = cleaned.replace(/\. /g, '. ... '); // Pause after sentences
    cleaned = cleaned.replace(/: /g, ': ... '); // Pause after colons
    cleaned = cleaned.replace(/\n/g, ' ... '); // Pause at line breaks
    
    // Remove bullet points and numbers but keep content
    cleaned = cleaned.replace(/^\s*[\d•\-\*]+[\.\)]\s*/gm, '');
    
    // Remove extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // Remove "Sources:" section from speech
    cleaned = cleaned.replace(/Sources:.*$/i, '');
    
    return cleaned;
}

// Text-to-Speech with female voice and pause/resume support
function speak(text) {
    if (!isVoiceEnabled) return;
    
    if ('speechSynthesis' in window) {
        // Clean the text before speaking
        const cleanedText = cleanTextForSpeech(text);
        
        if (!cleanedText) return; // Don't speak if nothing left after cleaning
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        isPaused = false;
        
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.rate = 0.9; // Slower for better clarity and natural speech
        utterance.pitch = 1.05; // Slightly higher pitch for female voice
        utterance.volume = 1;
        
        // Store current utterance for pause/resume
        currentUtterance = utterance;
        
        // Add event listeners for better control
        utterance.onstart = () => {
            console.log('Speech started');
            isPaused = false;
        };
        
        utterance.onend = () => {
            console.log('Speech ended');
            currentUtterance = null;
            isPaused = false;
            
            // Reset voice toggle icon
            const voiceIcon = voiceToggle.querySelector('.voice-icon');
            if (isVoiceEnabled) {
                voiceIcon.textContent = '🔊';
            }
        };
        
        utterance.onerror = (event) => {
            console.error('Speech error:', event);
            currentUtterance = null;
            isPaused = false;
        };
        
        utterance.onpause = () => {
            console.log('Speech paused');
            isPaused = true;
        };
        
        utterance.onresume = () => {
            console.log('Speech resumed');
            isPaused = false;
        };
        
        // Use selected voice or find a female voice
        const setVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            
            // Use user-selected voice if available
            if (selectedVoice) {
                utterance.voice = selectedVoice;
                console.log('Using selected voice:', selectedVoice.name);
                return;
            }
            
            // Otherwise, try to find female English voices in order of preference
            const femaleVoice = voices.find(voice => 
                voice.lang.startsWith('en') && 
                (voice.name.includes('Female') || 
                 voice.name.includes('Zira') ||
                 voice.name.includes('Samantha') ||
                 voice.name.includes('Karen') ||
                 voice.name.includes('Victoria') ||
                 voice.name.includes('Susan'))
            ) || voices.find(voice => 
                voice.lang.startsWith('en') && voice.name.includes('Google')
            ) || voices.find(voice => 
                voice.lang.startsWith('en')
            );
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
                selectedVoice = femaleVoice; // Remember this voice
                console.log('Using voice:', femaleVoice.name);
            }
        };
        
        // Set voice immediately if available
        if (window.speechSynthesis.getVoices().length > 0) {
            setVoice();
        }
        
        // Speak the text
        window.speechSynthesis.speak(utterance);
    }
}

// Pause speech
function pauseSpeech() {
    if (window.speechSynthesis.speaking && !isPaused) {
        window.speechSynthesis.pause();
        isPaused = true;
        showStatus('Speech paused', 'info');
    }
}

// Resume speech
function resumeSpeech() {
    if (isPaused) {
        window.speechSynthesis.resume();
        isPaused = false;
        showStatus('Speech resumed', 'success');
    }
}

// Toggle pause/resume
function toggleSpeech() {
    if (window.speechSynthesis.speaking) {
        if (isPaused) {
            resumeSpeech();
        } else {
            pauseSpeech();
        }
    }
}

// Special function for welcome message (louder and more polite)
function speakWelcome(text) {
    if (!isVoiceEnabled) return;
    
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85; // Slower for clarity and politeness
        utterance.pitch = 1.1; // Slightly higher for friendly tone
        utterance.volume = 1.0; // Maximum volume (loud)
        
        // Use selected voice or find a female voice
        const setVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            
            // Use user-selected voice if available
            if (selectedVoice) {
                utterance.voice = selectedVoice;
                console.log('Welcome using selected voice:', selectedVoice.name);
                return;
            }
            
            // Otherwise, try to find female English voices for polite welcome
            const femaleVoice = voices.find(voice => 
                voice.lang.startsWith('en') && 
                (voice.name.includes('Female') || 
                 voice.name.includes('Zira') ||
                 voice.name.includes('Samantha') ||
                 voice.name.includes('Karen') ||
                 voice.name.includes('Victoria') ||
                 voice.name.includes('Susan'))
            ) || voices.find(voice => 
                voice.lang.startsWith('en') && voice.name.includes('Google')
            ) || voices.find(voice => 
                voice.lang.startsWith('en')
            );
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
                selectedVoice = femaleVoice; // Remember this voice
                console.log('Welcome using voice:', femaleVoice.name);
            }
        };
        
        // Set voice immediately if available
        if (window.speechSynthesis.getVoices().length > 0) {
            setVoice();
        }
        
        // Add event listeners
        utterance.onstart = () => {
            console.log('Welcome message started');
        };
        
        utterance.onend = () => {
            console.log('Welcome message ended');
        };
        
        // Speak the welcome message
        window.speechSynthesis.speak(utterance);
    }
}

// Load and populate voice list
function loadVoiceList() {
    availableVoices = window.speechSynthesis.getVoices();
    
    if (availableVoices.length === 0) return;
    
    // Filter for English, Hindi, and Marathi voices
    const supportedVoices = availableVoices.filter(voice => 
        voice.lang.startsWith('en') || 
        voice.lang.startsWith('hi') || 
        voice.lang.startsWith('mr')
    );
    
    voiceList.innerHTML = '';
    
    // Group voices by language
    const languageGroups = {
        'English': supportedVoices.filter(v => v.lang.startsWith('en')),
        'Hindi (हिंदी)': supportedVoices.filter(v => v.lang.startsWith('hi')),
        'Marathi (मराठी)': supportedVoices.filter(v => v.lang.startsWith('mr'))
    };
    
    // Display voices grouped by language
    Object.entries(languageGroups).forEach(([langName, voices]) => {
        if (voices.length > 0) {
            // Add language header
            const langHeader = document.createElement('div');
            langHeader.className = 'voice-lang-header';
            langHeader.textContent = langName;
            voiceList.appendChild(langHeader);
            
            // Add voices for this language
            voices.forEach((voice) => {
                const voiceOption = document.createElement('div');
                voiceOption.className = 'voice-option';
                if (selectedVoice && selectedVoice.name === voice.name) {
                    voiceOption.classList.add('selected');
                }
                
                // Determine gender icon
                const genderIcon = voice.name.toLowerCase().includes('female') || 
                                   voice.name.toLowerCase().includes('zira') || 
                                   voice.name.toLowerCase().includes('samantha') ? '👩' : '👨';
                
                voiceOption.innerHTML = `
                    <div>
                        <div class="voice-option-name">${voice.name}</div>
                        <div class="voice-option-lang">${voice.lang}</div>
                    </div>
                    <div>${genderIcon}</div>
                `;
                
                voiceOption.addEventListener('click', () => {
                    // Check if speech is currently playing
                    const wasSpeaking = window.speechSynthesis.speaking;
                    const currentText = currentUtterance ? currentUtterance.text : null;
                    
                    // Cancel current speech
                    window.speechSynthesis.cancel();
                    
                    // Update selected voice
                    selectedVoice = voice;
                    loadVoiceList(); // Refresh to show selection
                    showStatus(`Voice changed to: ${voice.name}`, 'success');
                    
                    // If speech was playing, restart with new voice
                    if (wasSpeaking && currentText) {
                        // Wait a moment for cancel to complete
                        setTimeout(() => {
                            const newUtterance = new SpeechSynthesisUtterance(currentText);
                            newUtterance.voice = voice;
                            newUtterance.rate = 0.9;
                            newUtterance.pitch = 1.05;
                            newUtterance.volume = 1.0;
                            
                            currentUtterance = newUtterance;
                            window.speechSynthesis.speak(newUtterance);
                            
                            showStatus(`Continuing with ${voice.name}`, 'info');
                        }, 100);
                    } else {
                        // Just test the voice
                        let testText = "Hello! This is my voice.";
                        if (voice.lang.startsWith('hi')) {
                            testText = "नमस्ते! मैं आपका फिटनेस सहायक हूं।";
                        } else if (voice.lang.startsWith('mr')) {
                            testText = "नमस्कार! मी तुमचा फिटनेस सहाय्यक आहे।";
                        }
                        
                        const testUtterance = new SpeechSynthesisUtterance(testText);
                        testUtterance.voice = voice;
                        testUtterance.rate = 0.95;
                        testUtterance.pitch = 1.1;
                        window.speechSynthesis.speak(testUtterance);
                    }
                });
                
                voiceList.appendChild(voiceOption);
            });
        }
    });
    
    // Show message if no Hindi/Marathi voices available
    if (languageGroups['Hindi (हिंदी)'].length === 0 && languageGroups['Marathi (मराठी)'].length === 0) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'voice-info';
        infoDiv.innerHTML = `
            <p>ℹ️ <strong>Hindi & Marathi voices not found on your system.</strong></p>
            <p>To add them:</p>
            <ul>
                <li><strong>Windows:</strong> Settings → Time & Language → Speech → Add voices</li>
                <li><strong>Android:</strong> Settings → Language & Input → Text-to-speech → Install voice data</li>
            </ul>
        `;
        voiceList.appendChild(infoDiv);
    }
}

// Format text for better display (ChatGPT style)
function formatTextResponse(text) {
    let formatted = text;
    
    // Split into paragraphs at sentence boundaries
    formatted = formatted.replace(/\. ([A-Z])/g, '.</p><p>$1');
    
    // Detect and format numbered lists
    formatted = formatted.replace(/(\d+)\.\s+([^\n]+)/g, '<li>$2</li>');
    if (formatted.includes('<li>')) {
        formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
    }
    
    // Detect and format bullet points
    formatted = formatted.replace(/[•\-]\s+([^\n]+)/g, '<li>$1</li>');
    
    // Format headers (if text starts with a question or title)
    formatted = formatted.replace(/^([A-Z][^.!?]*[?:])/gm, '<h4>$1</h4>');
    
    // Bold important keywords and phrases
    const keywords = [
        'benefits', 'important', 'recommended', 'essential', 'key', 
        'tip', 'note', 'warning', 'remember', 'caution', 'avoid',
        'best practice', 'pro tip', 'important note'
    ];
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword}s?)\\b`, 'gi');
        formatted = formatted.replace(regex, '<strong class="highlight">$1</strong>');
    });
    
    // Format numbers with units (e.g., "8-10 glasses", "150 minutes")
    formatted = formatted.replace(/(\d+[-–]\d+\s+\w+)/g, '<strong>$1</strong>');
    formatted = formatted.replace(/(\d+\s+(minutes|hours|glasses|liters|grams|calories|times|days|weeks))/gi, '<strong>$1</strong>');
    
    // Wrap in paragraphs if not already
    if (!formatted.includes('<p>') && !formatted.includes('<li>')) {
        formatted = '<p>' + formatted + '</p>';
    }
    
    // Clean up multiple paragraph tags
    formatted = formatted.replace(/<\/p>\s*<p>/g, '</p><p>');
    
    // Add spacing for lists
    formatted = formatted.replace(/<ol>/g, '<ol class="formatted-list">');
    formatted = formatted.replace(/<ul>/g, '<ul class="formatted-list">');
    
    return formatted;
}

// Show status message
function showStatus(message, type = 'info') {
    statusIndicator.textContent = message;
    statusIndicator.className = `status-indicator show ${type}`;
    
    setTimeout(() => {
        statusIndicator.classList.remove('show');
    }, 3000);
}

// Add message to chat
function addMessage(content, isUser = false, sources = []) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Format assistant messages for better display
    if (!isUser) {
        const formattedContent = formatTextResponse(content);
        contentDiv.innerHTML = formattedContent.replace(/\n/g, '<br>');
    } else {
        contentDiv.textContent = content;
    }
    
    bubbleDiv.appendChild(contentDiv);
    
    // Add sources if available
    if (!isUser && sources && sources.length > 0) {
        const sourcesDiv = document.createElement('div');
        sourcesDiv.className = 'sources';
        sourcesDiv.innerHTML = '<strong>📚 Sources:</strong>';
        
        sources.forEach(source => {
            const sourceTag = document.createElement('span');
            sourceTag.className = 'source-tag';
            sourceTag.textContent = source;
            sourcesDiv.appendChild(sourceTag);
        });
        
        bubbleDiv.appendChild(sourcesDiv);
    }
    
    messageDiv.appendChild(bubbleDiv);
    chatContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Speak messages based on voice settings
    if (isVoiceEnabled) {
        if (isUser) {
            // Read user's message with confirmation tone
            speakUserMessage(content);
        } else {
            // Read AI's response
            speak(content);
        }
    }
}

// Function to read user's message (confirmation)
function speakUserMessage(text) {
    if (!isVoiceEnabled) return;
    
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0; // Normal speed for user's message
        utterance.pitch = 1.0; // Normal pitch
        utterance.volume = 0.8; // Slightly quieter than AI response
        
        // Use selected voice
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        } else {
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v => v.lang.startsWith('en'));
            if (voice) utterance.voice = voice;
        }
        
        // Speak the user's message
        window.speechSynthesis.speak(utterance);
    }
}

// Add typing indicator
function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Send message to backend
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) {
        showStatus('Please enter a message', 'error');
        return;
    }
    
    // Add user message to chat
    addMessage(message, true);
    
    // Clear input
    messageInput.value = '';
    
    // Disable send button
    sendButton.disabled = true;
    
    // Show typing indicator
    addTypingIndicator();
    
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add assistant response
        addMessage(data.response, false, data.sources || []);
        
    } catch (error) {
        console.error('Error sending message:', error);
        removeTypingIndicator();
        
        const errorMessage = error.message.includes('Failed to fetch')
            ? 'Unable to connect to the server. Please make sure the backend is running.'
            : 'Sorry, I encountered an error. Please try again.';
        
        addMessage(errorMessage, false);
        showStatus('Error sending message', 'error');
    } finally {
        sendButton.disabled = false;
        messageInput.focus();
    }
}

// Event Listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

micButton.addEventListener('click', () => {
    if (!recognition) {
        showStatus('Speech recognition not available', 'error');
        return;
    }
    
    if (isRecording) {
        recognition.stop();
    } else {
        try {
            // Update language before starting (in case it was changed)
            recognition.lang = recognitionLanguage;
            console.log('Starting recognition with language:', recognitionLanguage);
            recognition.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
            showStatus('Please wait a moment and try again', 'info');
            
            // Reset state
            isRecording = false;
            micButton.classList.remove('recording');
            
            // Retry after a short delay
            setTimeout(() => {
                try {
                    recognition.lang = recognitionLanguage;
                    recognition.start();
                } catch (e) {
                    showStatus('Speech recognition unavailable. Please refresh the page.', 'error');
                }
            }, 1500);
        }
    }
});

voiceToggle.addEventListener('click', () => {
    // If speech is currently playing, toggle pause/resume
    if (window.speechSynthesis.speaking) {
        toggleSpeech();
        
        const voiceIcon = voiceToggle.querySelector('.voice-icon');
        if (isPaused) {
            voiceIcon.textContent = '▶️';
        } else {
            voiceIcon.textContent = '⏸️';
        }
    } else {
        // Otherwise, toggle voice on/off
        isVoiceEnabled = !isVoiceEnabled;
        
        const voiceStatus = voiceToggle.querySelector('.voice-status');
        const voiceIcon = voiceToggle.querySelector('.voice-icon');
        
        if (isVoiceEnabled) {
            voiceStatus.textContent = 'ON';
            voiceIcon.textContent = '🔊';
            voiceToggle.classList.remove('disabled');
            showStatus('Voice mode enabled', 'success');
        } else {
            voiceStatus.textContent = 'OFF';
            voiceIcon.textContent = '🔇';
            voiceToggle.classList.add('disabled');
            window.speechSynthesis.cancel(); // Stop any ongoing speech
            showStatus('Voice mode disabled', 'info');
        }
    }
});

// Language selector modal
const languageSelector = document.getElementById('languageSelector');
const languageModal = document.getElementById('languageModal');
const closeLangModal = document.getElementById('closeLangModal');
const currentLangLabel = document.getElementById('currentLang');
const languageOptions = document.querySelectorAll('.language-option');

languageSelector.addEventListener('click', () => {
    languageModal.classList.remove('hidden');
});

closeLangModal.addEventListener('click', () => {
    languageModal.classList.add('hidden');
});

languageModal.addEventListener('click', (e) => {
    if (e.target === languageModal) {
        languageModal.classList.add('hidden');
    }
});

// Handle language selection
languageOptions.forEach(option => {
    option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang');
        const langName = option.querySelector('.lang-name').textContent;
        
        // Update recognition language
        recognitionLanguage = lang;
        
        // Update label
        currentLangLabel.textContent = langName.split(' ')[0]; // Show short name
        
        // Reinitialize recognition with new language
        if (recognition) {
            recognition.lang = recognitionLanguage;
        }
        
        // Close modal
        languageModal.classList.add('hidden');
        
        // Show status
        showStatus(`Speech recognition set to: ${langName}`, 'success');
        
        // Highlight selected option
        languageOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    });
});

// Voice selector modal
voiceSelector.addEventListener('click', () => {
    loadVoiceList();
    voiceModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
    voiceModal.classList.add('hidden');
});

// Close modal when clicking outside
voiceModal.addEventListener('click', (e) => {
    if (e.target === voiceModal) {
        voiceModal.classList.add('hidden');
    }
});

// Initialize on page load
window.addEventListener('load', () => {
    // Initialize speech recognition
    const speechAvailable = initializeSpeechRecognition();
    
    if (!speechAvailable) {
        micButton.disabled = true;
        micButton.style.opacity = '0.5';
        micButton.title = 'Speech recognition not supported';
    }
    
    // Load voices for speech synthesis
    let voicesLoaded = false;
    
    const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0 && !voicesLoaded) {
            voicesLoaded = true;
            console.log('Available voices:', voices.map(v => v.name));
            
            // Play welcome message after voices are loaded
            setTimeout(() => {
                const welcomeText = "Hello! Welcome to your Personal Fitness AI Coach. I'm here to help you achieve your health and fitness goals. Please feel free to ask me anything about exercise, nutrition, wellness, or healthy living. How may I assist you today?";
                speakWelcome(welcomeText);
                showStatus('Ready to assist you!', 'success');
            }, 500);
        }
    };
    
    if ('speechSynthesis' in window) {
        // Chrome loads voices asynchronously
        window.speechSynthesis.onvoiceschanged = loadVoices;
        
        // Try loading immediately (for some browsers)
        loadVoices();
        
        // Fallback: if voices still not loaded after 1 second
        setTimeout(() => {
            if (!voicesLoaded) {
                loadVoices();
            }
        }, 1000);
    }
    
    // Focus on input
    messageInput.focus();
});

// Handle page visibility change (pause speech when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        window.speechSynthesis.cancel();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (recognition) {
        recognition.stop();
    }
    window.speechSynthesis.cancel();
});
