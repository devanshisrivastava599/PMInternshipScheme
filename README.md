# PM Internship AI Assistant

A comprehensive web application for the Prime Minister's Internship Scheme with AI-powered assistance.

## Features

### 🏠 Landing Page
- Modern hero section with call-to-action buttons
- Responsive navigation with mobile menu
- Dark/Light mode toggle
- Multi-language support (English/Hindi)

### 📋 About Section
- PM Internship Scheme information
- Eligibility criteria, duration, and benefits
- Card-based layout with icons

### 💼 Internship Listings
- Sample internship opportunities
- Ministry-wise categorization
- Detailed information cards with apply buttons

### 🤖 AI Chatbot
- WhatsApp-style chat interface
- FAQ responses for common queries
- Personalized internship recommendations
- Voice input using Web Speech API
- Text-to-speech for bot responses
- Chat history persistence

### 🌐 Multi-language Support
- English and Hindi language options
- Dynamic content translation
- Language preference persistence

### 🎨 Modern UI/UX
- Tailwind CSS for responsive design
- Dark/Light mode with smooth transitions
- Floating chatbot widget
- Mobile-first responsive design

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **APIs**: Web Speech API for voice features
- **Storage**: LocalStorage for preferences and chat history
- **Icons**: Font Awesome

## File Structure

```
PM-Internship-AI/
├── index.html          # Main HTML file
├── script.js           # JavaScript functionality
└── README.md          # Documentation
```

## Setup Instructions

1. Clone or download the project files
2. Open `index.html` in a modern web browser
3. No additional setup required - runs entirely in the browser

## Features in Detail

### Chatbot Capabilities
- **FAQ Responses**: Eligibility, documents, deadlines
- **Smart Recommendations**: Based on user's educational background
- **Voice Input**: Click microphone to speak your query
- **Text-to-Speech**: Bot responses are read aloud
- **Persistent History**: Chat history saved locally

### Responsive Design
- Mobile-optimized interface
- Tablet and desktop layouts
- Touch-friendly interactions
- Accessible navigation

### Internship Data
The application includes sample internships from:
- Ministry of Education
- NITI Aayog
- Ministry of Tourism
- Ministry of Electronics & IT
- Ministry of Finance
- Ministry of Information & Broadcasting

## Browser Compatibility

- Chrome (recommended for voice features)
- Firefox
- Safari
- Edge

**Note**: Voice input requires HTTPS in production environments.

## Customization

### Adding New Internships
Edit the `internships` object in `script.js`:

```javascript
const internships = {
    en: [
        {
            title: "Your Internship Title",
            eligibility: "Eligibility criteria",
            duration: "Duration",
            stipend: "Stipend amount",
            description: "Description"
        }
    ]
};
```

### Modifying Chatbot Responses
Update the `botResponses` object in `script.js`:

```javascript
const botResponses = {
    en: {
        your_key: "Your response text"
    }
};
```

## Future Enhancements

- Integration with real internship APIs
- User authentication and profiles
- Application tracking system
- Advanced AI using OpenAI API
- Email notifications
- Document upload functionality

## License

This project is created for the Smart India Hackathon (SIH) and is open for educational purposes.

## Support

For questions or issues, please contact the development team.