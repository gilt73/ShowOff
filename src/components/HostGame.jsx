import { useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import { ref, set, onValue, update } from "firebase/database";
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { gamePacks, uiText, shuffleArray, selectDifficultyBasedQuestions } from '../questions';

export default function HostGame() {
    const [searchParams] = useSearchParams();
    const packId = searchParams.get('pack') || 'sports';
    const lang = searchParams.get('lang') || 'en';
    const gameMode = searchParams.get('mode') || 'penalty';

    // Helper for text
    const t = (key) => uiText[lang][key];
    const currentPack = gamePacks[packId] || gamePacks.sports;

    const [roomCode, setRoomCode] = useState("");
    const [gameState, setGameState] = useState("LOBBY"); // LOBBY, QUESTION, PENALTY, SCOREBOARD, GAME_OVER
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timer, setTimer] = useState(10);
    const [players, setPlayers] = useState({});
    const [totalRounds, setTotalRounds] = useState(7);
    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [selectedPunishmentPlayer, setSelectedPunishmentPlayer] = useState(null);

    // Hybrid Host Mode
    const [hostNickname, setHostNickname] = useState("");
    const [isHostPlaying, setIsHostPlaying] = useState(false);
    const [hostSelection, setHostSelection] = useState(null);
    const [hostHasAnswered, setHostHasAnswered] = useState(false);

    // TV Mode State
    const [isTVMode, setIsTVMode] = useState(false);

    // Dynamic clean styles for TV Safe Zone
    const safeZoneClass = isTVMode ? "p-[5%]" : "p-4 md:p-8";
    const buttonSize = isTVMode ? "text-3xl px-16 py-6" : "text-xl md:text-2xl px-12 py-4";


    useEffect(() => {
        // Generate Room Code
        const code = Math.random().toString(36).substring(2, 6).toUpperCase();
        setRoomCode(code);

        // Initialize Room in Firebase
        const roomRef = ref(db, `rooms/${code}`);
        set(roomRef, {
            gameState: "LOBBY",
            currentQuestionIndex: 0,
            timer: 10,
            players: {},
            pack: packId,
            lang: lang,
            mode: gameMode,
            totalRounds: 7
        });

        // Listen for Players joining
        const playersRef = ref(db, `rooms/${code}/players`);
        onValue(playersRef, (snapshot) => {
            if (snapshot.exists()) {
                setPlayers(snapshot.val());
            } else {
                setPlayers({});
            }
        });

        // Listen for selected punishment player
        const punishmentRef = ref(db, `rooms/${code}/selectedPunishmentPlayer`);
        onValue(punishmentRef, (snapshot) => {
            setSelectedPunishmentPlayer(snapshot.val());
        });

        // Cleanup on unmount (optional: remove room)
        return () => {
            // set(roomRef, null); // Uncomment to delete room on leave
        }
    }, [packId, lang]);

    // Timer & Auto-Advance Logic
    useEffect(() => {
        if (gameState === "QUESTION") {
            // Check if everyone answered
            const allPlayersAnswered = Object.values(players).length > 0 && Object.values(players).every(p => p.answered);

            const goToNextState = () => {
                // Select punishment player before showing penalty screen
                if (gameMode === 'penalty') {
                    const selectedPlayer = selectPlayerForPunishment();
                    update(ref(db, `rooms/${roomCode}`), {
                        selectedPunishmentPlayer: selectedPlayer
                    });
                }
                const nextState = gameMode === 'classic' ? "SCOREBOARD" : "PENALTY";
                setGameState(nextState);
                update(ref(db, `rooms/${roomCode}`), { gameState: nextState });
            };

            if (allPlayersAnswered) {
                goToNextState();
                return;
            }

            if (timer > 0) {
                const interval = setInterval(() => {
                    setTimer((prev) => {
                        const newVal = prev - 1;
                        update(ref(db, `rooms/${roomCode}`), { timer: newVal });
                        return newVal;
                    });
                }, 1000);
                return () => clearInterval(interval);
            } else if (timer === 0) {
                goToNextState();
            }
        }
    }, [gameState, timer, roomCode, players, gameMode]);


    const startHostGame = async () => {
        // If host is playing, register them
        if (isHostPlaying && hostNickname) {
            const playerRef = ref(db, `rooms/${roomCode}/players/${hostNickname}`);
            await set(playerRef, {
                nickname: hostNickname,
                score: 0,
                answered: false
            });
        }
        startGame();
    };

    const startGame = () => {
        // Use difficulty-based selection for v2.0 games, shuffleArray for legacy
        const shuffled = selectDifficultyBasedQuestions(currentPack);
        setShuffledQuestions(shuffled);
        setCurrentQuestionIndex(0);
        setGameState("QUESTION");
        setHostHasAnswered(false);
        setHostSelection(null);

        // Adjust totalRounds based on game version
        const rounds = currentPack.version === "2.0" ? Math.min(15, shuffled.length) : Math.min(totalRounds, shuffled.length);
        setTotalRounds(rounds);

        // Store shuffled question IDs in Firebase for players
        const firstQ = shuffled[0];
        update(ref(db, `rooms/${roomCode}`), {
            gameState: "QUESTION",
            currentQuestionIndex: 0,
            timer: 10,
            totalRounds: rounds,
            shuffledQuestions: shuffled.map(q => q.question), // Store question text for sync
            currentQuestion: firstQ // SYNC FULL QUESTION OBJECT
        });
    };

    const nextQuestion = () => {
        let currentShuffled = shuffledQuestions;
        let cIndex = currentQuestionIndex;

        // Fallback or Recovery if state is lost (e.g. hot reload)
        if (!currentShuffled || currentShuffled.length === 0) {
            console.warn("Lost shuffled questions state, attempting to recover...");
            // Try to recover from current pack if we can't find them
            // In a real app we'd fetch from Firebase 'shuffledQuestions' node here, 
            // but since we are inside a sync function, we'll try to use the derived pack.
            // A better approach is to rely on index if shuffling isn't critical or re-shuffle.
            // For now, let's just re-shuffle safely or grab from pack.
            currentShuffled = [...currentPack.questions];
            // If we want to be smarter, we should have listened to 'shuffledQuestions' in onValue too?
            // Host writes it but doesn't listen to it usually.
            // Let's just reset to pack order to avoid crashing.
            setShuffledQuestions(currentShuffled);
        }

        const nextIdx = cIndex + 1;

        // Check if game is over - use totalRounds as the limit
        if (nextIdx >= totalRounds) {
            setGameState("GAME_OVER");
            update(ref(db, `rooms/${roomCode}`), { gameState: "GAME_OVER" });
            return;
        }

        const nextQ = currentShuffled[nextIdx] || currentPack.questions[nextIdx]; // Double fallback

        if (!nextQ) {
            console.error("No next question found!");
            return;
        }

        setCurrentQuestionIndex(nextIdx);
        setGameState("QUESTION");
        setTimer(10);

        // Reset Host State
        setHostHasAnswered(false);
        setHostSelection(null);

        // Reset players answered status
        const updates = {};
        Object.keys(players).forEach(key => {
            updates[`rooms/${roomCode}/players/${key}/answered`] = false;
        });
        updates[`rooms/${roomCode}/gameState`] = "QUESTION";
        updates[`rooms/${roomCode}/currentQuestionIndex`] = nextIdx;
        updates[`rooms/${roomCode}/timer`] = 10;
        updates[`rooms/${roomCode}/currentQuestion`] = nextQ; // SYNC FULL QUESTION OBJECT

        update(ref(db), updates);
    };

    const handleHostAnswer = async (idx) => {
        if (!isHostPlaying || hostHasAnswered) return;
        setHostHasAnswered(true);
        setHostSelection(idx);

        const correct = idx === currentQ.correctIndex;

        const playerRef = ref(db, `rooms/${roomCode}/players/${hostNickname}`);
        await update(playerRef, {
            answered: true,
            selectedOption: idx,
            lastAnswer: idx,
            score: correct ? (players[hostNickname]?.score || 0) + 10 : (players[hostNickname]?.score || 0)
        });
    };

    const playAgain = () => {
        setCurrentQuestionIndex(0);
        setGameState("LOBBY");
        // Reset all player scores
        const updates = {};
        Object.keys(players).forEach(key => {
            updates[`rooms/${roomCode}/players/${key}/score`] = 0;
            updates[`rooms/${roomCode}/players/${key}/answered`] = false;
        });
        updates[`rooms/${roomCode}/gameState`] = "LOBBY";
        updates[`rooms/${roomCode}/currentQuestionIndex`] = 0;
        update(ref(db), updates);
    };

    // Select player for punishment (weighted random from incorrect answers)
    const selectPlayerForPunishment = () => {
        const correctIndex = currentQ.correctIndex;

        // Filter players who answered incorrectly
        const incorrectPlayers = Object.entries(players)
            .filter(([id, player]) =>
                player.answered &&
                player.lastAnswer !== undefined &&
                player.lastAnswer !== correctIndex
            );

        if (incorrectPlayers.length === 0) return null;

        // Weighted random selection (favor players punished less)
        const weights = incorrectPlayers.map(([id, player]) => {
            const timesPunished = player.punishmentCount || 0;
            return 1 / (timesPunished + 1);
        });

        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < incorrectPlayers.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                const [playerId, player] = incorrectPlayers[i];

                // Update punishment count
                update(ref(db, `rooms/${roomCode}/players/${playerId}`), {
                    punishmentCount: (player.punishmentCount || 0) + 1
                });

                return playerId;
            }
        }

        // Fallback
        return incorrectPlayers[0][0];
    };

    // Get current question from shuffled array (or fallback to original pack)
    const currentQ = shuffledQuestions.length > 0
        ? shuffledQuestions[currentQuestionIndex]
        : currentPack.questions[currentQuestionIndex];

    return (
        <div className={`h-screen w-screen overflow-hidden flex flex-col items-center bg-black text-white relative selection:bg-showoff-accent selection:text-black ${isTVMode ? 'text-2xl' : ''}`} dir={lang === 'he' ? 'rtl' : 'ltr'}>

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img src={currentPack.bgImage || "/assets/bg.png"} alt="Background" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/60 to-black/80" />
            </div>

            {/* TV Mode Toggle */}
            <button
                onClick={() => setIsTVMode(!isTVMode)}
                className={`absolute top-4 left-4 z-50 p-3 rounded-full backdrop-blur-md border transition-all font-bold shadow-xl flex items-center gap-2 ${isTVMode ? 'bg-showoff-accent text-black border-showoff-accent scale-110' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                title="Toggle TV Mode (Overscan Protection)"
            >
                {isTVMode ? '📺 TV ON' : '📺 TV OFF'}
            </button>

            {/* Header */}
            <div className={`absolute top-4 right-4 bg-white/10 px-6 py-2 rounded-full border border-white/20 z-10 backdrop-blur-md transition-all ${isTVMode ? 'scale-110 origin-top-right' : ''}`}>
                <span className="text-gray-400 mx-2">JOIN CODE:</span>
                <span className="text-3xl font-mono font-bold text-showoff-accent">{roomCode}</span>
            </div>

            <div className={`relative z-10 w-full h-full flex flex-col ${safeZoneClass}`}>
                {gameState === "LOBBY" && (
                    <div className="flex flex-col h-full w-full">
                        {/* Scrollable Center Content */}
                        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 overflow-y-auto overflow-x-hidden pt-16">
                            <h2 className={`${isTVMode ? 'text-6xl' : 'text-3xl md:text-5xl'} font-black mb-4 drop-shadow-lg text-center`}>
                                {Object.keys(players).length > 0 ? (lang === 'he' ? 'מוכנים?' : 'Ready?') : t('waiting')}
                            </h2>
                            <p className="text-lg text-white/60 mb-4">{Object.keys(players).length}/20 Players</p>

                            {/* QR Code */}
                            <div className={`bg-white p-3 rounded-xl mb-6 shadow-2xl transform transition-transform duration-300 ${isTVMode ? 'scale-125 my-8' : 'hover:scale-105'}`}>
                                <QRCode
                                    value={`${window.location.protocol}//${window.location.hostname}:${window.location.port}/play?code=${roomCode}`}
                                    size={isTVMode ? 200 : 150}
                                />
                            </div>
                            <div className="text-lg font-mono text-showoff-accent mb-6 tracking-wider">
                                {t('scan')}
                            </div>

                            {/* Players Grid */}
                            <div className={`grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 w-full max-w-5xl px-4`}>
                                {Object.values(players).map((p, i) => (
                                    <div key={i} className="card-glass text-center animate-pop backdrop-blur-md border border-white/10 p-2">
                                        <div className="text-2xl mb-1">👾</div>
                                        <div className="font-bold text-lg truncate">{p.nickname}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Round Selector */}
                            {Object.keys(players).length > 0 && (
                                <div className="mb-6">
                                    <p className="text-white/60 mb-3 text-center">{t('rounds')}</p>
                                    <div className="flex gap-3">
                                        {[7, 10, 15].map(num => (
                                            <button
                                                key={num}
                                                onClick={() => setTotalRounds(num)}
                                                className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${totalRounds === num
                                                    ? 'bg-showoff-accent text-black scale-110 shadow-lg'
                                                    : 'bg-white/10 text-white hover:bg-white/20'
                                                    }`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pinned Bottom Footer - Replaced with Hybrid Controls or Start Button */}
                        <div className="flex-none flex flex-col items-center justify-center w-full pt-4 pb-8 space-y-4">
                            {/* Host Join Input */}
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isHostPlaying}
                                        onChange={(e) => setIsHostPlaying(e.target.checked)}
                                        className="w-6 h-6 rounded accent-showoff-accent"
                                    />
                                    <span className="font-bold">Play as Host?</span>
                                </label>
                                {isHostPlaying && (
                                    <input
                                        type="text"
                                        placeholder="Your Nickname"
                                        className="bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white"
                                        value={hostNickname}
                                        onChange={(e) => setHostNickname(e.target.value)}
                                    />
                                )}
                            </div>

                            {Object.keys(players).length > 0 ? (
                                <button onClick={startHostGame} className={`btn-primary shadow-xl ${buttonSize}`}>
                                    {t('start')}
                                </button>
                            ) : (
                                <div className="animate-pulse text-lg text-gray-400">Scan QR or enter code to join</div>
                            )}
                        </div>
                    </div>
                )}

                {/* SHARED CONTROL BAR FOR HOST */}
                {gameState !== "LOBBY" && gameState !== "GAME_OVER" && (
                    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 flex items-center justify-between bg-black/80 backdrop-blur-xl border-t border-white/10 shadow-2xl safe-area-pb">
                        <div className="flex items-center gap-4">
                            <div className="text-xs text-gray-400 uppercase tracking-widest">
                                {gameState} • {currentQuestionIndex + 1}/{totalRounds}
                            </div>
                        </div>
                        <button onClick={nextQuestion} className="bg-white text-black font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                            {t('next')} <span className="text-xl">➡️</span>
                        </button>
                    </div>
                )}

                {gameState === "QUESTION" && (
                    <div className="flex flex-col items-center justify-center w-full h-full max-w-4xl animate-pop pb-24">
                        <div className="text-showoff-accent font-bold tracking-widest mb-2 uppercase drop-shadow-lg">{currentQ.category}</div>

                        {/* Hybrid Layout: Show buttons if Host Playing, else Show Big Text */}
                        {isHostPlaying ? (
                            <div className="w-full flex flex-col gap-6">
                                <div className="card-glass p-6 text-center border-2 border-showoff-blue">
                                    <h2 className="text-3xl md:text-4xl font-black leading-tight">{currentQ.question}</h2>
                                </div>
                                {/* Timer */}
                                <div className="w-full bg-gray-800 h-6 rounded-full overflow-hidden border border-gray-700">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-400 to-red-500 transition-all duration-1000 linear"
                                        style={{ width: `${(timer / 10) * 100}%` }}
                                    />
                                </div>

                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${hostHasAnswered ? 'pointer-events-none opacity-80' : ''}`}>
                                    {currentQ.options && currentQ.options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleHostAnswer(idx)}
                                            className={`
                                                py-6 px-6 rounded-xl font-bold text-xl shadow-lg border-b-4 transition-all
                                                ${hostHasAnswered
                                                    ? (idx === currentQ.correctIndex
                                                        ? "bg-green-500 border-green-700 text-white"
                                                        : (idx === hostSelection ? "bg-red-500 border-red-700" : "bg-gray-700 border-gray-900 opacity-40"))
                                                    : "bg-white text-showoff-bg border-gray-300 hover:bg-gray-100 active:scale-95"
                                                }
                                            `}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Classic Projector View
                            <>
                                <div className={`card-glass w-full text-center p-6 md:p-12 mb-8 border-2 border-showoff-blue backdrop-blur-md bg-black/40 flex flex-col justify-center ${isTVMode ? 'flex-1' : ''}`}>
                                    <h2 className={`${isTVMode ? 'text-6xl leading-normal' : 'text-4xl md:text-5xl'} font-bold leading-tight`}>{currentQ.question}</h2>
                                </div>

                                {/* Timer Bar */}
                                <div className="w-full h-8 bg-gray-800 rounded-full overflow-hidden mb-8 border border-gray-700 shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-400 to-red-500 transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                        style={{ width: `${(timer / 10) * 100}%` }}
                                    />
                                </div>
                                <div className="text-6xl font-black drop-shadow-xl">{timer}</div>
                            </>
                        )}
                    </div>
                )}

                {gameState === "PENALTY" && (
                    <div className="flex flex-col items-center justify-center h-full w-full animate-pop pb-24">
                        <div className="flex-1 flex flex-col justify-center items-center w-full">
                            <h2 className={`${isTVMode ? 'text-7xl mb-12' : 'text-4xl md:text-6xl mb-6 md:mb-8'} font-black text-showoff-accent uppercase tracking-tighter drop-shadow-xl`}>{t('penalty')}</h2>

                            {/* Selected Player Display */}
                            {selectedPunishmentPlayer && players[selectedPunishmentPlayer] ? (
                                <>
                                    <div className="mb-6 md:mb-8 animate-bounce text-center">
                                        <div className="text-xl md:text-2xl text-gray-300 mb-3">
                                            {lang === 'he' ? 'השחקן שנבחר:' : 'Selected Player:'}
                                        </div>
                                        <div className={`${isTVMode ? 'text-8xl' : 'text-5xl md:text-7xl'} font-black text-yellow-400 mb-2 animate-pulse drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]`}>
                                            👉 {players[selectedPunishmentPlayer].nickname} 👈
                                        </div>
                                        <div className="text-lg md:text-xl text-white/60">
                                            {lang === 'he' ? 'עליך לבצע את המשימה!' : 'You must complete the task!'}
                                        </div>
                                    </div>

                                    <div className={`card-glass p-8 md:p-12 bg-red-900/40 border-red-500/50 max-w-4xl text-center mb-8 md:mb-12 backdrop-blur-md w-full ${isTVMode ? 'flex-1 flex items-center justify-center' : ''}`}>
                                        <div>
                                            <div className="text-xl md:text-2xl text-gray-300 mb-4">
                                                {lang === 'he' ? 'המשימה:' : 'The Task:'}
                                            </div>
                                            <div className={`${isTVMode ? 'text-6xl leading-normal' : 'text-3xl md:text-5xl'} font-bold text-white mb-2 animate-wiggle`}>
                                                {currentQ.penaltyTask}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className={`card-glass p-8 md:p-12 max-w-3xl text-center mb-8 md:mb-12 backdrop-blur-md ${Object.values(players).some(p => p.answered) ? 'bg-green-900/40 border-green-500/50' : 'bg-gray-900/40 border-gray-500/50'}`}>
                                    {Object.values(players).some(p => p.answered) ? (
                                        <>
                                            <div className="text-6xl mb-4">🎉</div>
                                            <div className="text-3xl md:text-4xl font-bold text-green-400">
                                                {lang === 'he' ? 'כולם ענו נכון!' : 'Everyone got it right!'}
                                            </div>
                                            <div className="text-lg md:text-xl text-white/60 mt-2">
                                                {lang === 'he' ? 'אין עונש הפעם!' : 'No punishment this time!'}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-6xl mb-4">⏰</div>
                                            <div className="text-3xl md:text-4xl font-bold text-gray-400">
                                                {lang === 'he' ? 'נגמר הזמן!' : "Time's Up!"}
                                            </div>
                                            <div className="text-lg md:text-xl text-white/60 mt-2">
                                                {lang === 'he' ? 'אף אחד לא ענה.' : 'No one answered.'}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {gameState === "SCOREBOARD" && (
                    <div className="flex flex-col h-full w-full animate-pop pb-24">
                        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 overflow-y-auto">
                            <h2 className="text-3xl md:text-5xl font-black text-blue-400 mb-2 md:mb-4 drop-shadow-xl">🏆 SCOREBOARD 🏆</h2>
                            <p className="text-white/60 mb-4 md:mb-6 text-sm md:text-base">{lang === 'he' ? `שאלה ${currentQuestionIndex + 1} מתוך ${totalRounds}` : `Question ${currentQuestionIndex + 1} of ${totalRounds}`}</p>

                            <div className="grid grid-cols-1 w-full gap-2 md:gap-4 max-w-4xl px-2 md:px-4">
                                {Object.values(players)
                                    .sort((a, b) => {
                                        // Sort by score first, then by nickname for tie-breaking
                                        const scoreDiff = (b.score || 0) - (a.score || 0);
                                        if (scoreDiff !== 0) return scoreDiff;
                                        return a.nickname.localeCompare(b.nickname);
                                    })
                                    .map((p, i) => (
                                        <div key={i} className={`flex justify-between items-center bg-white/10 p-3 md:p-4 rounded-xl border border-white/20 backdrop-blur-md ${p.nickname === hostNickname ? 'bg-blue-500/30 border-blue-400' : ''}`}>
                                            <div className="flex items-center gap-2 md:gap-4">
                                                <span className={`text-xl md:text-3xl font-bold ${i === 0 ? 'text-yellow-400' : 'text-gray-300'}`}>
                                                    #{i + 1}
                                                </span>
                                                <span className="text-base md:text-2xl font-bold truncate max-w-[120px] md:max-w-none">{p.nickname}</span>
                                            </div>
                                            <span className="text-xl md:text-3xl font-mono text-green-400">{p.score || 0} pts</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {gameState === "GAME_OVER" && (
                    <div className="flex flex-col h-full w-full animate-pop">
                        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 overflow-y-auto">
                            <h2 className={`${isTVMode ? 'text-7xl' : 'text-4xl md:text-6xl'} font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-2 md:mb-4 drop-shadow-xl animate-pulse`}>
                                🎉 {t('gameOver')} 🎉
                            </h2>
                            <h3 className="text-2xl md:text-3xl font-bold text-white/80 mb-4 md:mb-8">{t('finalRankings')}</h3>

                            {/* Rankings... only show top 3 on TV Mode maybe? Or scroll list */}
                            {/* Podium */}
                            <div className="hidden md:flex items-end justify-center gap-4 mb-8 w-full max-w-2xl">
                                {Object.values(players)
                                    .sort((a, b) => {
                                        const scoreDiff = (b.score || 0) - (a.score || 0);
                                        if (scoreDiff !== 0) return scoreDiff;
                                        return a.nickname.localeCompare(b.nickname);
                                    })
                                    .slice(0, 3)
                                    .map((p, i) => {
                                        const heights = ['h-40', 'h-32', 'h-24'];
                                        const medals = ['🥇', '🥈', '🥉'];
                                        const colors = ['from-yellow-400 to-yellow-600', 'from-gray-300 to-gray-500', 'from-orange-400 to-orange-600'];
                                        const order = [1, 0, 2]; // 2nd, 1st, 3rd position
                                        const idx = order[i];
                                        const sortedPlayers = Object.values(players).sort((a, b) => {
                                            const scoreDiff = (b.score || 0) - (a.score || 0);
                                            if (scoreDiff !== 0) return scoreDiff;
                                            return a.nickname.localeCompare(b.nickname);
                                        });
                                        const player = sortedPlayers[idx];
                                        if (!player) return null;
                                        return (
                                            <div key={idx} className={`flex flex-col items-center ${i === 1 ? 'order-first' : ''}`}>
                                                <div className="text-5xl mb-2">{medals[idx]}</div>
                                                <div className="text-xl font-bold text-white mb-2 truncate max-w-24">{player.nickname}</div>
                                                <div className={`w-24 ${heights[idx]} bg-gradient-to-t ${colors[idx]} rounded-t-xl flex items-center justify-center shadow-xl`}>
                                                    <span className="text-2xl font-mono font-bold text-white">{player.score || 0}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            {/* Full Rankings */}
                            <div className="grid grid-cols-1 w-full gap-2 md:gap-3 max-w-4xl px-2 md:px-4 mb-4 md:mb-8">
                                {Object.values(players)
                                    .sort((a, b) => {
                                        // Sort by score first, then by nickname for tie-breaking
                                        const scoreDiff = (b.score || 0) - (a.score || 0);
                                        if (scoreDiff !== 0) return scoreDiff;
                                        return a.nickname.localeCompare(b.nickname);
                                    })
                                    .map((p, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white/10 p-2 md:p-3 rounded-xl border border-white/20 backdrop-blur-md">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <span className={`text-xl md:text-2xl font-bold ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                                                    #{i + 1}
                                                </span>
                                                <span className="text-base md:text-xl font-bold truncate max-w-[120px] md:max-w-none">{p.nickname}</span>
                                            </div>
                                            <span className="text-lg md:text-2xl font-mono text-green-400">{p.score || 0} pts</span>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className="flex-none flex justify-center pt-4">
                            <button onClick={playAgain} className={`btn-primary shadow-xl ${buttonSize}`}>
                                🔄 {t('playAgain')}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Branding Footer */}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex flex-col items-center justify-center opacity-80">
                <a
                    href="https://gilt73.github.io/GT-AI-Studio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-black/40 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md hover:bg-black/60 transition-all cursor-pointer"
                >
                    <img src="/assets/GT_Logo_New.png" alt="G.T AI Games" className="h-6 w-auto" />
                    <span className="font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">POWERED BY G.T AI GAMES</span>
                </a>
                <div className="text-xs text-white/40 mt-2 font-mono">v1.4.0</div>
            </div>
        </div>
    );
}
