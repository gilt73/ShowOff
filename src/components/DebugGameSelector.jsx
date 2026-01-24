import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gamePacks, uiText } from '../questions';

export default function DebugGameSelector() {
    const [lang, setLang] = useState('he');
    const [gameMode, setGameMode] = useState('penalty'); // 'penalty' or 'classic'
    const navigate = useNavigate();

    const t = (key) => uiText[lang][key];

    const handleGameSelect = (packId) => {
        navigate(`/debug?pack=${packId}&lang=${lang}&mode=${gameMode}`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-4 relative overflow-y-auto text-white">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img src={`${import.meta.env.BASE_URL}assets/bg.png`} alt="Background" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/60 to-black/80" />
            </div>

            {/* Language Toggle */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button onClick={() => setLang('he')} className={`text-2xl hover:scale-110 transition ${lang === 'he' ? 'grayscale-0' : 'grayscale'}`}>🇮🇱</button>
                <button onClick={() => setLang('en')} className={`text-2xl hover:scale-110 transition ${lang === 'en' ? 'grayscale-0' : 'grayscale'}`}>🇺🇸</button>
            </div>

            {/* Back Button */}
            <div className="absolute top-4 left-4 z-10">
                <button
                    onClick={() => navigate('/')}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-bold transition border border-white/20"
                >
                    ← {lang === 'he' ? 'חזרה' : 'Back'}
                </button>
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center space-y-8 w-full max-w-6xl pt-20 pb-10">
                {/* Header */}
                <div className="text-center animate-fade-in-down">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <span className="text-6xl">🕵️</span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                            DEBUG MODE
                        </h1>
                    </div>
                    <p className="text-xl md:text-2xl text-white/80 mt-2 font-light tracking-wider">
                        {lang === 'he' ? 'בחר משחק לבדיקה' : 'Select a Game to Test'}
                    </p>

                    {/* Game Mode Toggle */}
                    <div className="mt-6 bg-black/40 p-1 rounded-full flex border border-yellow-500/30 backdrop-blur-md w-fit mx-auto">
                        <button
                            onClick={() => setGameMode('classic')}
                            className={`px-6 py-2 rounded-full font-bold transition-all ${gameMode === 'classic' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            🏆 {lang === 'he' ? 'תחרות רגילה' : 'Classic Quiz'}
                        </button>
                        <button
                            onClick={() => setGameMode('penalty')}
                            className={`px-6 py-2 rounded-full font-bold transition-all ${gameMode === 'penalty' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            😈 {lang === 'he' ? 'משימות ועונשים' : 'ShowOff Mode'}
                        </button>
                    </div>
                </div>

                {/* Game Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
                    {Object.values(gamePacks).map((pack) => (
                        <button
                            key={pack.id}
                            onClick={() => handleGameSelect(pack.id)}
                            className="group relative overflow-hidden rounded-2xl border-4 border-white/20 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-black/40 backdrop-blur-md"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={pack.metadata?.bgImage || pack.bgImage}
                                    alt={pack.title[lang]}
                                    className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 p-6 h-64 flex flex-col justify-between">
                                <div className="flex-1 flex items-center justify-center">
                                    <h3 className="text-3xl font-black text-white text-center leading-tight drop-shadow-lg">
                                        {pack.title[lang]}
                                    </h3>
                                </div>

                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="flex items-center justify-between bg-black/60 rounded-lg px-3 py-2">
                                        <span className="text-white/70">{lang === 'he' ? 'חידות' : 'Questions'}:</span>
                                        <span className="font-bold text-yellow-400">{pack.questions?.length || 0}</span>
                                    </div>
                                    {pack.version === "2.0" && (
                                        <div className="flex items-center justify-between bg-black/60 rounded-lg px-3 py-2">
                                            <span className="text-white/70">{lang === 'he' ? 'משימות' : 'Punishments'}:</span>
                                            <span className="font-bold text-pink-400">{pack.punishments?.length || 0}</span>
                                        </div>
                                    )}
                                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-3 py-2 text-center">
                                        <span className="font-mono font-bold text-yellow-300">v{pack.version || '1.0'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Effect */}
                            <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/10 transition-colors duration-300" />
                        </button>
                    ))}
                </div>

                {/* Info */}
                <div className="text-center text-white/50 text-sm mt-6">
                    <p>{lang === 'he' ? 'בדוק את התוכן ללא צורך בשחקנים אחרים' : 'Test content without multiplayer'}</p>
                </div>
            </div>
        </div>
    );
}
