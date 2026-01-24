import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { gamePacks, uiText, shuffleArray } from '../questions';
import { getText, getOptions } from '../utils/languageHelper';

export default function SinglePlayerGame() {
    const [searchParams] = useSearchParams();
    const packId = searchParams.get('pack') || 'friends';
    const lang = searchParams.get('lang') || 'en';
    const gameMode = searchParams.get('mode') || 'penalty'; // 'classic' or 'penalty'

    // Helper for text
    const t = (key) => uiText[lang][key];
    const currentPack = gamePacks[packId] || gamePacks.friends;

    // Local state only - NO Firebase
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [timer, setTimer] = useState(10);
    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [currentPunishment, setCurrentPunishment] = useState(null);

    // Initialize shuffled questions on mount
    useEffect(() => {
        const shuffled = shuffleArray([...currentPack.questions]);
        setShuffledQuestions(shuffled);
    }, [packId]);

    // Simulated timer animation (visual only)
    useEffect(() => {
        if (!showResult && timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => Math.max(0, prev - 1));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [showResult, timer]);

    const currentQ = shuffledQuestions[currentQuestionIndex];
    const totalQuestions = shuffledQuestions.length;

    const handleAnswer = (answerIndex) => {
        if (showResult) return; // Prevent multiple clicks

        setSelectedAnswer(answerIndex);
        const correct = answerIndex === currentQ.correctIndex;
        setIsCorrect(correct);
        setShowResult(true);

        // If wrong answer in ShowOff Mode, select random punishment from pack
        if (!correct && gameMode === 'penalty' && currentPack.punishments && currentPack.punishments.length > 0) {
            const randomPunishment = currentPack.punishments[Math.floor(Math.random() * currentPack.punishments.length)];
            setCurrentPunishment(randomPunishment);
            // Don't auto-advance when showing punishment - let user read it
            return;
        }

        // Auto-advance to next question after 1.5 seconds (only for correct answers or non-penalty mode)
        setTimeout(() => {
            nextQuestion();
        }, 1500);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
            setTimer(10);
            setCurrentPunishment(null);
        } else {
            // Reached end - option to restart
            setCurrentQuestionIndex(0);
            setSelectedAnswer(null);
            setShowResult(false);
            setTimer(10);
            setCurrentPunishment(null);
        }
    };

    const skipQuestion = () => {
        nextQuestion();
    };

    const restart = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimer(10);
        setCurrentPunishment(null);
        // Re-shuffle questions
        const shuffled = shuffleArray([...currentPack.questions]);
        setShuffledQuestions(shuffled);
    };

    if (!currentQ) {
        return (
            <div className="min-h-screen bg-showoff-bg flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="text-6xl mb-4">⏳</div>
                    <div className="text-2xl">Loading questions...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen flex flex-col bg-black text-white" dir={lang === 'he' ? 'rtl' : 'ltr'}>
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <img src={currentPack.bgImage || `${import.meta.env.BASE_URL}assets/bg.png`} alt="Background" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/60 to-black/80" />
            </div>

            {/* Debug Header */}
            <div className="relative z-10 bg-yellow-500 text-black px-4 md:px-6 py-3 flex items-center justify-between shadow-lg border-b-4 border-yellow-600 flex-shrink-0">
                <div className="flex items-center gap-2 md:gap-4">
                    <span className="text-xl md:text-2xl">🕵️</span>
                    <div>
                        <div className="font-black text-base md:text-xl">TEST MODE</div>
                        <div className="text-xs md:text-sm font-mono">{currentPack.title[lang]}</div>
                    </div>
                    <div className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${gameMode === 'penalty' ? 'bg-pink-600 text-white' : 'bg-blue-500 text-white'}`}>
                        {gameMode === 'penalty' ? '😈 ShowOff' : '🏆 Classic'}
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="font-bold text-sm md:text-lg">
                        Question {currentQuestionIndex + 1} / {totalQuestions}
                    </div>
                    <Link to="/debug-selector" className="bg-black text-yellow-500 px-3 md:px-4 py-2 rounded-lg font-bold hover:bg-gray-900 transition text-sm md:text-base">
                        ←
                    </Link>
                </div>
            </div>

            {/* Content Area - Scrollable */}
            <div className="relative z-10 flex-1 flex flex-col overflow-y-auto">

                {/* TOP SECTION: Question Display */}
                <div className="flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-black/60 to-transparent border-b-2 border-white/20 min-h-[30vh] md:min-h-0">
                    <div className="w-full max-w-4xl">
                        {/* Category */}
                        <div className="text-showoff-accent font-bold tracking-widest mb-2 md:mb-4 uppercase drop-shadow-lg text-center text-base md:text-xl">
                            {getText(currentQ.category, lang)}
                        </div>

                        {/* Question */}
                        <div className="card-glass p-4 md:p-8 text-center border-2 border-showoff-blue backdrop-blur-md bg-black/40 mb-3 md:mb-6">
                            <h2 className="text-xl md:text-3xl lg:text-5xl font-bold leading-tight">
                                {getText(currentQ.question, lang)}
                            </h2>
                        </div>

                        {/* Timer Bar */}
                        <div className="w-full h-4 md:h-6 bg-gray-800 rounded-full overflow-hidden border border-gray-700 shadow-inner mb-2 md:mb-4">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-red-500 transition-all duration-1000 ease-linear"
                                style={{ width: `${(timer / 10) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION: Answer Buttons */}
                <div className="flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-t from-black/60 to-transparent min-h-[50vh] md:min-h-0 pb-20 md:pb-8">
                    {!showResult ? (
                        <div className="w-full max-w-4xl">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-black text-white/80 mb-2">PLAYER VIEW</h3>
                                <p className="text-white/60">Select your answer:</p>
                            </div>

                            {/* Answer Grid */}
                            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                                {getOptions(currentQ.options, lang).map((opt, idx) => {
                                    const labels = ['A', 'B', 'C', 'D'];
                                    const styles = [
                                        'btn-answer-a',
                                        'btn-answer-b',
                                        'btn-answer-c',
                                        'btn-answer-d'
                                    ];

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(idx)}
                                            className={`btn-answer ${styles[idx]} relative group text-base md:text-xl lg:text-2xl min-h-[80px] md:min-h-[100px]`}
                                        >
                                            <span className="absolute top-1 left-1 md:top-2 md:left-2 text-xs md:text-sm font-black opacity-70">
                                                {labels[idx]}
                                            </span>
                                            <span className="text-center px-2">{opt}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-2xl">
                            {/* Result Display */}
                            <div className={`
                                card-glass p-4 md:p-8 text-center backdrop-blur-md border-4
                                ${isCorrect
                                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-900/40 border-green-500/50'
                                    : 'bg-gradient-to-br from-red-500/20 to-rose-900/40 border-red-500/50'
                                }
                            `}>
                                <div className="text-8xl mb-4 filter drop-shadow-lg">
                                    {isCorrect ? '✅' : '❌'}
                                </div>
                                <h2 className={`text-5xl font-black mb-4 tracking-wide ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                    {isCorrect ? t('correct') : t('wrong')}
                                </h2>

                                {!isCorrect && (
                                    <div className="mt-6">
                                        <div className="text-white/70 text-sm uppercase tracking-widest mb-2">{t('correctAnswer')}</div>
                                        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-4">
                                            <span className="text-2xl font-bold text-green-300">
                                                {getOptions(currentQ.options, lang)[currentQ.correctIndex]}
                                            </span>
                                        </div>
                                        {gameMode === 'penalty' && currentPunishment && (
                                            <div className="bg-black/40 p-4 rounded-xl border border-red-500/20">
                                                <div className="text-red-200 text-sm uppercase tracking-widest mb-1">{t('penaltyTask')}</div>
                                                <p className="text-red-300 font-medium text-lg leading-tight">{currentPunishment.text || currentPunishment}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Only show auto-advancing message when NOT showing punishment */}
                                {(!currentPunishment || isCorrect) && (
                                    <div className="mt-6 text-white/50 text-sm animate-pulse">
                                        {t('autoAdvancing')}
                                    </div>
                                )}

                                {/* Show manual Next button when punishment is displayed */}
                                {currentPunishment && !isCorrect && (
                                    <button
                                        onClick={nextQuestion}
                                        className="mt-6 w-full bg-showoff-accent hover:bg-pink-500 text-black font-black text-2xl py-4 px-8 rounded-xl shadow-lg hover:scale-105 transform transition duration-200 border-b-4 border-pink-700"
                                    >
                                        ➡️ {lang === 'he' ? 'המשך' : 'Next'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Quick Controls */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={skipQuestion}
                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold transition border border-white/20"
                        >
                            ⏭️ Skip
                        </button>
                        <button
                            onClick={restart}
                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold transition border border-white/20"
                        >
                            🔄 Restart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
