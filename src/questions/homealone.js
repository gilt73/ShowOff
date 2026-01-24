// Home Alone Questions - Minimal working version
// Full version will be added after basic functionality is confirmed

export const homeAloneQuestions = [
    {
        category: { en: "Kevin", he: "קווין" },
        question: {
            en: "What is the main character's name?",
            he: "מה שם הדמות הראשית?"
        },
        options: {
            en: ["Kevin McCallister", "Kevin Johnson", "Kevin Smith", "Kevin Brown"],
            he: ["קווין מקאליסטר", "קווין ג'ונסון", "קווין סמית'", "קווין בראון"]
        },
        correctIndex: 0,
        difficulty: 1,
        timeLimit: 20
    },
    {
        category: { en: "Plot", he: "עלילה" },
        question: {
            en: "Where does Kevin's family go?",
            he: "לאן משפחתו של קווין נוסעת?"
        },
        options: {
            en: ["Paris", "London", "Rome", "New York"],
            he: ["פריז", "לונדון", "רומא", "ניו יורק"]
        },
        correctIndex: 0,
        difficulty: 1,
        timeLimit: 20
    }
];

export const homeAlonePunishments = [
    {
        text: {
            en: "Scream like Kevin for 5 seconds!",
            he: "צרח כמו קווין 5 שניות!"
        },
        duration: 5
    },
    {
        text: {
            en: "Do the Kevin face and scream",
            he: "עשה פרצוף קווין וצרח"
        },
        duration: 10
    }
];

export const homeAlonePack = {
    id: "home_alone",
    title: { en: "Home Alone", he: "שוד ביתי" },
    metadata: {
        themeColor: "#C41E3A",
        icon: "🏠",
        bgImage: `${import.meta.env.BASE_URL}assets/homealone_bg.png`
    },
    questions: homeAloneQuestions,
    punishments: homeAlonePunishments,
    version: "2.0"
};
