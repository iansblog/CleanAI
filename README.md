# AI Text Clean

A powerful, modern web application for cleaning and normalizing text to ensure better compatibility across different systems and applications. Perfect for developers, writers, and anyone who needs to clean problematic characters from text.

## Features

- **Remove Hidden Characters**: Eliminates invisible characters like zero-width spaces that can break code and cause formatting issues
- **Convert Non-breaking Spaces**: Replaces non-breaking spaces (&nbsp;) with regular spaces
- **Normalize Dashes**: Converts em-dashes (—) and en-dashes (–) to standard hyphens (-)
- **Normalize Quotes**: Converts curly/smart quotes ("")'' to straight quotes ("'), essential for code compatibility
- **Convert Ellipsis**: Replaces ellipsis character (…) with three dots (...)
- **Remove Trailing Whitespace**: Eliminates whitespace at the end of lines
- **Normalize Math Symbols**: Converts ×÷≤≥≠±∞° to ASCII equivalents
- **Fix Unicode Punctuation**: Normalizes special punctuation marks
- **Normalize Spacing**: Fixes various space characters and multiple spaces
- **Remove AI Artifacts**: Eliminates control chars and copy-paste artifacts
- **Fix Encoding Issues**: Repairs common UTF-8/Windows-1252 problems
- **Convert to Markdown**: Formats text with markdown headers, lists, links, and code

## Quick Start

### Option 1: Direct Browser Access
1. **Clone or Download**: Get the project files to your local machine
2. **Open**: Navigate to the `src` folder and open `index.html` in your web browser
3. **Start Cleaning**: Paste your text and watch it get cleaned automatically!

### Option 2: Docker Deployment 🐳
For production deployment or if you prefer containerized applications:

1. **See Docker Guide**: Check out [`DockerConfig/docker.md`](DockerConfig/docker.md) for complete Docker deployment instructions
2. **Quick Start**: Navigate to the `DockerConfig` directory and run the appropriate script for your system
3. **Access**: Open http://localhost:80 in your browser

##  Project Structure

```
CleanAI/
├── src/                      # Application source files
│   ├── index.html           # Main application page
│   ├── css/
│   │   └── styles.css       # Modern responsive styles
│   └── js/
│       ├── app.js           # Main application controller
│       ├── textCleaner.js   # Text cleaning logic
│       └── utils.js         # Utility functions
├── DockerConfig/            # Docker deployment files
│   ├── Dockerfile          # Docker container configuration
│   ├── docker-compose.yml  # Docker Compose setup
│   ├── nginx.conf          # Nginx server configuration
│   ├── run-docker.sh       # Linux/Mac Docker runner script
│   ├── run-docker.bat      # Windows Docker runner script
│   ├── .dockerignore       # Docker build exclusions
│   └── docker.md           # Docker deployment guide
└── README.md               # This file
```

## How to Use

### Basic Usage
1. **Paste Text**: Copy and paste your text into the input area
2. **Auto-Clean**: The text is automatically cleaned based on selected options
3. **Copy Result**: Use the "Copy Result" button to copy the cleaned text
4. **Download**: Save the cleaned text as a file using the "Download" button

### Cleaning Options
All cleaning options are enabled by default, but you can customize which operations to perform:

- **Remove hidden characters** - Removes zero-width spaces and other invisible characters
- **Convert non-breaking spaces** - Changes &nbsp; to regular spaces
- **Normalize dashes** - Converts em/en dashes to hyphens
- **Normalize quotes** - Changes smart quotes to straight quotes
- **Convert ellipsis** - Replaces … with ...
- **Remove trailing whitespace** - Cleans up line endings
- **Normalize math symbols** - Converts ×÷≤≥≠±∞° to ASCII equivalents
- **Fix Unicode punctuation** - Normalizes special punctuation marks
- **Normalize spacing** - Fixes various space characters and multiple spaces
- **Remove AI artifacts** - Eliminates control chars and copy-paste artifacts
- **Fix encoding issues** - Repairs common UTF-8/Windows-1252 problems
- **Convert to markdown** - Formats text with markdown headers, lists, links, and code

### Keyboard Shortcuts
- **Ctrl/Cmd + Enter**: Clean text
- **Ctrl/Cmd + K**: Clear input
- **Ctrl/Cmd + Shift + C**: Copy output

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and CSS custom properties
- **Vanilla JavaScript**: No dependencies, pure JavaScript implementation
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Key Features
- **Real-time Processing**: Text is cleaned automatically as you type (with debouncing)
- **Statistics**: View detailed stats about what was cleaned
- **Clipboard Integration**: Modern clipboard API with fallbacks
- **File Download**: Save cleaned text as .txt or .md files
- **Accessibility**: Keyboard navigation and screen reader support
- **Mobile Friendly**: Responsive design that works on all devices

## Customization

### Adding New Cleaning Rules
To add a new text cleaning operation:

1. **Add the function** to `textCleaner.js`:
```javascript
cleanCustomRule(text) {
    // Your cleaning logic here
    const cleaned = text.replace(/pattern/g, 'replacement');
    this.stats.replacedCount += /* count changes */;
    return cleaned;
}
```

2. **Add the option** to `index.html`:
```html
<label class="option">
    <input type="checkbox" id="customRule" checked>
    <span class="checkmark"></span>
    Custom Rule Name
    <small>Description of what it does</small>
</label>
```

3. **Wire it up** in `app.js`:
```javascript
// Add to getCleaningOptions()
customRule: this.customRuleCheckbox.checked,

// Add to cleanText() method
if (options.customRule) {
    cleanedText = this.textCleaner.cleanCustomRule(cleanedText);
}
```

### Styling Customization
The app uses CSS custom properties (variables) for easy theming. Edit the `:root` section in `styles.css` to change colors, spacing, and other design elements.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Known Issues

- Clipboard API requires HTTPS in production environments
- Some older browsers may not support all features
- Large text files (>1MB) may cause performance issues

## Future Enhancements

- Batch file processing
- More cleaning options (smart apostrophes, unicode normalization)
- Text comparison view (before/after)
- API integration for bulk processing


## Acknowledgments

- Inspired by various text cleaning tools and developer needs
- Built with modern web standards and best practices  
- Designed for accessibility and usability

---

