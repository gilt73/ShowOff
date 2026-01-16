// Sports Trivia Questions
// Edit this file to add, modify, or remove questions

export const sportsQuestions = [
    {
        category: "Football",
        question: "Who won the 2022 FIFA World Cup?",
        options: ["France", "Brazil", "Argentina", "Germany"],
        correctIndex: 2,
        penaltyTask: "Do 10 pushups immediately!"
    },
    {
        category: "Basketball",
        question: "Which NBA player is known as 'The King'?",
        options: ["Steph Curry", "Kevin Durant", "LeBron James", "Michael Jordan"],
        correctIndex: 2,
        penaltyTask: "Act like a basketball hoop while someone shoots a paper ball!"
    },
    {
        category: "Swimming",
        question: "How many gold medals does Michael Phelps have?",
        options: ["23", "18", "28", "12"],
        correctIndex: 0,
        penaltyTask: "Swim on the floor for 10 seconds!"
    },
    {
        category: "Football",
        question: "Which country has won the most FIFA World Cups?",
        options: ["Germany", "Argentina", "Brazil", "Italy"],
        correctIndex: 2,
        penaltyTask: "Do your best soccer celebration dance!"
    },
    {
        category: "Basketball",
        question: "How many NBA championships did Michael Jordan win?",
        options: ["4", "5", "6", "7"],
        correctIndex: 2,
        penaltyTask: "Do your best Michael Jordan tongue-out impression!"
    },
    {
        category: "Tennis",
        question: "Who has won the most Grand Slam titles in men's tennis?",
        options: ["Roger Federer", "Rafael Nadal", "Novak Djokovic", "Pete Sampras"],
        correctIndex: 2,
        penaltyTask: "Pretend to serve an invisible tennis ball with full emotion!"
    },
    {
        category: "Olympics",
        question: "Which city hosted the 2020 Summer Olympics?",
        options: ["Beijing", "Paris", "Tokyo", "London"],
        correctIndex: 2,
        penaltyTask: "Do an Olympic pose and hold it for 10 seconds!"
    },
    {
        category: "Football",
        question: "Who is the all-time top scorer in the Premier League?",
        options: ["Wayne Rooney", "Alan Shearer", "Thierry Henry", "Sergio Aguero"],
        correctIndex: 1,
        penaltyTask: "Commentate on an imaginary goal in an excited voice!"
    },
    {
        category: "Basketball",
        question: "Which team has won the most NBA championships?",
        options: ["Los Angeles Lakers", "Chicago Bulls", "Boston Celtics", "Golden State Warriors"],
        correctIndex: 2,
        penaltyTask: "Spin a ball on your finger (or pretend to)!"
    },
    {
        category: "Boxing",
        question: "What is Muhammad Ali's famous catchphrase?",
        options: ["I am the best!", "Float like a butterfly, sting like a bee", "Knock out king", "The Greatest Show"],
        correctIndex: 1,
        penaltyTask: "Shadow box for 15 seconds!"
    },
    {
        category: "Football",
        question: "Which player has scored the most goals in football history?",
        options: ["Lionel Messi", "Cristiano Ronaldo", "Pelé", "Diego Maradona"],
        correctIndex: 1,
        penaltyTask: "Do Ronaldo's 'SIUU' celebration!"
    },
    {
        category: "Athletics",
        question: "Who holds the world record for the 100m sprint?",
        options: ["Tyson Gay", "Usain Bolt", "Carl Lewis", "Justin Gatlin"],
        correctIndex: 1,
        penaltyTask: "Run in place as fast as you can for 10 seconds!"
    },
    {
        category: "Golf",
        question: "How many majors has Tiger Woods won?",
        options: ["12", "15", "18", "20"],
        correctIndex: 1,
        penaltyTask: "Do a golf swing in slow motion!"
    },
    {
        category: "Football",
        question: "Which team won the first ever Super Bowl?",
        options: ["Dallas Cowboys", "Green Bay Packers", "New England Patriots", "Pittsburgh Steelers"],
        correctIndex: 1,
        penaltyTask: "Do a touchdown dance!"
    },
    {
        category: "Hockey",
        question: "Who is known as 'The Great One' in hockey?",
        options: ["Mario Lemieux", "Wayne Gretzky", "Sidney Crosby", "Bobby Orr"],
        correctIndex: 1,
        penaltyTask: "Pretend to skate and score a goal!"
    },
    {
        category: "Baseball",
        question: "How many players are on a baseball team on the field?",
        options: ["8", "9", "10", "11"],
        correctIndex: 1,
        penaltyTask: "Do a baseball batting stance and swing!"
    },
    {
        category: "Soccer",
        question: "Which club has won the most UEFA Champions League titles?",
        options: ["Barcelona", "AC Milan", "Real Madrid", "Bayern Munich"],
        correctIndex: 2,
        penaltyTask: "Sing 'The Champions' anthem badly!"
    },
    {
        category: "Formula 1",
        question: "Who has won the most F1 World Championships?",
        options: ["Michael Schumacher", "Lewis Hamilton", "Ayrton Senna", "Sebastian Vettel"],
        correctIndex: 1,
        penaltyTask: "Make race car sounds for 10 seconds!"
    }
];

export const sportsPack = {
    id: "sports",
    title: { en: "Sports Trivia", he: "טריוויה ספורט" },
    bgImage: "/assets/bg.png",
    questions: sportsQuestions
};
