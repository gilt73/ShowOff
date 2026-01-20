# ShowOff - Product Requirements Document (PRD)

## 1. Overview

**Product Name:** ShowOff  
**Version:** 1.0  
**Type:** Real-time multiplayer party trivia game (PWA)  
**Architecture:** Second Screen (Host displays on TV/laptop, Players use phones)

---

## 2. Product Vision

ShowOff is a social party game designed for gatherings where a host displays questions on a large screen while players answer from their phones. The game combines trivia knowledge with entertaining penalty tasks, creating memorable party moments.

---

## 3. Target Users

- **Primary:** Party hosts (ages 18-40) looking for group entertainment
- **Secondary:** Families, team-building events, bars/restaurants
- **Group Size:** 2-20 players

---

## 4. Core Features

### 4.1 Game Modes
| Mode | Description |
|------|-------------|
| **ShowOff Mode (Penalty)** | Wrong answers trigger fun penalty tasks |
| **Classic Quiz** | Traditional scoring without penalties |

### 4.2 Host Experience
- Generate unique 4-character room code
- Display QR code for easy player joining
- Select question pack (Sports, Friends, etc.)
- Choose number of rounds (7, 10, or 15)
- Control game flow (start, next question)
- View live scoreboard with podium rankings

### 4.3 Player Experience
- Join via QR scan or room code entry
- Enter nickname (persists across sessions)
- Answer multiple-choice questions (4 options)
- See immediate feedback (correct/wrong)
- View personal score and rank
- Answer locking (no changes after selection)

### 4.4 Game Flow
```
LOBBY → QUESTION → [PENALTY/SCOREBOARD] → ... → GAME_OVER
```
1. **LOBBY:** Players join, host selects rounds
2. **QUESTION:** 15-second timer, players answer
3. **PENALTY/SCOREBOARD:** Show results + penalty task (if applicable)
4. **GAME_OVER:** Final podium with 🥇🥈🥉 rankings

---

## 5. Question System

### 5.1 Requirements
- Minimum 15 questions per pack
- Each game shuffles questions randomly
- No question repeats within a single game session

### 5.2 Question Structure
```javascript
{
    category: "Category Name",
    question: "Question text?",
    options: ["A", "B", "C", "D"],
    correctIndex: 0,  // 0-3
    penaltyTask: "Fun task for wrong answers"
}
```

### 5.3 Available Packs
| Pack | Language | Questions |
|------|----------|-----------|
| Sports Trivia | English | 18 |
| Friends TV Show | Hebrew | 18 |

---

## 6. Technical Architecture

### 6.1 Stack
| Component | Technology |
|-----------|------------|
| Frontend | React + Vite |
| Styling | TailwindCSS |
| Database | Firebase Realtime Database |
| Hosting | Firebase Hosting |

### 6.2 Real-time Sync
- Firebase Realtime Database syncs game state
- All players receive updates instantly
- Room data structure:
```
rooms/
  {roomCode}/
    gameState: "LOBBY" | "QUESTION" | "PENALTY" | "SCOREBOARD" | "GAME_OVER"
    currentQuestionIndex: number
    timer: number
    totalRounds: number
    shuffledQuestions: string[]
    players/
      {nickname}/
        nickname: string
        score: number
        answered: boolean
        selectedOption: number
```

### 6.3 File Structure
```
src/
├── App.jsx              # Routing + Home screen
├── main.jsx             # Entry point
├── index.css            # Global styles
├── firebaseConfig.js    # Firebase connection
├── components/
│   ├── HostGame.jsx     # Host display logic
│   └── PlayerGame.jsx   # Player phone logic
└── questions/
    ├── index.js         # Exports + shuffle utility
    ├── sports.js        # Sports questions
    └── friends.js       # Friends questions
```

---

## 7. Scoring System

| Action | Points |
|--------|--------|
| Correct Answer | +10 |
| Wrong Answer | 0 |
| No Answer (timeout) | 0 |

---

## 8. Localization

Supports English (en) and Hebrew (he):
- UI text switcher on home screen
- Right-to-left (RTL) support for Hebrew
- Question packs can be language-specific

---

## 9. Future Enhancements

- [ ] More question packs (Movies, Music, Science)
- [ ] Custom question pack creator
- [ ] Team mode (2v2, 3v3)
- [ ] Power-ups (double points, skip question)
- [ ] Sound effects and animations
- [ ] Leaderboard history
- [ ] Social sharing of results

---

## 10. Success Metrics

- Average session duration > 15 minutes
- Player retention (return plays) > 40%
- Average group size > 4 players
- Positive feedback on penalty tasks

---

*Document Version: 1.0 | Last Updated: January 2026*
