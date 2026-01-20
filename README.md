# 🎮 ShowOff - The Ultimate Party Game

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/gilt73/ShowOff)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange.svg)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)

A real-time multiplayer party trivia game with second-screen architecture. Host displays questions on TV/laptop while players answer from their phones!

## ✨ Features

- 🎯 **Second-Screen Architecture** - Host on TV, players on phones
- 🔥 **Real-time Multiplayer** - Firebase-powered instant sync
- 🎲 **6 Game Packs** - 300+ questions across diverse topics
- 🌍 **Bilingual** - English & Hebrew (RTL support)
- 🎮 **Two Game Modes**:
  - 🏆 **Classic Quiz** - Traditional trivia scoring
  - 😈 **ShowOff Mode** - Wrong answers trigger fun penalty tasks
- 📊 **Difficulty Progression** - Easy → Medium → Hard questions
- 📱 **Mobile-First Design** - Optimized for all devices
- 📺 **TV Mode** - Optimized for overscan and large screens
- 🔍 **Debug Mode** - Single-player testing without multiplayer

## 🎲 Game Packs (v2.0 Format)

All games feature **50 questions** (17 easy, 17 medium, 16 hard) + **20 punishment tasks**:

| Pack | Language | Theme | Questions |
|------|----------|-------|-----------|
| **Avatar** | English | Avatar: The Last Airbender | 50 |
| **Kupa Rashit** | Hebrew | Israeli Supermarket Sitcom | 50 |
| **Home Alone** | English | Classic Holiday Movie | 50 |
| **Sports Trivia** | English | Multi-sport Knowledge | 50 |
| **Friends** | Hebrew | Iconic TV Show חברים | 50 |
| **Descendants** | Hebrew | Disney Movie היורשים | 50 |

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/gilt73/ShowOff.git
cd ShowOff

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to start playing!

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 How to Play

### As Host:
1. Click **"Browse Games"** on home screen
2. Select a game pack
3. Choose **Classic Quiz** or **ShowOff Mode**
4. Display QR code on TV/large screen
5. Start game when players join
6. Advance through questions

### As Player:
1. Scan QR code OR enter room code
2. Enter your nickname
3. Answer questions within time limit
4. See your score and rank in real-time
5. Complete penalties (ShowOff mode)

## 📝 Creating Custom Content

### CSV Format

Create new game packs using CSV files:

```csv
GameTitle_EN,GameTitle_HE,ThemeColor,IconName,BackgroundURL
My Game,המשחק שלי,#4A90E2,🎮,/assets/bg.png

Question,Answer1,Answer2,Answer3,Answer4,Difficulty,TimeLimit,ImageURL,Category
What is 2+2?,4,3,5,6,1,20,,Math
Who painted Mona Lisa?,Leonardo da Vinci,Michelangelo,Raphael,Donatello,2,20,,Art

---PUNISHMENTS---
Text,Duration
Do 10 jumping jacks!,30
Sing a song for 20 seconds,20
```

**Difficulty Levels:**
- `1` = Easy
- `2` = Medium
- `3` = Hard

Use `utils/contentManager.js` to import/export CSV ↔ JSON.

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS with custom gradients
- **Database**: Firebase Realtime Database
- **Hosting**: Firebase Hosting
- **Routing**: React Router 6
- **QR Codes**: react-qr-code

## 📂 Project Structure

```
ShowOff/
├── src/
│   ├── App.jsx                    # Main app & routing
│   ├── components/
│   │   ├── HostGame.jsx          # Host game logic
│   │   ├── PlayerGame.jsx        # Player game logic
│   │   ├── GameLibraryScreen.jsx # Game selection UI
│   │   ├── SinglePlayerGame.jsx  # Debug mode
│   │   └── DebugLog.jsx          # Debug overlay
│   ├── questions/
│   │   ├── index.js              # Question engine
│   │   ├── avatar.js             # Game pack
│   │   ├── kuparashit.js
│   │   ├── homealone.js
│   │   ├── sports.js
│   │   ├── friends.js
│   │   └── hayorshim.js
│   ├── utils/
│   │   └── contentManager.js     # CSV ↔ JSON pipeline
│   └── firebaseConfig.js         # Firebase setup
├── public/
│   └── assets/                   # Images & icons
├── docs/
│   └── PRD.md                    # Product requirements
└── package.json
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Realtime Database
3. Update `src/firebaseConfig.js` with your credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy to Firebase Hosting
npm run build
firebase deploy
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'showoff-accent': '#E91E63',
      'showoff-electric': '#00FFFF',
      // Add your colors
    }
  }
}
```

### Game Pack Metadata

Each game pack supports:
- Custom theme colors
- Emoji icons
- Background images
- Localized titles

## 📊 Analytics & Metrics

Track game sessions with basic analytics:
- Session duration
- Player count per game
- Question answer rates
- Popular game packs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

MIT License - see LICENSE file for details

## 🙏 Credits

**Powered by G.T AI Games**
- Website: [https://gilt73.github.io/GT-AI-Studio/](https://gilt73.github.io/GT-AI-Studio/)
- Created with ❤️ using AI-assisted development

## 🐛 Troubleshooting

### Common Issues:

**Players can't see questions:**
- Check Firebase Database rules
- Verify room code is correct
- Ensure both devices are connected to internet

**QR code not working:**
- Make sure devices are on same network
- Try manual room code entry
- Check firewall settings

**Game freezes:**
- Refresh all browser tabs
- Check Firebase quota limits
- Verify internet connection

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: gilt73@github.com

---

**Version 2.0.0** | Made with 💜 by G.T AI Studio
