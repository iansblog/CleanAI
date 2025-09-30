/**
 * Text Cleaner Module
 * Contains all text cleaning and normalization functions
 */

class TextCleaner {
    constructor() {
        this.stats = {
            removedCount: 0,
            replacedCount: 0,
            originalLength: 0,
            finalLength: 0
        };
    }

    /**
     * Reset cleaning statistics
     */
    resetStats() {
        this.stats = {
            removedCount: 0,
            replacedCount: 0,
            originalLength: 0,
            finalLength: 0
        };
    }

    /**
     * Remove hidden/invisible characters like zero-width spaces
     * @param {string} text - Input text
     * @returns {string} - Cleaned text
     */
    removeHiddenCharacters(text) {
        const hiddenChars = [
            '\u200B', // Zero-width space
            '\u200C', // Zero-width non-joiner
            '\u200D', // Zero-width joiner
            '\u2060', // Word joiner
            '\uFEFF', // Zero-width no-break space (BOM)
            '\u200E', // Left-to-right mark
            '\u200F', // Right-to-left mark
            '\u202A', // Left-to-right embedding
            '\u202B', // Right-to-left embedding
            '\u202C', // Pop directional formatting
            '\u202D', // Left-to-right override
            '\u202E', // Right-to-left override
            '\u061C', // Arabic letter mark
            '\u180E', // Mongolian vowel separator
            '\u034F'  // Combining grapheme joiner
        ];

        let cleaned = text;
        let removedCount = 0;

        hiddenChars.forEach(char => {
            const beforeLength = cleaned.length;
            cleaned = cleaned.replace(new RegExp(char, 'g'), '');
            removedCount += beforeLength - cleaned.length;
        });

        this.stats.removedCount += removedCount;
        return cleaned;
    }

    /**
     * Convert non-breaking spaces to regular spaces
     * @param {string} text - Input text
     * @returns {string} - Cleaned text
     */
    convertNonBreakingSpaces(text) {
        const beforeLength = text.length;
        const cleaned = text.replace(/\u00A0/g, ' '); // Non-breaking space to regular space
        const replacedCount = beforeLength - cleaned.length + (cleaned.match(/ /g) || []).length - (text.match(/ /g) || []).length;
        this.stats.replacedCount += Math.abs(replacedCount);
        return cleaned;
    }

    /**
     * Normalize dashes - convert em-dashes and en-dashes to hyphens
     * @param {string} text - Input text
     * @returns {string} - Cleaned text
     */
    normalizeDashes(text) {
        let cleaned = text;
        let replacedCount = 0;

        // Em dash (—) to hyphen (-)
        const emDashCount = (cleaned.match(/\u2014/g) || []).length;
        cleaned = cleaned.replace(/\u2014/g, '-');
        replacedCount += emDashCount;

        // En dash (–) to hyphen (-)
        const enDashCount = (cleaned.match(/\u2013/g) || []).length;
        cleaned = cleaned.replace(/\u2013/g, '-');
        replacedCount += enDashCount;

        // Minus sign (−) to hyphen (-)
        const minusCount = (cleaned.match(/\u2212/g) || []).length;
        cleaned = cleaned.replace(/\u2212/g, '-');
        replacedCount += minusCount;

        this.stats.replacedCount += replacedCount;
        return cleaned;
    }

    /**
     * Normalize quotes - convert curly/smart quotes to straight quotes
     * @param {string} text - Input text
     * @returns {string} - Cleaned text
     */
    normalizeQuotes(text) {
        let cleaned = text;
        let replacedCount = 0;

        // Left single quotation mark (') to straight single quote (')
        const leftSingleCount = (cleaned.match(/\u2018/g) || []).length;
        cleaned = cleaned.replace(/\u2018/g, "'");
        replacedCount += leftSingleCount;

        // Right single quotation mark (') to straight single quote (')
        const rightSingleCount = (cleaned.match(/\u2019/g) || []).length;
        cleaned = cleaned.replace(/\u2019/g, "'");
        replacedCount += rightSingleCount;

        // Left double quotation mark (") to straight double quote (")
        const leftDoubleCount = (cleaned.match(/\u201C/g) || []).length;
        cleaned = cleaned.replace(/\u201C/g, '"');
        replacedCount += leftDoubleCount;

        // Right double quotation mark (") to straight double quote (")
        const rightDoubleCount = (cleaned.match(/\u201D/g) || []).length;
        cleaned = cleaned.replace(/\u201D/g, '"');
        replacedCount += rightDoubleCount;

        // Double low-9 quotation mark („)
        const doubleLowCount = (cleaned.match(/\u201E/g) || []).length;
        cleaned = cleaned.replace(/\u201E/g, '"');
        replacedCount += doubleLowCount;

        // Single low-9 quotation mark (‚)
        const singleLowCount = (cleaned.match(/\u201A/g) || []).length;
        cleaned = cleaned.replace(/\u201A/g, "'");
        replacedCount += singleLowCount;

        this.stats.replacedCount += replacedCount;
        return cleaned;
    }

