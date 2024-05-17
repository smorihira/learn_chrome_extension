// Create a text area element
const memoTextArea = document.createElement('textarea');
memoTextArea.id = 'pageMemo';
memoTextArea.placeholder = 'Type your notes here...';

// Append the text area to the body
document.body.appendChild(memoTextArea);

// Load saved memo from localStorage
chrome.storage.local.get('pageMemo', function (data) {
    if (data.pageMemo) {
        memoTextArea.value = data.pageMemo;
    }
});

// Save memo to localStorage when text area content changes
memoTextArea.addEventListener('input', function () {
    chrome.storage.local.set({ pageMemo: memoTextArea.value });
});
