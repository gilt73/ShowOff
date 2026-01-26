// נועם האגדה - Noam the Legend Pack
// Version 2.0 - Personal Trivia About Noam
// 11 Questions (8 Trivia + 3 Tasks) from CSV

export const noamQuestions = [
    // ========== EASY LEVEL (Difficulty 1) - 3 Questions ==========

    {
        category: "בית ספר",
        question: "איך נועם הצליח לשרוד את המורות רונית ושושה ריידבסקי בלי להיזרק מהכיתה?",
        options: ["הוא באמת הכין שיעורי בית", "חיוך חנופה שאי אפשר לסרב לו", "הוא שיחד אותן בנס קפה", "הוא פשוט לא הגיע לבית ספר"],
        correctIndex: 1,
        difficulty: 1,
        timeLimit: 20
    },
    {
        category: "משפחה",
        question: "מי מהרשימה הבאה היא הבוסית הנוכחית (הפולניה מתל אביב) ששומרת על נועם?",
        options: ["נילי", "אווה", "מיטל", "יעל"],
        correctIndex: 1,
        difficulty: 1,
        timeLimit: 20
    },
    {
        category: "הרפתקאות",
        question: "כשנועם גנב את האוטו של אבא לשטחים של ינון - מי היה הכי לחוץ?",
        options: ["השוטר הקהילתי", "אבא שלו (בלי לדעת)", "אחותו בושמת", "החבר דני"],
        correctIndex: 1,
        difficulty: 2,
        timeLimit: 20
    },

    // ========== MEDIUM LEVEL (Difficulty 2) - 5 Questions ==========

    {
        category: "חברים",
        question: "אם נועם נתקע בשטח - מי מהחברים כנראה יגיע לחלץ אותו (או לפחות לצחוק עליו)?",
        options: ["המורה שושה ריידבסקי", "תומר גיל ארז או יזהר", "אווה עם הקורקינט", "אור אלון ואליה"],
        correctIndex: 1,
        difficulty: 2,
        timeLimit: 20
    },
    {
        category: "זכרונות ילדות",
        question: "מה הקשר בין סל כביסה במקלחת לבין נועם המתבגר?",
        options: ["שם הוא החביא את ה-Gameboy", "זה היה מקום המסתור שלו למשימות \"ריגול\"", "שם הוא ישן אחרי הרכיבות בשטח", "שם הוא בנה את ה-AI הראשון שלו"],
        correctIndex: 1,
        difficulty: 2,
        timeLimit: 20
    },
    {
        category: "משפחה - הצבעה",
        question: "מי משלושת הילדים (אור אלון ואליה) הכי דומה לנועם באופטימיות הקוסמית שלו?",
        options: ["אור", "אלון", "אליה", "[בחירה חופשית]"],
        correctIndex: 3,
        difficulty: 2,
        timeLimit: 20
    },
    {
        category: "חברים - הצבעה",
        question: "מי מהחברים (דני תומר גיל ארז יזהר) הכי זורם עם נועם על נס קפה ב-2 בלילה?",
        options: ["דני", "תומר", "ארז", "[בחירה חופשית]"],
        correctIndex: 3,
        difficulty: 2,
        timeLimit: 20
    },
    {
        category: "אתגר - חיקוי",
        question: "תעשה חיקוי של נועם דופק את \"חיוך החנופה\" למורה רונית כדי לבטל מבחן",
        options: ["בוצע בהצלחה", "נכשל", "ויתר", ""],
        correctIndex: 0,
        difficulty: 3,
        timeLimit: 30
    },

    // ========== HARD LEVEL (Difficulty 3) - 3 Questions ==========

    {
        category: "אתגר - משחק תפקידים",
        question: "דמיין שאתה אווה - תן לנועם \"נזיפה פולנית\" מתל אביב על זה שהוא שוב ב-AI",
        options: ["בוצע בהצלחה", "נכשל", "ויתר", ""],
        correctIndex: 0,
        difficulty: 3,
        timeLimit: 30
    },
    {
        category: "אתגר - זיכרון",
        question: "תעמוד על רגל אחת ותגיד את השמות של כל האקסיות והחברים של נועם בלי להתבלבל",
        options: ["בוצע בהצלחה", "נכשל", "ויתר", ""],
        correctIndex: 0,
        difficulty: 3,
        timeLimit: 30
    },
    {
        category: "בונוס - ידע כללי",
        question: "איזה תחביב נועם אוהב הכי הרבה?",
        options: ["רכיבה בשטח עם החברים", "לפתח AI בלילות ארוכים", "לשתות נס קפה עם החבר'ה", "כל התשובות נכונות"],
        correctIndex: 3,
        difficulty: 2,
        timeLimit: 20
    }
];

export const noamPunishments = [
    { text: "תעשה חיקוי של נועם עושה את 'חיוך החנופה' למורה!", duration: 20 },
    { text: "תדבר במבטא פולני כמו אווה למשך 30 שניות!", duration: 30 },
    { text: "תגיד 3 דברים שאתה אוהב בנועם - על זמן!", duration: 25 },
    { text: "תעשה פנטומימה של נועם נוהג באוטו של אבא לשטח!", duration: 25 },
    { text: "תספר בקצרה על פעם שנועם הצחיק אותך!", duration: 30 },
    { text: "תעמוד בפוזה של 'מתכנת AI' למשך 15 שניות!", duration: 20 },
    { text: "תשיר 'יום הולדת שמח לנועם' בקול מצחיק!", duration: 25 },
    { text: "תחקה את נועם בוקר אחרי לילה ארוך עם נס קפה!", duration: 20 },
    { text: "תעשה ריקוד ניצחון בסגנון של נועם!", duration: 20 },
    { text: "תספר בדיחה על AI או תכנות (או תמציא אחת)!", duration: 30 },
    { text: "תעשה 10 כפיפות בטן - אימון שטח כמו נועם!", duration: 30 },
    { text: "תגיד את השמות של כל החברים של נועם שאתה זוכר!", duration: 25 },
    { text: "תחקה שיחת טלפון בין נועם לאווה!", duration: 30 },
    { text: "תעשה פוזה של 'גיימר פרו' למשך 20 שניות!", duration: 25 },
    { text: "תצעק 'נועם האגדה!' 3 פעמים ברצף!", duration: 15 },
    { text: "תעשה תנועות של טייפיסט מהיר על מקלדת דמיונית!", duration: 20 },
    { text: "תספר זיכרון אחד או עובדה על נועם שאתה אוהב!", duration: 30 },
    { text: "תעשה את ריקוד ה-Fortnite הכי מטומטם!", duration: 25 },
    { text: "תחקה את נועם מסביר משהו טכני מסובך!", duration: 25 },
    { text: "תעשה 'L' עם האצבעות ותצעק 'Legend Mode Activated!'", duration: 15 }
];

export const noamPack = {
    id: "noam",
    title: { en: "Noam the Legend", he: "נועם האגדה" },
    metadata: {
        themeColor: "#00FF88",  // Energetic neon green - gaming/tech vibe
        icon: "🎮",  // Gaming controller icon
        bgImage: `${import.meta.env.BASE_URL}assets/noam_bg.png`,
        isProtected: true,  // Password protected game
        password: "1818"  // Password for access (client-side only - not secure)
    },
    questions: noamQuestions,
    punishments: noamPunishments,
    version: "2.0"
};
