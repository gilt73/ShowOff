/**
 * Analytics Module for ShowOff
 * Tracks game sessions, player counts, and engagement metrics
 */

export class GameAnalytics {
    constructor() {
        this.sessionStart = null;
        this.sessionData = {
            gameId: null,
            roomCode: null,
            playerCount: 0,
            questionCount: 0,
            completedQuestions: 0,
            gameMode: null,
            startTime: null,
            endTime: null
        };
    }

    /**
     * Start tracking a game session
     */
    startSession(gameId, roomCode, gameMode) {
        this.sessionStart = Date.now();
        this.sessionData = {
            gameId,
            roomCode,
            playerCount: 0,
            questionCount: 0,
            completedQuestions: 0,
            gameMode,
            startTime: new Date().toISOString(),
            endTime: null
        };

        console.log('📊 Analytics: Session started', {
            gameId,
            roomCode,
            gameMode,
            timestamp: this.sessionData.startTime
        });
    }

    /**
     * Update player count
     */
    updatePlayerCount(count) {
        this.sessionData.playerCount = Math.max(this.sessionData.playerCount, count);
    }

    /**
     * Track question answered
     */
    trackQuestion(questionIndex, totalQuestions) {
        this.sessionData.questionCount = totalQuestions;
        this.sessionData.completedQuestions = questionIndex + 1;
    }

    /**
     * End tracking session
     */
    endSession() {
        if (!this.sessionStart) return null;

        this.sessionData.endTime = new Date().toISOString();
        const duration = Date.now() - this.sessionStart;
        const durationMinutes = Math.round(duration / 60000);

        const metrics = {
            ...this.sessionData,
            durationMs: duration,
            durationMinutes,
            completionRate: this.sessionData.questionCount > 0
                ? (this.sessionData.completedQuestions / this.sessionData.questionCount * 100).toFixed(1)
                : 0
        };

        console.log('📊 Analytics: Session ended', metrics);

        // Store in localStorage for basic tracking
        this.saveToStorage(metrics);

        // Reset session
        this.sessionStart = null;

        return metrics;
    }

    /**
     * Save metrics to localStorage
     */
    saveToStorage(metrics) {
        try {
            const history = this.getSessionHistory();
            history.push(metrics);

            // Keep last 100 sessions
            if (history.length > 100) {
                history.shift();
            }

            localStorage.setItem('showoff_analytics', JSON.stringify(history));
        } catch (error) {
            console.error('Analytics storage error:', error);
        }
    }

    /**
     * Get session history from localStorage
     */
    getSessionHistory() {
        try {
            const data = localStorage.getItem('showoff_analytics');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Analytics retrieval error:', error);
            return [];
        }
    }

    /**
     * Get analytics summary
     */
    getSummary() {
        const history = this.getSessionHistory();

        if (history.length === 0) {
            return {
                totalSessions: 0,
                averageDuration: 0,
                averagePlayers: 0,
                totalPlayers: 0,
                mostPopularGame: null,
                mostPopularMode: null
            };
        }

        const totalSessions = history.length;
        const totalDuration = history.reduce((sum, s) => sum + s.durationMinutes, 0);
        const totalPlayers = history.reduce((sum, s) => sum + s.playerCount, 0);

        // Count game pack usage
        const gameStats = {};
        const modeStats = {};

        history.forEach(session => {
            gameStats[session.gameId] = (gameStats[session.gameId] || 0) + 1;
            modeStats[session.gameMode] = (modeStats[session.gameMode] || 0) + 1;
        });

        const mostPopularGame = Object.keys(gameStats).reduce((a, b) =>
            gameStats[a] > gameStats[b] ? a : b, null
        );

        const mostPopularMode = Object.keys(modeStats).reduce((a, b) =>
            modeStats[a] > modeStats[b] ? a : b, null
        );

        return {
            totalSessions,
            averageDuration: Math.round(totalDuration / totalSessions),
            averagePlayers: Math.round(totalPlayers / totalSessions * 10) / 10,
            totalPlayers,
            mostPopularGame,
            mostPopularMode,
            gameStats,
            modeStats,
            lastSession: history[history.length - 1]
        };
    }

    /**
     * Clear all analytics data
     */
    clearHistory() {
        localStorage.removeItem('showoff_analytics');
        console.log('📊 Analytics: History cleared');
    }
}

// Export singleton instance
export const analytics = new GameAnalytics();
