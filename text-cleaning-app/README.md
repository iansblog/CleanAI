# 🧹 AI Text Clean

A powerful, modern web application for cleaning and normalizing text to ensure better compatibility across different systems and applications. Perfect for developers, writers, and anyone who needs to clean problematic characters from text.

## ✨ Features

- **Remove Hidden Characters**: Eliminates invisible characters like zero-width spaces that can break code and cause formatting issues
- **Convert Non-breaking Spaces**: Replaces non-breaking spaces (&nbsp;) with regular spaces
- **Normalize Dashes**: Converts em-dashes (—) and en-dashes (–) to standard hyphens (-)
- **Normalize Quotes**: Converts curly/smart quotes ("")'' to straight quotes ("'), essential for code compatibility
- **Convert Ellipsis**: Replaces ellipsis character (…) with three dots (...)
- **Remove Trailing Whitespace**: Eliminates whitespace at the end of lines

## 🚀 Quick Start

1. **Clone or Download**: Get the project files to your local machine
2. **Open**: Navigate to the `src` folder and open `index.html` in your web browser
3. **Start Cleaning**: Paste your text and watch it get cleaned automatically!

## 📁 Project Structure

```
text-cleaning-app/
├── src/
│   ├── index.html          # Main application page
│   ├── css/
│   │   └── styles.css      # Modern responsive styles
│   └── js/
│       ├── app.js          # Main application controller
│       ├── textCleaner.js  # Text cleaning logic
│       └── utils.js        # Utility functions
└── README.md               # This file
```

## 🎯 How to Use

### Basic Usage
1. **Paste Text**: Copy and paste your text into the input area
2. **Auto-Clean**: The text is automatically cleaned based on selected options
3. **Copy Result**: Use the "Copy Result" button to copy the cleaned text
4. **Download**: Save the cleaned text as a file using the "Download" button

### Cleaning Options
All cleaning options are enabled by default, but you can customize which operations to perform:

- ✅ **Remove hidden characters** - Removes zero-width spaces and other invisible characters
- ✅ **Convert non-breaking spaces** - Changes &nbsp; to regular spaces
- ✅ **Normalize dashes** - Converts em/en dashes to hyphens
- ✅ **Normalize quotes** - Changes smart quotes to straight quotes
- ✅ **Convert ellipsis** - Replaces … with ...
- ✅ **Remove trailing whitespace** - Cleans up line endings

### Keyboard Shortcuts
- **Ctrl/Cmd + Enter**: Clean text
- **Ctrl/Cmd + K**: Clear input
- **Ctrl/Cmd + Shift + C**: Copy output

## 🛠️ Technical Details

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
- **File Download**: Save cleaned text as .txt files
- **Accessibility**: Keyboard navigation and screen reader support
- **Mobile Friendly**: Responsive design that works on all devices

## 🔧 Customization

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

## 🧪 Testing

### Manual Testing
1. Test with various text inputs containing problematic characters
2. Verify each cleaning option works independently
3. Test keyboard shortcuts
4. Test on different devices and browsers

### Sample Test Text
```
"Smart quotes" and 'single smart quotes'
Em—dash and en–dash and minus−sign
Ellipsis character… 
Hidden characters: ‌​‍⁠﻿
Non-breaking spaces   
Trailing spaces at line end    
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Create a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues

- Clipboard API requires HTTPS in production environments
- Some older browsers may not support all features
- Large text files (>1MB) may cause performance issues

## 🔮 Future Enhancements

- [ ] Batch file processing
- [ ] More cleaning options (smart apostrophes, unicode normalization)
- [ ] Text comparison view (before/after)
- [ ] Export to different formats (JSON, CSV)
- [ ] Cleaning presets/profiles
- [ ] API integration for bulk processing
- [ ] Browser extension version

## 📞 Support

If you encounter any issues or have questions:

1. Check the browser console for error messages
2. Ensure your browser is up to date
3. Try disabling browser extensions
4. Test in an incognito/private window

## 🙏 Acknowledgments

- Inspired by various text cleaning tools and developer needs
- Built with modern web standards and best practices
- Designed for accessibility and usability

---

**Made with ❤️ for developers and writers who need clean, compatible text.**