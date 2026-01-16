import { useState, useEffect } from 'react';

export default function DebugLog() {
    const [logs, setLogs] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Safe wrap to avoid overriding if already overridden (HMR issues)
        if (window.__consoleErrorOverridden) return;

        const originalError = console.error;
        window.__consoleErrorOverridden = true;

        console.error = (...args) => {
            originalError.apply(console, args);

            // Format
            const message = args.map(arg => {
                if (arg instanceof Error) {
                    return arg.message + (arg.stack ? `\n${arg.stack}` : '');
                }
                if (typeof arg === 'object') {
                    try {
                        return JSON.stringify(arg);
                    } catch (e) {
                        return '[Object]';
                    }
                }
                return String(arg);
            }).join(' ');

            setLogs(prev => {
                const newLogs = [...prev, { timestamp: new Date().toLocaleTimeString(), message }];
                return newLogs.slice(-3); // Keep last 3
            });
            setIsVisible(true);
        };

        // Cleanup? 
        // In React StrictMode, effects run twice. We rely on the global flag or cleanup function.
        // But cleaning up console override is tricky if multiple components do it.
        // For this simple app, it's okay.

        return () => {
            // We don't necessarily want to restore it on unmount because 
            // errors happen outside component lifecycle sometimes.
            // But for correctness:
            console.error = originalError;
            window.__consoleErrorOverridden = false;
        };
    }, []);

    if (logs.length === 0) return null;

    return (
        <div className="fixed bottom-20 left-4 z-[9999] font-sans text-left">
            {isVisible ? (
                <div className="bg-black/90 text-red-400 p-3 rounded-xl border border-red-500/50 shadow-2xl max-w-sm md:max-w-md text-xs font-mono backdrop-blur-md animate-slide-up">
                    <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
                        <span className="font-bold flex items-center gap-2">
                            <span>🐞</span>
                            <span>CONSOLE ERRORS</span>
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setLogs([])}
                                className="text-xs text-white/40 hover:text-white px-2 py-1 rounded bg-white/10"
                            >
                                CLEAR
                            </button>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-white/50 hover:text-white"
                            >
                                ▼
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {logs.map((log, i) => (
                            <div key={i} className="break-words border-b border-white/5 last:border-0 pb-1 last:pb-0">
                                <span className="text-white/30 mr-2">[{log.timestamp}]</span>
                                {log.message}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsVisible(true)}
                    className="bg-red-600/80 hover:bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform font-bold animate-bounce backdrop-blur-md border border-white/20"
                    title="Show Debug Log"
                >
                    🐞
                </button>
            )}
        </div>
    );
}
