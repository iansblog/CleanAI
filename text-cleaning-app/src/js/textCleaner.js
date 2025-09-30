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
     * Normalize mathematical and special symbols
     * @param {string} text - Input text
     * @returns {string} - Cleaned text
     */
    normalizeMathSymbols(text) {
        let cleaned = text;
        let replacedCount = 0;

        // Mathematical symbols to ASCII equivalents
        const mathReplacements = [
            [/×/g, '*'],        // Multiplication sign to asterisk
            [/÷/g, '/'],        // Division sign to slash
            [/≤/g, '<='],       // Less than or equal
            [/≥/g, '>='],       // Greater than or equal
            [/≠/g, '!='],       // Not equal
            [/±/g, '+/-'],      // Plus-minus
            [/∞/g, 'infinity'], // Infinity
            [/°/g, ' degrees'], // Degree symbol
            [/′/g, "'"],        // Prime (minutes/feet)
            [/″/g, '"'],        // Double prime (seconds/inches)
            [/‰/g, '%o'],       // Per mille
            [/∑/g, 'sum'],      // Summation
            [/∏/g, 'product'],  // Product
            [/√/g, 'sqrt'],     // Square root
            [/∆/g, 'delta'],    // Delta
            [/π/g, 'pi'],       // Pi
            [/µ/g, 'micro']     // Micro
        ];

        mathReplacements.forEach(([regex, replacement]) => {
            const matches = cleaned.match(regex);
            if (matches) {
                replacedCount += matches.length;
                cleaned = cleaned.replace(regex, replacement);
            }
        });

        this.stats.replacedCount += replacedCount;
        return cleaned;
    }

    /**
     * Fix common Unicode punctuation issues
     * @param {string} text - Input text
     * @returns {string} - Cleaned text
     */
    fixUnicodePunctuation(text) {
        let cleaned = text;
        let replacedCount = 0;

        // Common Unicode punctuation fixes
        const punctuationFixes = [
            [/‚/g, ','],         // Single low quotation mark
            [/„/g, '"'],         // Double low quotation mark
            [/‹/g, '<'],         // Single left angle quotation mark
            [/›/g, '>'],         // Single right angle quotation mark
            [/«/g, '<<'],        // Left double angle quotation mark
            [/»/g, '>>'],        // Right double angle quotation mark
            [/¡/g, '!'],         // Inverted exclamation mark
            [/¿/g, '?'],         // Inverted question mark
            [/‾/g, '_'],         // Overline
            [/⁄/g, '/'],         // Fraction slash
            [/∕/g, '/'],         // Division slash
            [/⧸/g, '/'],         // Big solidus
            [/⧹/g, '\\'],        // Big reverse solidus
            [/＼/g, '\\'],       // Fullwidth reverse solidus
            [/／/g, '/']         // Fullwidth solidus
        ];

        punctuationFixes.forEach(([regex, replacement]) => {
            const matches = cleaned.match(regex);
            if (matches) {
                replacedCount += matches.length;
                cleaned = cleaned.replace(regex, replacement);
            }
        });

        this.stats.replacedCount += replacedCount;
        return cleaned;
    }

    /**
     * Normalize spacing and whitespace characters
     * @param {string} text - Input text
     * @returns {string} - Cleaned text
     */
    normalizeSpacing(text) {
        let cleaned = text;
        let replacedCount = 0;

        // Various space characters to regular space
        const spaceChars = [
            /\u2000/g, // En quad
            /\u2001/g, // Em quad
            /\u2002/g, // En space
            /\u2003/g, // Em space
            /\u2004/g, // Three-per-em space
            /\u2005/g, // Four-per-em space
            /\u2006/g, // Six-per-em space
            /\u2007/g, // Figure space
            /\u2008/g, // Punctuation space
            /\u2009/g, // Thin space
            /\u200A/g, // Hair space
            /\u3000/g  // Ideographic space
        ];

        spaceChars.forEach(regex => {
            const matches = cleaned.match(regex);
            if (matches) {
                replacedCount += matches.length;
                cleaned = cleaned.replace(regex, ' ');
            }
        });

        // Multiple consecutive spaces to single space
        const multiSpaceMatches = cleaned.match(/  +/g);
        if (multiSpaceMatches) {
            replacedCount += multiSpaceMatches.length;
            cleaned = cleaned.replace(/  +/g, ' ');
        }

        this.stats.replacedCount += replacedCount;
        return cleaned;
    }

    /**
     * Remove or fix common AI/copy-paste artifacts
     * @param {string} text - Input text
     * @returns {string} - Cleaned text
     */
    removeAIArtifacts(text) {
        let cleaned = text;
        let removedCount = 0;

        // Common AI response artifacts
        const artifacts = [
            /\u00AD/g,          // Soft hyphen
            /\uFFFD/g,          // Replacement character (�)
            /[\u0000-\u0008]/g, // Control characters (0-8)
            /[\u000B-\u000C]/g, // Control characters (11-12)
            /[\u000E-\u001F]/g, // Control characters (14-31)
            /\u007F/g,          // DEL character
            /[\u0080-\u009F]/g, // Control characters (128-159)
        ];

        artifacts.forEach(regex => {
            const beforeLength = cleaned.length;
            cleaned = cleaned.replace(regex, '');
            removedCount += beforeLength - cleaned.length;
        });

        // Remove multiple consecutive line breaks (more than 2)
        const excessiveLineBreaks = cleaned.match(/\n{3,}/g);
        if (excessiveLineBreaks) {
            removedCount += excessiveLineBreaks.reduce((sum, match) => sum + (match.length - 2), 0);
            cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
        }

        this.stats.removedCount += removedCount;
        return cleaned;
    }

    /**
     * Fix common encoding issues from copy-paste
     * @param {string} text - Input text
     * @returns {string} - Cleaned text
     */
    fixEncodingIssues(text) {
        let cleaned = text;
        let replacedCount = 0;

        // Common encoding artifacts
        const encodingFixes = [
            // Windows-1252 to UTF-8 common issues
            [/â€™/g, "'"],       // Right single quotation mark
            [/â€œ/g, '"'],       // Left double quotation mark
            [/â€/g, '"'],        // Right double quotation mark
            [/â€"/g, '—'],       // Em dash
            [/â€"/g, '–'],       // En dash
            [/â€¦/g, '...'],     // Horizontal ellipsis
            [/Â /g, ' '],        // Non-breaking space issue
            [/Ã¡/g, 'á'],       // á encoding issue
            [/Ã©/g, 'é'],       // é encoding issue
            [/Ã­/g, 'í'],       // í encoding issue
            [/Ã³/g, 'ó'],       // ó encoding issue
            [/Ãº/g, 'ú'],       // ú encoding issue
            [/Ã±/g, 'ñ'],       // ñ encoding issue
            [/â„¢/g, '™'],       // Trademark symbol
            [/Â©/g, '©'],        // Copyright symbol
            [/Â®/g, '®']         // Registered trademark symbol
        ];

        encodingFixes.forEach(([regex, replacement]) => {
            const matches = cleaned.match(regex);
            if (matches) {
                replacedCount += matches.length;
                cleaned = cleaned.replace(regex, replacement);
            }
        });

        this.stats.replacedCount += replacedCount;
        return cleaned;
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

        // New cleaning options
        if (options.normalizeMathSymbols) {
            cleanedText = this.normalizeMathSymbols(cleanedText);
        }

        if (options.fixUnicodePunctuation) {
            cleanedText = this.fixUnicodePunctuation(cleanedText);
        }

        if (options.normalizeSpacing) {
            cleanedText = this.normalizeSpacing(cleanedText);
        }

        if (options.removeAIArtifacts) {
            cleanedText = this.removeAIArtifacts(cleanedText);
        }

        if (options.fixEncodingIssues) {
            cleanedText = this.fixEncodingIssues(cleanedText);
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

        if (options.normalizeMathSymbols) {
            const mathMatches = text.match(/[×÷≤≥≠±∞°′″‰∑∏√∆πµ]/g);
            if (mathMatches) {
                issues.push(`${mathMatches.length} mathematical symbol(s) found`);
            }
        }

        if (options.fixUnicodePunctuation) {
            const punctuationMatches = text.match(/[‚„‹›«»¡¿‾⁄∕⧸⧹＼／]/g);
            if (punctuationMatches) {
                issues.push(`${punctuationMatches.length} Unicode punctuation mark(s) found`);
            }
        }

        if (options.normalizeSpacing) {
            const spaceMatches = text.match(/[\u2000-\u200A\u3000]|  +/g);
            if (spaceMatches) {
                issues.push(`${spaceMatches.length} spacing issue(s) found`);
            }
        }

        if (options.removeAIArtifacts) {
            const artifactMatches = text.match(/[\u00AD\uFFFD\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F\u0080-\u009F]|\n{3,}/g);
            if (artifactMatches) {
                issues.push(`${artifactMatches.length} AI artifact(s) found`);
            }
        }

        if (options.fixEncodingIssues) {
            const encodingMatches = text.match(/â€™|â€œ|â€|â€"|â€"|â€¦|Â |Ã[¡éíóúñ]|â„¢|Â[©®]/g);
            if (encodingMatches) {
                issues.push(`${encodingMatches.length} encoding issue(s) found`);
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