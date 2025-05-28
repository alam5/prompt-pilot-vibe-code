// Configuration
const config = {
    buttonClass: 'ai-comment-button',
    buttonText: 'AI Comment',
    loadingClass: 'loading',
    successClass: 'success',
    errorClass: 'error'
};

// Helper function to create the AI comment button
function createAIButton() {
    const button = document.createElement('button');
    button.className = config.buttonClass;
    button.textContent = config.buttonText;
    button.title = 'Generate AI-powered comment';
    return button;
}

// Extract post content from a LinkedIn post
function extractPostContent(postElement) {
    // Find the main content container - updated selector
    const contentSelectors = [
        '.feed-shared-update-v2__description',
        '.feed-shared-text',
        '.feed-shared-text-view',
        'article .share-update-card__update-text',
        '.share-article__description'
    ];

    let content = '';
    for (const selector of contentSelectors) {
        const element = postElement.querySelector(selector);
        if (element) {
            content = element.textContent.trim();
            if (content) break;
        }
    }

    if (!content) {
        console.log('Could not find content with any known selectors');
        return null;
    }

    return content;
}

// Find the comment box for a post
function findCommentBox(postElement) {
    const commentSelectors = [
        '.comments-comment-box__input',
        '.comments-comment-texteditor__input',
        'div[contenteditable="true"][aria-label*="comment"]',
        '.ql-editor'
    ];

    for (const selector of commentSelectors) {
        const element = postElement.querySelector(selector);
        if (element) return element;
    }

    return null;
}

// Handle button click
async function handleButtonClick(event) {
    const button = event.currentTarget;
    const postElement = findParentPost(button);
    
    if (!postElement) {
        console.error('Could not find parent post element');
        return;
    }

    // Add loading state
    button.classList.add(config.loadingClass);
    button.textContent = 'Generating...';

    try {
        // Extract post content
        const postContent = extractPostContent(postElement);
        if (!postContent) {
            throw new Error('Could not extract post content');
        }

        // Send message to background script for API call
        const response = await chrome.runtime.sendMessage({
            action: 'generateComment',
            data: { postContent }
        });

        if (!response || response.error) {
            throw new Error(response?.error || 'Failed to generate comment');
        }

        // Copy to clipboard
        await navigator.clipboard.writeText(response.comment);

        // Find and populate comment box
        const commentBox = findCommentBox(postElement);
        if (commentBox) {
            commentBox.focus();
            if (commentBox.hasAttribute('contenteditable')) {
                commentBox.textContent = response.comment;
            } else {
                commentBox.value = response.comment;
            }
            // Trigger input event to activate any LinkedIn listeners
            commentBox.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Show success state
        button.classList.remove(config.loadingClass);
        button.classList.add(config.successClass);
        button.textContent = 'Comment Generated!';
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.classList.remove(config.successClass);
            button.textContent = config.buttonText;
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        button.classList.remove(config.loadingClass);
        button.classList.add(config.errorClass);
        button.textContent = 'Error!';
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.classList.remove(config.errorClass);
            button.textContent = config.buttonText;
        }, 2000);
    }
}

// Find parent post element
function findParentPost(element) {
    const postSelectors = [
        '.feed-shared-update-v2',
        '.occludable-update',
        '.share-update-card',
        '.feed-shared-article'
    ];

    for (const selector of postSelectors) {
        const post = element.closest(selector);
        if (post) return post;
    }

    return null;
}

// Add buttons to posts
function addButtonsToPosts() {
    console.log('Searching for LinkedIn posts...');
    
    // Updated post selectors
    const postSelectors = [
        '.feed-shared-update-v2:not(.' + config.buttonClass + '-added)',
        '.occludable-update:not(.' + config.buttonClass + '-added)',
        '.share-update-card:not(.' + config.buttonClass + '-added)',
        '.feed-shared-article:not(.' + config.buttonClass + '-added)'
    ];
    
    const posts = document.querySelectorAll(postSelectors.join(', '));
    console.log('Found', posts.length, 'posts to process');
    
    posts.forEach(post => {
        // Check if we already processed this post
        if (post.classList.contains(config.buttonClass + '-added')) {
            return;
        }

        // Create and add button
        const button = createAIButton();
        button.addEventListener('click', handleButtonClick);

        // Find the post actions section and insert our button
        const actionSelectors = [
            '.feed-shared-social-actions',
            '.social-actions',
            '.share-update-card__actions',
            '.feed-shared-article__actions'
        ];

        let actionsSection;
        for (const selector of actionSelectors) {
            actionsSection = post.querySelector(selector);
            if (actionsSection) break;
        }

        if (actionsSection) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'ai-comment-button-container';
            buttonContainer.appendChild(button);
            actionsSection.appendChild(buttonContainer);
            console.log('Added button to post');
        } else {
            console.log('Could not find actions section for post');
        }

        // Mark post as processed
        post.classList.add(config.buttonClass + '-added');
    });
}

// Initialize observer for dynamic content
function initObserver() {
    console.log('Initializing MutationObserver');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                addButtonsToPosts();
            }
        });
    });

    // Start observing the feed with multiple possible selectors
    const feedSelectors = [
        '.core-rail',
        '.scaffold-layout__main',
        '.scaffold-finite-scroll__content',
        '.feed-following-feed'
    ];

    let feed;
    for (const selector of feedSelectors) {
        feed = document.querySelector(selector);
        if (feed) break;
    }

    if (feed) {
        observer.observe(feed, {
            childList: true,
            subtree: true
        });
        console.log('Observer started on feed');
    } else {
        console.log('Could not find feed element to observe');
        // Retry after a short delay
        setTimeout(() => {
            console.log('Retrying feed observation...');
            initObserver();
        }, 2000);
    }
}

// Initial setup
function initialize() {
    console.log('Initializing LinkedIn AI Comment Assistant');
    // Add buttons to existing posts
    addButtonsToPosts();
    
    // Set up observer for new posts
    initObserver();

    // Set up periodic check for new posts
    setInterval(addButtonsToPosts, 5000);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
} 