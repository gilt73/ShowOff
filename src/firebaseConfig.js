import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCtmZ_1kCMJUJYLu9l0zdLmyxasI3hBrNs",
    authDomain: "showoff-gt-ai-game.firebaseapp.com",
    databaseURL: "https://showoff-gt-ai-game-default-rtdb.firebaseio.com",
    projectId: "showoff-gt-ai-game",
    storageBucket: "showoff-gt-ai-game.firebasestorage.app",
    messagingSenderId: "744236221290",
    appId: "1:744236221290:web:75e2e75cec8c9d74385b13"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
