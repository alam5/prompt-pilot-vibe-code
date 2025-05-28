# LinkedIn AI Comment Assistant

A Chrome extension that enhances LinkedIn interaction by providing AI-powered comment suggestions for posts.

## Features

- Adds an "AI Comment" button next to each LinkedIn post
- Extracts post content and sends it to your specified API endpoint
- Automatically copies the generated response to clipboard
- Inserts the AI-generated comment into LinkedIn's comment box
- Visual feedback for loading, success, and error states
- Supports various LinkedIn post types and layouts

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/linkedin-ai-comment-assistant.git
   cd linkedin-ai-comment-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the extension:
   - Open `extension/src/js/background.js`
   - Replace `YOUR_API_ENDPOINT_HERE` with your actual API endpoint

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `extension` directory from this project

## Development

### Project Structure

```
extension/
├── manifest.json          # Extension configuration
├── src/
│   ├── js/
│   │   ├── content.js    # Content script for LinkedIn integration
│   │   └── background.js # Background script for API communication
│   ├── css/
│   │   └── content.css   # Styles for the AI comment button
│   ├── images/           # Extension icons
│   └── popup.html        # Extension popup interface
```

### Making Changes

1. Modify the code in the `extension` directory
2. Reload the extension in Chrome to see your changes
3. Check the browser console for debug messages

## API Integration

The extension expects your API endpoint to:

1. Accept POST requests with JSON payload:
   ```json
   {
     "content": "LinkedIn post content here"
   }
   ```

2. Return a text response containing the generated comment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security Notes

- The extension requires permissions to access LinkedIn.com
- No user data is stored locally
- API calls are made through a background service worker
- Uses Manifest V3 for enhanced security

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details