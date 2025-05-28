# LinkedIn AI Comment Assistant

A Chrome extension that adds AI-powered comment suggestions to LinkedIn posts.

## Setup Instructions

1. Clone this repository
2. Add your API endpoint in `src/js/background.js`
3. Add icon files in the following locations:
   - `src/images/icon16.png` (16x16)
   - `src/images/icon48.png` (48x48)
   - `src/images/icon128.png` (128x128)
4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `extension` directory

## Features

- Adds an "AI Comment" button to LinkedIn posts
- Extracts post content and sends it to your API
- Automatically copies the generated comment to clipboard
- Inserts the comment into the LinkedIn comment box
- Visual feedback for loading, success, and error states

## Configuration

Update the API endpoint in `src/js/background.js`:

```javascript
const API_CONFIG = {
    endpoint: 'YOUR_API_ENDPOINT_HERE', // Replace with your actual API endpoint
    // ... other config options
};
```

## Development

The extension consists of:
- `manifest.json`: Extension configuration
- `src/js/content.js`: Handles button injection and UI interaction
- `src/js/background.js`: Manages API communication
- `src/css/content.css`: Styles for the AI comment button
- `src/popup.html`: Extension popup interface

## Notes

- The extension requires permission to access LinkedIn.com
- It only activates on LinkedIn feed pages
- No user data is stored locally
- API calls are made through the background service worker
- The extension uses Manifest V3

## Testing

1. Make sure your API endpoint is responding correctly
2. Test on different types of LinkedIn posts
3. Verify error handling works as expected
4. Check that the button appears correctly on scroll
5. Verify the comment box is properly populated 