/**
 * Content Manager - CSV ↔ JSON Pipeline for ShowOff
 * 
 * CSV Structure:
 * Row 1: GameTitle,ThemeColor,IconName,BackgroundURL
 * Row 2+: Question,Answer1,Answer2,Answer3,Answer4,Difficulty,TimeLimit,ImageURL,Category
 * Separator: ---PUNISHMENTS---
 * Punishment Rows: Text,Duration
 */

/**
 * Import CSV text and convert to game pack JSON
 * @param {string} csvText - Raw CSV content
 * @returns {Object} { success: boolean, data: Object|null, errors: Array }
 */
export function importFromCSV(csvText) {
    const errors = [];

    try {
        const lines = csvText.trim().split('\n').map(line => line.trim()).filter(line => line);

        if (lines.length < 2) {
            return {
                success: false,
                data: null,
                errors: [{ row: 0, error: 'CSV must have at least 2 rows (header + data)' }]
            };
        }

        // Parse header metadata (Rows 1-2)
        // Row 1: Column headers (GameTitle_EN, etc.)
        // Row 2: Actual data
        let metadataEndIndex = 1;
        let metadata;

        // Check if first row is a header row
        const firstRowLower = lines[0].toLowerCase();
        if (firstRowLower.includes('gametitle') || firstRowLower.includes('title')) {
            // Has header row, data is in row 2
            if (lines.length < 3) {
                return {
                    success: false,
                    data: null,
                    errors: [{ row: 1, error: 'CSV has header row but missing metadata data row' }]
                };
            }
            const headerResult = parseMetadataWithHeader(lines[1]);
            if (!headerResult.success) {
                errors.push(...headerResult.errors);
            }
            metadata = headerResult.data;
            metadataEndIndex = 2; // Skip both header and data rows
        } else {
            // No header row, first row is data
            const headerResult = parseMetadataWithHeader(lines[0]);
            if (!headerResult.success) {
                errors.push(...headerResult.errors);
            }
            metadata = headerResult.data;
            metadataEndIndex = 1; // Skip only data row
        }

        // Find question header row (skip metadata and any blank lines)
        let questionStartIndex = metadataEndIndex;
        while (questionStartIndex < lines.length &&
            (lines[questionStartIndex] === '' ||
                lines[questionStartIndex].toLowerCase().includes('question,answer'))) {
            questionStartIndex++;
        }

        // Find punishment separator
        const punishmentSeparatorIndex = lines.findIndex(line =>
            line.toLowerCase().includes('punishment') || line.startsWith('---')
        );

        // Parse questions
        const questionLines = punishmentSeparatorIndex > 0
            ? lines.slice(questionStartIndex, punishmentSeparatorIndex)
            : lines.slice(questionStartIndex);

        const questions = [];
        questionLines.forEach((line, idx) => {
            if (!line) return; // Skip blank lines
            const rowNumber = questionStartIndex + idx + 1;
            const questionResult = parseQuestionRow(line, rowNumber);

            if (questionResult.success) {
                questions.push(questionResult.data);
            } else {
                errors.push(...questionResult.errors);
            }
        });

        // Parse punishments
        let punishments = [];
        if (punishmentSeparatorIndex > 0 && punishmentSeparatorIndex < lines.length - 1) {
            const punishmentLines = lines.slice(punishmentSeparatorIndex + 1);
            punishmentLines.forEach((line, idx) => {
                const rowNumber = punishmentSeparatorIndex + idx + 2;
                const punishmentResult = parsePunishmentRow(line, rowNumber);

                if (punishmentResult.success) {
                    punishments.push(punishmentResult.data);
                } else {
                    errors.push(...punishmentResult.errors);
                }
            });
        }

        // Stop if there are critical errors
        if (errors.length > 0) {
            return {
                success: false,
                data: null,
                errors
            };
        }

        // Generate ID from title
        const id = metadata.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '_');

        // Build game pack object
        const gamePack = {
            id,
            title: metadata.title,
            metadata: {
                themeColor: metadata.themeColor,
                icon: metadata.icon,
                bgImage: metadata.bgImage
            },
            questions,
            punishments,
            version: "2.0" // Mark as new-format game
        };

        return {
            success: true,
            data: gamePack,
            errors: []
        };

    } catch (error) {
        return {
            success: false,
            data: null,
            errors: [{ row: 0, error: `Parse error: ${error.message}` }]
        };
    }
}

/**
 * Export game pack JSON to CSV format
 * @param {Object} gamePack - Game pack object
 * @returns {string} CSV text
 */
