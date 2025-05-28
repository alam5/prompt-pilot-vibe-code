// Configuration
const API_CONFIG = {
    endpoint: 'YOUR_API_ENDPOINT_HERE', // Replace with your actual API endpoint
    retryAttempts: 3,
    retryDelay: 1000,
    timeout: 30000
};

// Log extension information on startup
console.log('Extension ID:', chrome.runtime.id);
console.log('Extension Version:', chrome.runtime.getManifest().version);

// Helper function to handle API calls with retry logic
async function makeAPICall(postContent, attempt = 1) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

        console.log('Making API call attempt:', attempt);
        console.log('Post content:', postContent);

        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Extension-ID': chrome.runtime.id
            },
            body: JSON.stringify({ content: postContent }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        console.log('API call successful');
        return { success: true, comment: data };

    } catch (error) {
        console.error(`API call attempt ${attempt} failed:`, error);

        if (attempt < API_CONFIG.retryAttempts) {
            console.log(`Retrying in ${API_CONFIG.retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay));
            return makeAPICall(postContent, attempt + 1);
        }

        return {
            success: false,
            error: error.message || 'Failed to generate comment'
        };
    }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request);
    console.log('From sender:', sender);

    if (request.action === 'generateComment') {
        // Handle the API call
        makeAPICall(request.data.postContent)
            .then(response => {
                console.log('Sending response back to content script:', response);
                sendResponse(response);
            })
            .catch(error => {
                console.error('Error in message handler:', error);
                sendResponse({ error: error.message });
            });

        // Return true to indicate we will send a response asynchronously
        return true;
    }
}); 