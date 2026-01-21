// Utility helper for bilingual question access
// Supports both old format (single language) and new format (bilingual)

/**
 * Get language-specific text from a question property
 * @param {string|object} value - Can be a string or {en, he} object
 * @param {string} lang - Language code ('en' or 'he')
 * @returns {string} - The text in the requested language
 */
export function getText(value, lang = 'en') {
    if (!value) return '';

    // If value is already a string, return it (backward compatible)
    if (typeof value === 'string') return value;

    // If value is an object with language keys, return the requested language
    if (typeof value === 'object' && value !== null) {
        return value[lang] || value.en || value.he || '';
    }

    return String(value);
}

/**
 * Get language-specific array from question options
 * @param {Array|object} options - Can be an array or {en: [], he: []} object
 * @param {string} lang - Language code ('en' or 'he')
 * @returns {Array} - The options array in the requested language
 */
export function getOptions(options, lang = 'en') {
    if (!options) return [];

    // If options is already an array, return it (backward compatible)
    if (Array.isArray(options)) return options;

    // If options is an object with language keys, return the requested language
    if (typeof options === 'object' && options !== null) {
        return options[lang] || options.en || options.he || [];
    }

    return [];
}
