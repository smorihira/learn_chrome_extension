// Create a text area element
const memoTextArea = document.createElement('textarea');
memoTextArea.id = 'pageMemo';
memoTextArea.placeholder = 'Type your notes here...';

// Style the text area
memoTextArea.style.position = 'fixed';
memoTextArea.style.top = '10px';
memoTextArea.style.right = '10px';
memoTextArea.style.width = '200px';
memoTextArea.style.height = '150px';
memoTextArea.style.zIndex = '1000';
memoTextArea.style.backgroundColor = 'white';
memoTextArea.style.border = '1px solid #ccc';
memoTextArea.style.padding = '10px';
memoTextArea.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
memoTextArea.style.resize = 'none';

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
