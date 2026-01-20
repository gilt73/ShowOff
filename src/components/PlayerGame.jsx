import { useState, useEffect, useRef } from 'react';
import { ref, set, onValue, get, child, update } from "firebase/database";
import { db } from '../firebaseConfig';
import { gamePacks, uiText } from '../questions';

export default function PlayerGame() {
    const [joined, setJoined] = useState(false);
    const [roomCode, setRoomCode] = useState("");
    const [nickname, setNickname] = useState("");

    // Game State from Host
    const [lang, setLang] = useState('en');
    const [packId, setPackId] = useState('sports');
    const [gameState, setGameState] = useState("LOBBY");
    const [timer, setTimer] = useState(15);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);

    const [selectedOption, setSelectedOption] = useState(null);
    const [players, setPlayers] = useState({});
    const [shuffledQuestions, setShuffledQuestions] = useState(null);

    // Ref to track answered status independently of render cycles (Fix for rapid-fire clicks)
    const answeredRef = useRef(false);
    const [serverQuestion, setServerQuestion] = useState(null);

    // Helpers
    const t = (key) => uiText[lang][key];
    const currentPack = gamePacks[packId] || gamePacks.sports;

    useEffect(() => {
        // Hydrate from LocalStorage (Fix for identity loss on reload)
        const savedSession = localStorage.getItem('showoff_user');
        if (savedSession) {
            try {
                const { roomCode: savedCode, nickname: savedName } = JSON.parse(savedSession);
                if (savedCode) setRoomCode(savedCode);
                if (savedName) setNickname(savedName);
            } catch (e) {
                console.error("Failed to load session", e);
            }
        }

        const params = new URLSearchParams(window.location.search);
        const codeParam = params.get("code");
        if (codeParam) {
            setRoomCode(codeParam.toUpperCase());
        }
    }, []);

    useEffect(() => {
        if (joined && roomCode) {
            const roomRef = ref(db, `rooms/${roomCode}`);
            onValue(roomRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Sync Config
                    if (data.lang) setLang(data.lang);
                    if (data.pack) setPackId(data.pack);
                    if (data.timer !== undefined) setTimer(data.timer);

                    // State changed
                    if (data.gameState !== gameState || data.currentQuestionIndex !== questionIndex) {
                        // Reset local round state
                        setHasAnswered(false);
                        answeredRef.current = false; // Reset Ref
                        setIsCorrect(null);
                        setSelectedOption(null);
                    }
                    if (data.players) {
                        setPlayers(data.players);

                        // Restore state if this player exists
                        const myPlayer = data.players[nickname];
                        if (myPlayer && myPlayer.answered) {
                            setHasAnswered(true);
                            answeredRef.current = true; // Sync Ref
                            setSelectedOption(myPlayer.selectedOption);

                            // Re-calculate correctness using shuffled questions if available
                            const qIdx = data.currentQuestionIndex;
                            let q;
                            if (data.shuffledQuestions && data.shuffledQuestions.length > 0) {
                                // Find question in pack by matching question text
                                const pId = data.pack || packId;
                                const packs = gamePacks[pId] || gamePacks.sports;
                                q = packs.questions.find(pq => pq.question === data.shuffledQuestions[qIdx]);
                            } else {
                                const pId = data.pack || packId;
                                const packs = gamePacks[pId] || gamePacks.sports;
                                q = packs.questions[qIdx];
                            }
                            if (q) {
                                setIsCorrect(myPlayer.selectedOption === q.correctIndex);
                            }
                        }
                    }

                    // Sync shuffled questions from host
                    if (data.shuffledQuestions) {
                        setShuffledQuestions(data.shuffledQuestions);
                    }

                    if (data.currentQuestion) {
                        setServerQuestion(data.currentQuestion);
                    }
                    if (data.timer !== undefined) {
                        setTimer(data.timer);
                    }



                    setGameState(data.gameState);
                    setQuestionIndex(data.currentQuestionIndex);
                } else {
                    // Room deleted or invalid
                    setJoined(false);
                    alert("Room ended or does not exist.");
                }
            });
        }
    }, [joined, roomCode, gameState, questionIndex, nickname, packId]);

    const joinGame = async () => {
        if (!roomCode || !nickname) return alert("Fill in all fields!");

        const code = roomCode.toUpperCase();
        const dbRef = ref(db);

        try {
            // Check Room Status
            const roomSnap = await get(child(dbRef, `rooms/${code}`));
            if (!roomSnap.exists()) {
                return alert("Room not found!");
            }

            const roomData = roomSnap.val();
            const currentPlayers = roomData.players || {};

            if (Object.keys(currentPlayers).length >= 20) {
                return alert(roomData.lang === 'he' ? "החדר מלא!" : "Room is Full!");
            }

            // check if name taken? (Optional, skipping for speed)

            // Join
            const playerRef = ref(db, `rooms/${code}/players/${nickname}`);
            const playerSnap = await get(playerRef);

            if (!playerSnap.exists()) {
                await set(playerRef, {
                    nickname: nickname,
                    score: 0,
                    answered: false
                });
            } else {
                // Player exists, just reconnecting. 
                // We might want to notify them or verify it's them, but for this simple app, we assume it's the same person.
            }

            // Save session
            localStorage.setItem('showoff_user', JSON.stringify({ roomCode: code, nickname: nickname }));

            setRoomCode(code);
            setJoined(true);
        } catch (error) {
            console.error(error);
            alert("Error joining room");
        }
    };

    const submitAnswer = async (optionIndex) => {
        if (hasAnswered || answeredRef.current) return; // Double Guard
        setHasAnswered(true);
        answeredRef.current = true; // Lock immediately
        setSelectedOption(optionIndex);

        // Get current question - use shuffled questions if available
        let currentQ;
        if (shuffledQuestions && shuffledQuestions.length > 0) {
            // Find question by matching text from shuffled array
            currentQ = currentPack.questions.find(q => q.question === shuffledQuestions[questionIndex]);
        } else {
            currentQ = currentPack.questions[questionIndex];
        }

        const correct = currentQ && optionIndex === currentQ.correctIndex;

        if (correct) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }

        // Sync to Firebase
        const playerRef = ref(db, `rooms/${roomCode}/players/${nickname}`);
        await update(playerRef, {
            answered: true,
            selectedOption: optionIndex,
            lastAnswer: optionIndex,  // Track for punishment selection
            score: correct ? (players[nickname]?.score || 0) + 10 : (players[nickname]?.score || 0)
        });
    };

    // UI Renders
    if (!joined) {
        return (
            <div className="min-h-screen bg-showoff-bg flex flex-col items-center justify-center p-6 space-y-6">
                <h1 className="text-4xl font-black text-white mb-4">{lang === 'he' ? 'הצטרף למסיבה' : 'Join Party'}</h1>
                <input
                    type="text"
                    placeholder="ROOM CODE"
                    className="input-glass w-full max-w-xs uppercase text-center"
                    maxLength={4}
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="NICKNAME"
                    className="input-glass w-full max-w-xs text-center"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <button onClick={joinGame} className="btn-primary w-full max-w-xs">
                    ENTER
                </button>
            </div>
        );
    }

    // Get current question - PRIORITY: use serverQuestion from Firebase (synced from host)
    // Fallback to local shuffled questions or pack questions
    let currentQ = serverQuestion; // Use synced question from host first
    if (!currentQ || !currentQ.question) {
        // Fallback to local calculation if serverQuestion isn't available yet
        if (shuffledQuestions && shuffledQuestions.length > 0) {
            currentQ = currentPack.questions.find(q => q.question === shuffledQuestions[questionIndex]) || {};
        } else {
            currentQ = currentPack.questions[questionIndex] || {};
        }
    }

    // Calculate Rank
    const sortedPlayers = Object.values(players).sort((a, b) => (b.score || 0) - (a.score || 0));
    const myRank = sortedPlayers.findIndex(p => p.nickname === nickname) + 1;
    const myScore = players[nickname]?.score || 0;

    return (
        <div className="min-h-screen bg-showoff-bg text-white flex flex-col relative overflow-hidden font-sans" dir={lang === 'he' ? 'rtl' : 'ltr'}>
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-showoff-bg" />
                <div className="absolute top-0 left-0 w-full h-1/2 bg-purple-900/20 blur-3xl rounded-full transform -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-full h-1/2 bg-blue-900/20 blur-3xl rounded-full transform translate-y-1/2" />
                <img src="/assets/bg.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-5 mix-blend-overlay" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col p-6">
                {/* Top Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-showoff-electric to-blue-500 flex items-center justify-center text-xl font-black shadow-lg ring-2 ring-white/20">
                            {nickname.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-bold text-lg leading-none">{nickname}</div>
                            <div className="text-xs text-white/60 font-mono tracking-wider">#{roomCode}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-showoff-electric">
                            <span className="text-xl">🏆</span>
                            <span className="font-black text-xl">#{myRank}</span>
                        </div>
                        <div className="text-xs text-white/50">{myScore} pts</div>
                    </div>
                </div>

                {/* Timer */}
                {gameState === "QUESTION" && (
                    <div className="w-full h-4 bg-gray-800 rounded-full mb-8 overflow-hidden relative shadow-inner border border-white/10">
                        <div
                            className="h-full bg-gradient-to-r from-showoff-electric to-showoff-accent transition-all duration-1000 ease-linear progress-bar-glow"
                            style={{ width: `${(timer / 15) * 100}%` }}
                        />
                    </div>
                )}

                {/* Main Game Area */}
                <div className="flex-1 flex flex-col">

                    {gameState === "LOBBY" && (
                        <div className="flex-1 flex flex-col items-center justify-center animate-pulse text-center space-y-4">
                            <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(233,69,96,0.3)]">
                                <span className="text-6xl">⏳</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-widest uppercase">{t('waiting')}</h2>
                                <p className="text-showoff-electric font-medium">{currentPack.title[lang]}</p>
                            </div>
                        </div>
                    )}

                    {gameState === "QUESTION" && (
                        <div className="flex-1 flex flex-col animate-pop">
                            {/* Question Display */}
                            <div className="flex-1 flex flex-col items-center justify-center mb-8 text-center px-4">
                                <span className="text-showoff-electric text-sm tracking-[0.2em] font-bold mb-3 uppercase">
                                    {currentQ.category || "Question"}
                                </span>
                                <h3 className="text-xl md:text-2xl font-black text-white leading-tight max-w-[90%]">
                                    {serverQuestion || currentQ.question || "Loading question..."}
                                </h3>
                            </div>

                            {/* Answer Grid */}
                            <div className={`grid grid-cols-2 gap-4 ${hasAnswered ? 'pointer-events-none opacity-80' : ''}`}>
                                {['A', 'B', 'C', 'D'].map((label, idx) => {
                                    const isSelected = selectedOption === idx;
                                    const optionText = currentQ.options?.[idx] || label;
                                    const styles = [
                                        'btn-answer-a', // 0
                                        'btn-answer-b', // 1
                                        'btn-answer-c', // 2
                                        'btn-answer-d'  // 3
                                    ];

                                    return (
                                        <button
                                            key={idx}
                                            disabled={hasAnswered}
                                            onClick={() => submitAnswer(idx)}
                                            className={`
                                                btn-answer ${styles[idx]}
                                                ${hasAnswered && !isSelected ? 'opacity-30 grayscale scale-95' : ''}
                                                ${hasAnswered && isSelected ? 'ring-4 ring-white scale-105 shadow-[0_0_30px_rgba(255,255,255,0.5)]' : ''}
                                            `}
                                        >
                                            <div className="flex flex-col items-center justify-center gap-1">
                                                <span className="text-3xl font-black">{label}</span>
                                                <span className="text-sm font-medium opacity-90 leading-tight">{optionText}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Punishment / Scoreboard Views */}
                    {(gameState === "PENALTY" || gameState === "SCOREBOARD") && (
                        <div className="flex-1 flex flex-col items-center justify-center animate-pop">
                            <div className={`
                                w-full aspect-square max-w-[300px] rounded-3xl flex flex-col items-center justify-center p-8
                                backdrop-blur-md border border-white/20 shadow-2xl
                                ${isCorrect ? 'bg-gradient-to-br from-green-500/20 to-emerald-900/40 border-green-500/30' : 'bg-gradient-to-br from-red-500/20 to-rose-900/40 border-red-500/30'}
                            `}>
                                <div className="text-8xl mb-4 filter drop-shadow-lg">
                                    {isCorrect ? '🌟' : (gameState === "PENALTY" ? '💀' : '❌')}
                                </div>
                                <h2 className={`text-4xl font-black mb-2 tracking-wide ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                    {isCorrect ? 'CORRECT!' : 'WRONG!'}
                                </h2>
                                {!isCorrect && gameState === "PENALTY" && (
                                    <div className="mt-4 bg-black/40 p-4 rounded-xl w-full text-center border border-red-500/20">
                                        <p className="text-red-200 font-medium text-lg leading-tight">{t('penalty')}</p>
                                    </div>
                                )}
                                <div className="mt-6 flex flex-col items-center">
                                    <span className="text-white/40 text-xs uppercase tracking-widest mb-1">Current Score</span>
                                    <span className="text-4xl font-mono font-bold text-white">{players[nickname]?.score || 0}</span>
                                </div>
                            </div>
                            <p className="mt-8 text-showoff-electric/60 animate-pulse text-sm font-mono tracking-widest">
                                WAITING FOR HOST...
                            </p>
                        </div>
                    )}

                    {gameState === "GAME_OVER" && (
                        <div className="flex-1 flex flex-col items-center justify-center animate-pop space-y-6">
                            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-showoff-electric text-center leading-tight">
                                {lang === 'he' ? 'סוף המשחק!' : 'GAME OVER!'}
                            </h2>

                            <div className="card-glass w-full text-center transform hover:scale-105 transition-transform duration-500">
                                <div className="text-xl text-white/50 font-bold mb-2 uppercase tracking-widest">{lang === 'he' ? 'הדירוג שלך' : 'YOUR RANK'}</div>
                                <div className="text-8xl mb-2 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                                    {myRank === 1 ? '🥇' : (myRank === 2 ? '🥈' : (myRank === 3 ? '🥉' : `#${myRank}`))}
                                </div>
                                <div className="text-sm text-showoff-electric font-bold uppercase tracking-widest">
                                    {lang === 'he' ? 'מתוך' : 'out of'} {Object.keys(players).length} {lang === 'he' ? 'שחקנים' : 'players'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