    /**
     * Convert ellipsis character to three dots
     * @param {string} text - Input text
     * @returns {string} - Cleaned text
     */
    convertEllipsis(text) {
        const ellipsisCount = (text.match(/\u2026/g) || []).length;
        const cleaned = text.replace(/\u2026/g, '...');
        this.stats.replacedCount += ellipsisCount;
        return cleaned;
    }

    /**
     * Remove trailing whitespace from lines
     * @param {string} text - Input text
     * @returns {string} - Cleaned text
     */
    removeTrailingWhitespace(text) {
        const lines = text.split('\n');
        let removedCount = 0;

        const cleanedLines = lines.map(line => {
            const originalLength = line.length;
            const trimmed = line.replace(/\s+$/, '');
            removedCount += originalLength - trimmed.length;
            return trimmed;
        });

        this.stats.removedCount += removedCount;
        return cleanedLines.join('\n');
    }

    /**
     * Clean text based on provided options
     * @param {string} text - Input text to clean
     * @param {Object} options - Cleaning options
     * @returns {Object} - Cleaned text and statistics
     */
    cleanText(text, options = {}) {
        if (!text || typeof text !== 'string') {
            return {
                cleanedText: '',
                stats: { removedCount: 0, replacedCount: 0, originalLength: 0, finalLength: 0 }
            };
        }

        this.resetStats();
        this.stats.originalLength = text.length;

        let cleanedText = text;

        // Apply cleaning operations based on options
        if (options.removeHiddenChars) {
            cleanedText = this.removeHiddenCharacters(cleanedText);
        }

        if (options.convertNonBreaking) {
            cleanedText = this.convertNonBreakingSpaces(cleanedText);
        }

        if (options.normalizeDashes) {
            cleanedText = this.normalizeDashes(cleanedText);
        }

        if (options.normalizeQuotes) {
            cleanedText = this.normalizeQuotes(cleanedText);
        }

        if (options.convertEllipsis) {
            cleanedText = this.convertEllipsis(cleanedText);
        }

        if (options.removeTrailing) {
            cleanedText = this.removeTrailingWhitespace(cleanedText);
        }

        this.stats.finalLength = cleanedText.length;

        return {
            cleanedText: cleanedText,
            stats: { ...this.stats }
        };
    }

    /**
     * Get a preview of what characters will be affected
     * @param {string} text - Input text
     * @param {Object} options - Cleaning options
     * @returns {Array} - Array of found issues
     */
    previewChanges(text, options = {}) {
        const issues = [];

        if (options.removeHiddenChars) {
            const hiddenCharRegex = /[\u200B\u200C\u200D\u2060\uFEFF\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u061C\u180E\u034F]/g;
            const matches = text.match(hiddenCharRegex);
            if (matches) {
                issues.push(`${matches.length} hidden character(s) found`);
            }
        }

        if (options.convertNonBreaking) {
            const nbspMatches = text.match(/\u00A0/g);
            if (nbspMatches) {
                issues.push(`${nbspMatches.length} non-breaking space(s) found`);
            }
        }

        if (options.normalizeDashes) {
            const dashMatches = text.match(/[\u2014\u2013\u2212]/g);
            if (dashMatches) {
                issues.push(`${dashMatches.length} dash(es) to normalize found`);
            }
        }

        if (options.normalizeQuotes) {
            const quoteMatches = text.match(/[\u2018\u2019\u201C\u201D\u201E\u201A]/g);
            if (quoteMatches) {
                issues.push(`${quoteMatches.length} smart quote(s) found`);
            }
        }

        if (options.convertEllipsis) {
            const ellipsisMatches = text.match(/\u2026/g);
            if (ellipsisMatches) {
                issues.push(`${ellipsisMatches.length} ellipsis character(s) found`);
            }
        }

        if (options.removeTrailing) {
            const trailingMatches = text.match(/\s+$/gm);
            if (trailingMatches) {
                issues.push(`${trailingMatches.length} line(s) with trailing whitespace found`);
            }
        }

        return issues;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextCleaner;
} else {
    window.TextCleaner = TextCleaner;
}