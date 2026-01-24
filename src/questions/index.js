// Question Packs Index
// This file exports all game packs and UI text
// Add new packs by creating a new file and importing here

import { friendsPack } from './friends';
import { hayorshimPack } from './hayorshim';
import { avatarPack } from './avatar';
import { kuparashitPack } from './kuparashit';
import { burekascultPack } from './burekascult';

// All available game packs
export const gamePacks = {
    friends: friendsPack,
    hayorshim: hayorshimPack,
    avatar: avatarPack,
    kupa_rashit: kuparashitPack,
    burekas_cult: burekascultPack
};

// UI Text for multiple languages
export const uiText = {
    en: {
        host: "Host Game",
        join: "Join Game",
        waiting: "Waiting for Players...",
        start: "Start ShowOff",
        scan: "Scan to Join",
        penalty: "Time's Up!",
        next: "Next Question",
        roomFull: "Room is Full!",
        selectGame: "Select Game Mode",
        gameOver: "Game Over!",
        finalRankings: "Final Rankings",
        playAgain: "Play Again",
        rounds: "Rounds",
        yourRank: "Your Rank",
        yourScore: "Your Score",
        correct: "CORRECT!",
        wrong: "WRONG!",
        correctAnswer: "Correct Answer:",
        penaltyTask: "Penalty Task:",
        autoAdvancing: "Auto-advancing to next question..."
    },
    he: {
        host: "צור משחק",
        join: "הצטרף למשחק",
        waiting: "מחכה לשחקנים...",
        start: "התחל משחק",
        scan: "סרוק כדי להצטרף",
        penalty: "נגמר הזמן!",
        next: "שאלה הבאה",
        roomFull: "החדר מלא!",
        selectGame: "בחר מצב משחק",
        gameOver: "סוף המשחק!",
        finalRankings: "דירוג סופי",
        playAgain: "שחק שוב",
        rounds: "סיבובים",
        yourRank: "הדירוג שלך",
        yourScore: "הניקוד שלך",
        correct: "נכון!",
        wrong: "טעות!",
        correctAnswer: "התשובה הנכונה:",
        penaltyTask: "משימת עונש:",
        autoAdvancing: "עובר לשאלה הבאה..."
    }
};

// Utility function to shuffle an array (Fisher-Yates algorithm)
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Select 15 questions from a 50-question pool using difficulty progression
 * Strategy: 5 Easy → 5 Medium → 5 Hard
 * @param {Object} gamePack - Game pack with version 2.0 structure
 * @returns {Array} 15 selected questions in difficulty order
 */
export function selectDifficultyBasedQuestions(gamePack) {
    if (!gamePack.questions || gamePack.questions.length === 0) {
        return [];
    }

    // Check if this is a v2.0 game pack with difficulty field
    const hasDifficulty = gamePack.version === '2.0' ||
        gamePack.questions.some(q => q.difficulty !== undefined);

    if (!hasDifficulty) {
        // Legacy game: return all questions shuffled
        return shuffleArray(gamePack.questions);
    }

    // Separate questions by difficulty (supports both 3-tier and 5-tier systems)
    // Easy: difficulty 1-2, Medium: difficulty 3-4, Hard: difficulty 5+
    const easy = gamePack.questions.filter(q => q.difficulty >= 1 && q.difficulty <= 2);
    const medium = gamePack.questions.filter(q => q.difficulty >= 3 && q.difficulty <= 4);
    const hard = gamePack.questions.filter(q => q.difficulty >= 5);

    // Select 5 from each tier (or as many as available)
    const selectedEasy = shuffleArray(easy).slice(0, Math.min(5, easy.length));
    const selectedMedium = shuffleArray(medium).slice(0, Math.min(5, medium.length));
    const selectedHard = shuffleArray(hard).slice(0, Math.min(5, hard.length));

    // Combine in order: easy → medium → hard
    return [...selectedEasy, ...selectedMedium, ...selectedHard];
}

