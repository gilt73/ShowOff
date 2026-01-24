import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import HostGame from './components/HostGame';
import PlayerGame from './components/PlayerGame';
import SinglePlayerGame from './components/SinglePlayerGame';
import DebugLog from './components/DebugLog';
import GameLibraryScreen from './components/GameLibraryScreen';
import DebugGameSelector from './components/DebugGameSelector';
import { gamePacks, uiText } from './questions';

function Home() {
    const [lang, setLang] = useState('he');
    const [selectedPack, setSelectedPack] = useState('friends');
    const [gameMode, setGameMode] = useState('penalty'); // 'penalty' or 'classic'
    const navigate = useNavigate();

    // Helper to get text based on current language
    const t = (key) => uiText[lang][key];

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

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center space-y-8 w-full max-w-4xl pt-20 pb-32">
                <div className="text-center animate-fade-in-down">
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                        ShowOff
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-200 mt-2 font-light tracking-widest uppercase">{lang === 'he' ? 'משחק המסיבות האולטימטיבי' : 'The Ultimate Party Game'}</p>
                </div>

                {/* Main Actions */}
                <div className="flex flex-col gap-6 mt-10">
                    <button
                        onClick={() => navigate('/library')}
                        className="btn-primary w-80 text-2xl h-24 hover:scale-105 transform transition duration-200 shadow-xl flex items-center justify-center gap-3"
                    >
                        <span className="text-4xl">🎮</span>
                        <span>{lang === 'he' ? 'עיין במשחקים' : 'Browse Games'}</span>
                    </button>
                    <Link to="/play">
                        <button className="btn-secondary w-80 text-2xl h-24 bg-purple-600 border-purple-800 hover:scale-105 transform transition duration-200 shadow-xl flex items-center justify-center gap-3">
                            <span className="text-4xl">📱</span>
                            <span>{t('join')}</span>
                        </button>
                    </Link>
                </div>

                {/* Quick Play Section */}
                <div className="mt-8 w-full">
                    <div className="text-center mb-4">
                        <p className="text-white/60 text-sm">{lang === 'he' ? 'או התחל עכשיו:' : 'Or Quick Start:'}</p>
                    </div>

                    {/* Game Mode Toggle */}
                    <div className="bg-black/40 p-1 rounded-full flex border border-white/20 backdrop-blur-md mb-4 w-fit mx-auto">
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

                    {/* Game Selection - Compact Carousel */}
                    <div className="w-full">
                        <div className="relative w-full overflow-hidden">
                            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-4 px-4 scrollbar-hide justify-start items-center">
                                {Object.values(gamePacks).map((pack) => (
                                    <Link
                                        key={pack.id}
                                        to={`/host?pack=${pack.id}&lang=${lang}&mode=${gameMode}`}
                                        className="flex-shrink-0 snap-center cursor-pointer transition-all duration-300 w-28 h-28 rounded-full bg-cover bg-center border-4 border-white/20 hover:border-showoff-accent hover:scale-110"
                                        style={{ backgroundImage: `url(${pack.metadata?.bgImage || pack.bgImage})` }}
                                    >
                                        <div className="w-full h-full rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all p-2">
                                            <h3 className="font-bold text-white text-center leading-tight text-sm">
                                                {pack.title[lang]}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Test Mode Button */}
                <div className="mt-8">
                    <Link to="/debug-selector">
                        <button className="w-64 text-xl h-16 bg-yellow-500 text-black font-black rounded-2xl border-b-4 border-yellow-700 hover:scale-105 hover:bg-yellow-400 transform transition duration-200 shadow-xl flex items-center justify-center gap-3 mx-auto">
                            <span className="text-2xl">🕵️</span>
                            <span>Test Mode</span>
                        </button>
                    </Link>
                    <p className="text-white/40 text-sm mt-2 text-center">Test content without multiplayer</p>
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

function App() {
    return (
        <BrowserRouter basename="/ShowOff">
            <DebugLog />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/library" element={<GameLibraryScreen />} />
                <Route path="/host" element={<HostGame />} />
                <Route path="/play" element={<PlayerGame />} />
                <Route path="/debug-selector" element={<DebugGameSelector />} />
                <Route path="/debug" element={<SinglePlayerGame />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