export function exportToCSV(gamePack) {
    const lines = [];

    // Header row (metadata)
    const titleEn = gamePack.title?.en || gamePack.id;
    const titleHe = gamePack.title?.he || '';
    const themeColor = gamePack.metadata?.themeColor || '#4A90E2';
    const icon = gamePack.metadata?.icon || '🎮';
    const bgImage = gamePack.metadata?.bgImage || gamePack.bgImage || '';

    lines.push(`GameTitle_EN,GameTitle_HE,ThemeColor,IconName,BackgroundURL`);
    lines.push(`${escapeCSV(titleEn)},${escapeCSV(titleHe)},${themeColor},${icon},${bgImage}`);
    lines.push(''); // Blank line for readability

    // Question header
    lines.push('Question,Answer1,Answer2,Answer3,Answer4,Difficulty,TimeLimit,ImageURL,Category');

    // Question rows
    const questions = gamePack.questions || [];
    questions.forEach(q => {
        const question = q.question || '';
        const options = q.options || [];
        const answer1 = options[q.correctIndex] || options[0] || '';
        const otherAnswers = options.filter((_, idx) => idx !== q.correctIndex);
        const answer2 = otherAnswers[0] || '';
        const answer3 = otherAnswers[1] || '';
        const answer4 = otherAnswers[2] || '';
        const difficulty = q.difficulty || 1;
        const timeLimit = q.timeLimit || 20;
        const imageURL = q.imageURL || '';
        const category = q.category || '';

        lines.push(
            `${escapeCSV(question)},${escapeCSV(answer1)},${escapeCSV(answer2)},${escapeCSV(answer3)},${escapeCSV(answer4)},${difficulty},${timeLimit},${imageURL},${escapeCSV(category)}`
        );
    });

    lines.push(''); // Blank line
    lines.push('---PUNISHMENTS---');
    lines.push('Text,Duration');

    // Punishment rows
    const punishments = gamePack.punishments || [];
    if (punishments.length === 0 && questions.length > 0) {
        // If no punishments array, try to extract from questions (legacy format)
        questions.forEach(q => {
            if (q.penaltyTask) {
                lines.push(`${escapeCSV(q.penaltyTask)},30`);
            }
        });
    } else {
        punishments.forEach(p => {
            const text = p.text || p.penaltyTask || '';
            const duration = p.duration || 30;
            lines.push(`${escapeCSV(text)},${duration}`);
        });
    }

    return lines.join('\n');
}

/**
 * Parse metadata data row
 */
function parseMetadataWithHeader(dataLine) {
    const errors = [];
    const parts = dataLine.split(',').map(p => p.trim());

    const [titleEn = '', titleHe = '', themeColor = '#4A90E2', icon = '🎮', bgImage = ''] = parts;

    if (!titleEn) {
        errors.push({ row: 1, field: 'GameTitle', error: 'Game title is required' });
    }

    return {
        success: errors.length === 0,
        data: {
            title: { en: titleEn, he: titleHe || titleEn },
            themeColor: themeColor || '#4A90E2',
            icon: icon || '🎮',
            bgImage: bgImage || ''
        },
        errors
    };
}

/**
 * Parse a question row
 */
function parseQuestionRow(line, rowNumber) {
    const errors = [];
    const parts = line.split(',').map(p => p.trim());

    const [question, answer1, answer2, answer3, answer4, difficulty, timeLimit, imageURL, category] = parts;

    // Validation
    if (!question) {
        errors.push({ row: rowNumber, field: 'Question', error: 'Question text is required' });
    }
    if (!answer1) {
        errors.push({ row: rowNumber, field: 'Answer1', error: 'Correct answer (Answer1) is required' });
    }

    const difficultyNum = parseInt(difficulty) || 1;
    if (difficultyNum < 1 || difficultyNum > 3) {
        errors.push({ row: rowNumber, field: 'Difficulty', error: 'Difficulty must be 1 (Easy), 2 (Medium), or 3 (Hard)' });
    }

    if (errors.length > 0) {
        return { success: false, data: null, errors };
    }

    // Build question object
    const options = [answer1, answer2, answer3, answer4].filter(a => a);

    return {
        success: true,
        data: {
            category: category || 'General',
            question,
            options,
            correctIndex: 0, // Answer1 is always correct
            difficulty: difficultyNum,
            timeLimit: parseInt(timeLimit) || 20,
            imageURL: imageURL || undefined
        },
        errors: []
    };
}

/**
 * Parse a punishment row
 */
function parsePunishmentRow(line, rowNumber) {
    const errors = [];
    const parts = line.split(',').map(p => p.trim());

    const [text, duration] = parts;

    if (!text) {
        errors.push({ row: rowNumber, field: 'Text', error: 'Punishment text is required' });
    }

    if (errors.length > 0) {
        return { success: false, data: null, errors };
    }

    return {
        success: true,
        data: {
            text,
            duration: parseInt(duration) || 30
        },
        errors: []
    };
}

/**
 * Escape CSV values (handle commas and quotes)
 */
function escapeCSV(value) {
    if (!value) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

/**
 * Validate a complete game pack object
 */
export function validateGamePack(gamePack) {
    const errors = [];

    if (!gamePack.id) {
        errors.push({ field: 'id', error: 'Game ID is required' });
    }

    if (!gamePack.title?.en) {
        errors.push({ field: 'title.en', error: 'English title is required' });
    }

    if (!gamePack.questions || gamePack.questions.length === 0) {
        errors.push({ field: 'questions', error: 'At least one question is required' });
    }

    if (gamePack.version === '2.0') {
        // New format validation
        if (gamePack.questions.length < 15) {
            errors.push({ field: 'questions', error: 'Version 2.0 games should have at least 15 questions (ideally 50)' });
        }

        // Check difficulty distribution
        const diffCounts = { 1: 0, 2: 0, 3: 0 };
        gamePack.questions.forEach(q => {
            diffCounts[q.difficulty] = (diffCounts[q.difficulty] || 0) + 1;
        });

        if (diffCounts[1] < 5 || diffCounts[2] < 5 || diffCounts[3] < 5) {
            errors.push({
                field: 'questions',
                error: `Need at least 5 questions per difficulty (have ${diffCounts[1]} easy, ${diffCounts[2]} medium, ${diffCounts[3]} hard)`
            });
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
