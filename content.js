// Create a container div for the memo
const memoContainer = document.createElement('div');
memoContainer.id = 'memoContainer';

// Create a text area element
const memoTextArea = document.createElement('textarea');
memoTextArea.id = 'pageMemo';
memoTextArea.placeholder = 'Type your notes here...';

// Create a header for the memo
const memoHeader = document.createElement('div');
memoHeader.id = 'memoHeader';
memoHeader.textContent = 'Memo';

// Append the header and text area to the container
memoContainer.appendChild(memoHeader);
memoContainer.appendChild(memoTextArea);

// Append the container to the body
document.body.appendChild(memoContainer);

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

// Make the memo draggable
memoHeader.onmousedown = function (event) {
    event.preventDefault();

    let shiftX = event.clientX - memoContainer.getBoundingClientRect().left;
    let shiftY = event.clientY - memoContainer.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        memoContainer.style.left = pageX - shiftX + 'px';
        memoContainer.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.clientX, event.clientY);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        document.onmouseup = null;
    };
};

memoHeader.ondragstart = function () {
    return false;
};
