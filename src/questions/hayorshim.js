// Descendants (היורשים) Movie Questions (Hebrew)
// Optimized for G.T Studio - ShowOff App

export const hayorshimQuestions = [
    {
        category: "דמויות",
        question: "מי היא אמא של מאל?",
        options: ["המלכה הרעה", "מליפיסנט", "אורסולה", "קרואלה דה ויל"],
        correctIndex: 1,
        penaltyTask: "תעשה צחוק מרושע של נבל הכי חזק שאתה יכול!"
    },
    {
        category: "מקומות",
        question: "איך קוראים לאי שבו כל הנבלים כלואים?",
        options: ["אי האבודים", "אורדון", "ארץ לעולם לא", "האי המקולל"],
        correctIndex: 0,
        penaltyTask: "תעמוד בפינה ותגיד 'אני תקוע על אי בודד' 5 פעמים בדרמטיות!"
    },
    {
        category: "דמויות",
        question: "מה הכוח המיוחד של איווי (הבת של המלכה הרעה)?",
        options: ["שינוי צורה", "כישוף באש", "תקשורת עם מראת הקסמים", "תעופה"],
        correctIndex: 2,
        penaltyTask: "תסתכל במראה (או במצלמת הטלפון) ותחמיא לעצמך במשך דקה!"
    },
    {
        category: "עלילה",
        question: "איזה חיה קרלוס (הבן של קרואלה) פחד ממנה בהתחלה?",
        options: ["חתולים", "עכברים", "כלבים", "נחשים"],
        correctIndex: 2,
        penaltyTask: "תנבח כמו כלב עד שהתור הבא יתחיל!"
    },
    {
        category: "רומנטיקה",
        question: "מי הוא אביו של הנסיך בן?",
        options: ["ג'אפר", "המלך אדם (החיה)", "הרקולס", "הנסיך אריק"],
        correctIndex: 1,
        penaltyTask: "תציע נישואין לאחד האנשים בחדר בצורה הכי מוגזמת שיש!"
    },
    {
        category: "שירים",
        question: "מהו שיר הפתיחה האייקוני של הסרט הראשון?",
        options: ["Ways to be Wicked", "Chillin' Like a Villain", "Rotten to the Core", "Night Falls"],
        correctIndex: 2,
        penaltyTask: "תשיר את הפזמון של 'Rotten to the Core' בריקוד!"
    },
    {
        category: "חפצי קסם",
        question: "מה מאל מנסה לגנוב בטקס ההכתרה של בן?",
        options: ["את הכתר", "את השרביט של הפיה הסנדקית", "את מראת הקסמים", "את תפוח הרעל"],
        correctIndex: 1,
        penaltyTask: "תנסה 'לגנוב' חפץ מהשולחן בלי שאף אחד ישים לב!"
    },
    {
        category: "דמויות",
        question: "מי הוא הבן של ג'אפר?",
        options: ["גיל", "הארי", "ג'יי", "צ'אד"],
        correctIndex: 2,
        penaltyTask: "תעשה 10 שכיבות סמיכה (ג'יי אוהב ספורט!)"
    },
    {
        category: "היורשים 2",
        question: "מי היא האויבת העיקרית של מאל בסרט השני?",
        options: ["אומה (הבת של אורסולה)", "אודרי", "מליפיסנט", "דיזי"],
        correctIndex: 0,
        penaltyTask: "תעשה חיקוי של תמנון עם הידיים!"
    },
    {
        category: "פרטים קטנים",
        question: "מה מאל הופכת להיות בסוף הקרב הגדול בסרט הראשון?",
        options: ["ציפור", "לטאה קטנה", "דרקון ענק", "פסל של אבן"],
        correctIndex: 1,
        penaltyTask: "תזחל על הרצפה כמו לטאה במשך 20 שניות!"
    },
    {
        category: "ספורט",
        question: "איזה משחק ספורט פופולרי באקדמיית אורדון?",
        options: ["קווידיץ'", "טורני (Tourney)", "כדורסל קסמים", "מרוץ דרקונים"],
        correctIndex: 1,
        penaltyTask: "תעשה תנועות של שחקן פוטבול שמבקיע טאצ'דאון!"
    },
    {
        category: "היורשים 3",
        question: "מי מתגלה כאבא של מאל בסרט השלישי?",
        options: ["זאוס", "האדס", "קפטן הוק", "גסטון"],
        correctIndex: 1,
        penaltyTask: "תעשה פרצוף כועס ותגיד 'אני אל השאול!'"
    }
];

export const hayorshimPack = {
    id: "hayorshim",
    title: { en: "Descendants", he: "היורשים" },
    bgImage: "/assets/hayorshim_bg.png",
    questions: hayorshimQuestions
};