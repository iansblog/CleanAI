/**
 * Utility Functions
 * Helper functions for common operations
 */

class Utils {
    constructor() {
        this.notificationTimeout = null;
    }

    /**
     * Debounce function to limit the rate of function execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @param {boolean} immediate - Whether to execute immediately
     * @returns {Function} - Debounced function
     */
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    /**
     * Throttle function to limit the rate of function execution
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} - Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Show a notification to the user
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, warning, error)
     * @param {number} duration - Duration in milliseconds (default: 3000)
     */
    showNotification(message, type = 'success', duration = 3000) {
        // Remove existing notification if any
        this.removeNotification();

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.id = 'notification';

        // Add to document
        document.body.appendChild(notification);

        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto-remove notification
        this.notificationTimeout = setTimeout(() => {
            this.removeNotification();
        }, duration);

        // Allow manual removal by clicking
        notification.addEventListener('click', () => {
            this.removeNotification();
        });
    }

    /**
     * Remove the current notification
     */
    removeNotification() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
            this.notificationTimeout = null;
        }
    }

    /**
     * Copy text to clipboard with fallback for older browsers
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} - Success status
     */
    async copyToClipboard(text) {
        try {
            // Modern clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                return this.fallbackCopyToClipboard(text);
            }
        } catch (error) {
            console.error('Failed to copy text: ', error);
            return this.fallbackCopyToClipboard(text);
        }
    }

    /**
     * Fallback method for copying text to clipboard
     * @param {string} text - Text to copy
     * @returns {boolean} - Success status
     */
    fallbackCopyToClipboard(text) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const result = document.execCommand('copy');
            document.body.removeChild(textArea);
            return result;
        } catch (error) {
            console.error('Fallback copy failed: ', error);
            return false;
        }
    }

    /**
     * Read text from clipboard
     * @returns {Promise<string>} - Clipboard text
     */
    async readFromClipboard() {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                return await navigator.clipboard.readText();
            } else {
                throw new Error('Clipboard API not available');
            }
        } catch (error) {
            console.error('Failed to read from clipboard: ', error);
            throw error;
        }
    }

    /**
     * Download text as a file
     * @param {string} content - File content
     * @param {string} filename - File name
     * @param {string} mimeType - MIME type (default: text/plain)
     */
    downloadTextFile(content, filename, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up the URL object
        URL.revokeObjectURL(url);
    }

    /**
     * Format file size in human readable format
     * @param {number} bytes - Size in bytes
     * @returns {string} - Formatted size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Format number with thousands separator
     * @param {number} num - Number to format
     * @returns {string} - Formatted number
     */
    formatNumber(num) {
        return num.toLocaleString();
    }

    /**
     * Generate a timestamp string for file names
     * @returns {string} - Timestamp string
     */
    generateTimestamp() {
        const now = new Date();
        return now.toISOString().slice(0, 19).replace(/:/g, '-');
    }

    /**
     * Validate if text contains problematic characters
     * @param {string} text - Text to validate
     * @returns {Object} - Validation result with issues found
     */
    validateText(text) {
        const issues = [];
        
        // Check for hidden characters
        const hiddenCharRegex = /[\u200B\u200C\u200D\u2060\uFEFF\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u061C\u180E\u034F]/g;
        const hiddenMatches = text.match(hiddenCharRegex);
        if (hiddenMatches) {
            issues.push({
                type: 'hidden_characters',
                count: hiddenMatches.length,
                description: 'Hidden/invisible characters found'
            });
        }

        // Check for non-breaking spaces
        const nbspMatches = text.match(/\u00A0/g);
        if (nbspMatches) {
            issues.push({
                type: 'non_breaking_spaces',
                count: nbspMatches.length,
                description: 'Non-breaking spaces found'
            });
        }

        // Check for smart quotes
        const smartQuoteMatches = text.match(/[\u2018\u2019\u201C\u201D]/g);
        if (smartQuoteMatches) {
            issues.push({
                type: 'smart_quotes',
                count: smartQuoteMatches.length,
                description: 'Smart/curly quotes found'
            });
        }

        // Check for em/en dashes
        const dashMatches = text.match(/[\u2013\u2014]/g);
        if (dashMatches) {
            issues.push({
                type: 'fancy_dashes',
                count: dashMatches.length,
                description: 'Em/en dashes found'
            });
        }

        // Check for ellipsis characters
        const ellipsisMatches = text.match(/\u2026/g);
        if (ellipsisMatches) {
            issues.push({
                type: 'ellipsis',
                count: ellipsisMatches.length,
                description: 'Ellipsis characters found'
            });
        }

        // Check for trailing whitespace
        const trailingMatches = text.match(/[ \t]+$/gm);
        if (trailingMatches) {
            issues.push({
                type: 'trailing_whitespace',
                count: trailingMatches.length,
                description: 'Lines with trailing whitespace found'
            });
        }

        return {
            isClean: issues.length === 0,
            issues: issues,
            totalIssues: issues.reduce((sum, issue) => sum + issue.count, 0)
        };
    }

    /**
     * Escape HTML characters in text
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Unescape HTML characters in text
     * @param {string} html - HTML to unescape
     * @returns {string} - Unescaped text
     */
    unescapeHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    /**
     * Check if the browser supports the Clipboard API
     * @returns {boolean} - Support status
     */
    supportsClipboardAPI() {
        return navigator.clipboard && window.isSecureContext;
    }

    /**
     * Check if the device is mobile
     * @returns {boolean} - Mobile status
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Get text statistics
     * @param {string} text - Text to analyze
     * @returns {Object} - Text statistics
     */
    getTextStats(text) {
        if (!text) {
            return {
                characters: 0,
                charactersNoSpaces: 0,
                words: 0,
                lines: 0,
                paragraphs: 0
            };
        }

        const lines = text.split('\n');
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);

        return {
            characters: text.length,
            charactersNoSpaces: text.replace(/\s/g, '').length,
            words: words.length,
            lines: lines.length,
            paragraphs: paragraphs.length
        };
    }

    /**
     * Create a deep copy of an object
     * @param {*} obj - Object to clone
     * @returns {*} - Cloned object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        
        if (obj instanceof Array) {
            return obj.map(item => this.deepClone(item));
        }
        
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
} else {
    window.Utils = Utils;
}