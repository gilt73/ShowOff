import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gamePacks, uiText } from '../questions';

export default function GameLibraryScreen() {
    const [lang, setLang] = useState('he');
    const [searchQuery, setSearchQuery] = useState('');
    const [gameMode, setGameMode] = useState('penalty');

    const navigate = useNavigate();
    const t = (key) => uiText[lang][key];

    // Filter games based on search
    const filteredGames = Object.values(gamePacks).filter(pack => {
        const titleEn = pack.title.en.toLowerCase();
        const titleHe = pack.title.he?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
        return titleEn.includes(query) || titleHe.includes(query);
    });

    const handlePlayGame = (packId) => {
        navigate(`/host?pack=${packId}&lang=${lang}&mode=${gameMode}`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-4 relative overflow-y-auto text-white">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img src={`${import.meta.env.BASE_URL}assets/bg.png`} alt="Background" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/60 to-black/80" />
            </div>

            {/* Back Button */}
            <div className="absolute top-4 left-4 z-10">
                <button
                    onClick={() => navigate('/')}
                    className="bg-black/40 backdrop-blur-md border border-white/20 hover:border-showoff-accent text-white font-bold px-4 py-2 rounded-full hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
                >
                    <span className="text-xl">🏠</span>
                    <span>{lang === 'he' ? 'חזרה ללובי' : 'Back to Lobby'}</span>
                </button>
            </div>

            {/* Language Toggle */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button onClick={() => setLang('he')} className={`text-2xl hover:scale-110 transition ${lang === 'he' ? 'grayscale-0' : 'grayscale'}`}>🇮🇱</button>
                <button onClick={() => setLang('en')} className={`text-2xl hover:scale-110 transition ${lang === 'en' ? 'grayscale-0' : 'grayscale'}`}>🇺🇸</button>
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center w-full max-w-7xl pt-20 pb-32">
                {/* Header */}
                <div className="text-center animate-fade-in-down mb-8">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                        ShowOff
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-200 mt-2 font-light tracking-widest uppercase">
                        {lang === 'he' ? 'בחר את המשחק שלך' : 'Choose Your Game'}
                    </p>
                </div>

                {/* Game Mode Toggle */}
                <div className="bg-black/40 p-1 rounded-full flex border border-white/20 backdrop-blur-md mb-8">
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

                {/* Search Bar */}
                <div className="w-full max-w-2xl mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={lang === 'he' ? 'חפש משחק...' : 'Search games...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/40 border border-white/20 rounded-full px-6 py-4 text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:border-showoff-accent transition-all text-lg"
                            dir={lang === 'he' ? 'rtl' : 'ltr'}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
                            🔍
                        </div>
                    </div>
                </div>

                {/* Games Grid */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {filteredGames.map((pack) => (
                        <div
                            key={pack.id}
                            className="group relative overflow-hidden rounded-2xl backdrop-blur-md border border-white/20 hover:border-showoff-accent transition-all duration-300 hover:scale-105 cursor-pointer"
                            onClick={() => handlePlayGame(pack.id)}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={pack.metadata?.bgImage || pack.bgImage || `${import.meta.env.BASE_URL}assets/bg.png`}
                                    alt={pack.title[lang]}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 p-6 h-72 flex flex-col justify-between">
                                {/* Icon */}
                                <div className="flex justify-center mb-4">
                                    <div className="text-6xl animate-bounce-slow drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                        {pack.metadata?.icon || '🎮'}
                                    </div>
                                </div>

                                {/* Title & Info */}
                                <div className="text-center flex-1 flex flex-col justify-center">
                                    <h3 className="text-2xl font-black text-white mb-2 drop-shadow-lg">
                                        {pack.title[lang]}
                                    </h3>
                                    <div className="flex items-center justify-center gap-2 text-sm text-white/70 mb-2">
                                        <span>{pack.questions.length} {lang === 'he' ? 'שאלות' : 'Questions'}</span>
                                        {pack.version === '2.0' && (
                                            <>
                                                <span>•</span>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-showoff-accent/30 text-showoff-accent border border-showoff-accent/50">
                                                    ⚡ NEW
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {pack.metadata?.themeColor && (
                                        <div className="flex items-center justify-center gap-2 mt-1">
                                            <div
                                                className="w-3 h-3 rounded-full border border-white/50"
                                                style={{ backgroundColor: pack.metadata.themeColor }}
                                            />
                                            <span className="text-xs text-white/50">{lang === 'he' ? 'ערכת נושא' : 'Themed'}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Play Button */}
                                <button className="w-full bg-showoff-accent text-black font-bold py-4 rounded-xl shadow-lg group-hover:shadow-showoff-accent/50 group-hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                                    <span className="text-2xl">▶️</span>
                                    <span className="text-lg">{lang === 'he' ? 'שחק עכשיו' : 'Play Now'}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredGames.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-2xl text-white/60">
                            {lang === 'he' ? 'לא נמצאו משחקים' : 'No games found'}
                        </p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-showoff-accent hover:underline"
                        >
                            {lang === 'he' ? 'נקה חיפוש' : 'Clear search'}
                        </button>
                    </div>
                )}

                {/* Quick Join Button */}
                <div className="mt-12">
                    <button
                        onClick={() => navigate('/play')}
                        className="btn-secondary w-64 text-xl h-16 bg-purple-600 border-purple-800 hover:scale-105 transform transition duration-200 shadow-xl"
                    >
                        📱 {lang === 'he' ? 'הצטרף למשחק' : 'Join Game'}
                    </button>
                </div>
            </div>

            {/* Branding Footer */}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex flex-col items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                <div className="text-sm font-bold tracking-widest text-white/60 mb-1 uppercase">Powered By</div>
                <a
                    href="https://gilt73.github.io/GT-AI-Studio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-black/40 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md hover:bg-black/60 transition-all cursor-pointer"
                >
                    <img src={`${import.meta.env.BASE_URL}assets/GT_Logo_New.png`} alt="G.T AI Games" className="h-8 w-auto" />
                    <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">G.T AI GAMES</span>
                </a>
                <div className="text-xs text-white/40 mt-2 font-mono">v2.0.1</div>
            </div>
        </div>
    );
}
