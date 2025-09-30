/**
 * Main Application Controller
 * Handles UI interactions and coordinates text cleaning operations
 */

class App {
    constructor() {
        this.textCleaner = new TextCleaner();
        this.utils = new Utils();
        this.initializeElements();
        this.bindEvents();
        this.setupAutoClean();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        // Text areas
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');

        // Control buttons
        this.cleanTextBtn = document.getElementById('cleanText');
        this.clearInputBtn = document.getElementById('clearInput');
        this.pasteBtn = document.getElementById('pasteBtn');
        this.copyOutputBtn = document.getElementById('copyOutput');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.selectAllBtn = document.getElementById('selectAll');
        this.deselectAllBtn = document.getElementById('deselectAll');

        // Checkboxes for cleaning options
        this.removeHiddenCharsCheckbox = document.getElementById('removeHiddenChars');
        this.convertNonBreakingCheckbox = document.getElementById('convertNonBreaking');
        this.normalizeDashesCheckbox = document.getElementById('normalizeDashes');
        this.normalizeQuotesCheckbox = document.getElementById('normalizeQuotes');
        this.convertEllipsisCheckbox = document.getElementById('convertEllipsis');
        this.removeTrailingCheckbox = document.getElementById('removeTrailing');

        // Stats elements
        this.statsSection = document.getElementById('stats');
        this.removedCountElement = document.getElementById('removedCount');
        this.replacedCountElement = document.getElementById('replacedCount');
        this.originalLengthElement = document.getElementById('originalLength');
        this.finalLengthElement = document.getElementById('finalLength');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Main cleaning button
        this.cleanTextBtn.addEventListener('click', () => this.cleanText());

        // Input controls
        this.clearInputBtn.addEventListener('click', () => this.clearInput());
        this.pasteBtn.addEventListener('click', () => this.pasteText());

        // Output controls
        this.copyOutputBtn.addEventListener('click', () => this.copyOutput());
        this.downloadBtn.addEventListener('click', () => this.downloadResult());

        // Selection controls
        this.selectAllBtn.addEventListener('click', () => this.selectAllOptions());
        this.deselectAllBtn.addEventListener('click', () => this.deselectAllOptions());

        // Auto-clean on input change (with debounce)
        this.inputText.addEventListener('input', this.utils.debounce(() => {
            if (this.inputText.value.trim()) {
                this.cleanText();
            } else {
                this.clearOutput();
            }
        }, 500));

        // Clean on option change
        const checkboxes = [
            this.removeHiddenCharsCheckbox,
            this.convertNonBreakingCheckbox,
            this.normalizeDashesCheckbox,
            this.normalizeQuotesCheckbox,
            this.convertEllipsisCheckbox,
            this.removeTrailingCheckbox
        ];

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (this.inputText.value.trim()) {
                    this.cleanText();
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Prevent default behavior for paste area
        this.inputText.addEventListener('paste', (e) => {
            // Let the default paste happen, then clean after a short delay
            setTimeout(() => this.cleanText(), 10);
        });
    }

    /**
     * Set up auto-clean functionality
     */
    setupAutoClean() {
        // Check if there's text in the input on page load
        if (this.inputText.value.trim()) {
            this.cleanText();
        }
    }

    /**
     * Get current cleaning options from checkboxes
     * @returns {Object} - Current cleaning options
     */
    getCleaningOptions() {
        return {
            removeHiddenChars: this.removeHiddenCharsCheckbox.checked,
            convertNonBreaking: this.convertNonBreakingCheckbox.checked,
            normalizeDashes: this.normalizeDashesCheckbox.checked,
            normalizeQuotes: this.normalizeQuotesCheckbox.checked,
            convertEllipsis: this.convertEllipsisCheckbox.checked,
            removeTrailing: this.removeTrailingCheckbox.checked
        };
    }

    /**
     * Clean the input text and update the output
     */
    cleanText() {
        const inputText = this.inputText.value;
        
        if (!inputText.trim()) {
            this.clearOutput();
            return;
        }

        const options = this.getCleaningOptions();
        const result = this.textCleaner.cleanText(inputText, options);

        // Update output
        this.outputText.value = result.cleanedText;

        // Update statistics
        this.updateStats(result.stats);

        // Show visual feedback
        this.showCleaningFeedback();
    }

    /**
     * Update statistics display
     * @param {Object} stats - Cleaning statistics
     */
    updateStats(stats) {
        this.removedCountElement.textContent = stats.removedCount;
        this.replacedCountElement.textContent = stats.replacedCount;
        this.originalLengthElement.textContent = stats.originalLength;
        this.finalLengthElement.textContent = stats.finalLength;

        // Show stats section if there are changes
        if (stats.removedCount > 0 || stats.replacedCount > 0) {
            this.statsSection.style.display = 'block';
        } else {
            this.statsSection.style.display = 'none';
        }
    }

    /**
     * Show visual feedback when cleaning is performed
     */
    showCleaningFeedback() {
        this.cleanTextBtn.classList.add('cleaning');
        this.cleanTextBtn.textContent = '✅ Cleaned!';
        
        setTimeout(() => {
            this.cleanTextBtn.classList.remove('cleaning');
            this.cleanTextBtn.textContent = '✨ Clean Text';
        }, 1500);
    }

    /**
     * Clear input text
     */
    clearInput() {
        this.inputText.value = '';
        this.inputText.focus();
        this.clearOutput();
    }

    /**
     * Clear output and hide stats
     */
    clearOutput() {
        this.outputText.value = '';
        this.statsSection.style.display = 'none';
    }

    /**
     * Paste text from clipboard
     */
    async pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            this.inputText.value = text;
            this.inputText.focus();
            this.cleanText();
        } catch (err) {
            this.utils.showNotification('Unable to paste from clipboard. Please paste manually.', 'error');
        }
    }

    /**
     * Copy output text to clipboard
     */
    async copyOutput() {
        if (!this.outputText.value.trim()) {
            this.utils.showNotification('No text to copy!', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.outputText.value);
            this.utils.showNotification('Text copied to clipboard!', 'success');
            
            // Visual feedback
            this.copyOutputBtn.textContent = '✅ Copied!';
            setTimeout(() => {
                this.copyOutputBtn.textContent = 'Copy Result';
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            this.outputText.select();
            document.execCommand('copy');
            this.utils.showNotification('Text copied to clipboard!', 'success');
        }
    }

    /**
     * Download the cleaned text as a file
     */
    downloadResult() {
        if (!this.outputText.value.trim()) {
            this.utils.showNotification('No text to download!', 'warning');
            return;
        }

        const blob = new Blob([this.outputText.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = `cleaned-text-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.utils.showNotification('File downloaded!', 'success');
    }

    /**
     * Select all cleaning options
     */
    selectAllOptions() {
        const checkboxes = [
            this.removeHiddenCharsCheckbox,
            this.convertNonBreakingCheckbox,
            this.normalizeDashesCheckbox,
            this.normalizeQuotesCheckbox,
            this.convertEllipsisCheckbox,
            this.removeTrailingCheckbox
        ];

        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });

        if (this.inputText.value.trim()) {
            this.cleanText();
        }
    }

    /**
     * Deselect all cleaning options
     */
    deselectAllOptions() {
        const checkboxes = [
            this.removeHiddenCharsCheckbox,
            this.convertNonBreakingCheckbox,
            this.normalizeDashesCheckbox,
            this.normalizeQuotesCheckbox,
            this.convertEllipsisCheckbox,
            this.removeTrailingCheckbox
        ];

        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        this.clearOutput();
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter: Clean text
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.cleanText();
        }

        // Ctrl/Cmd + K: Clear input
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.clearInput();
        }

        // Ctrl/Cmd + Shift + C: Copy output
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            this.copyOutput();
        }

        // Ctrl/Cmd + A: Select all options (when not in text area)
        if ((e.ctrlKey || e.metaKey) && e.key === 'a' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
            e.preventDefault();
            this.selectAllOptions();
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});