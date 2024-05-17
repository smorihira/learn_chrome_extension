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

// Create a button to toggle the memo visibility
const toggleButton = document.createElement('button');
toggleButton.id = 'toggleButton';
toggleButton.textContent = 'Hide';

// Create a button to delete the memo
const deleteButton = document.createElement('button');
deleteButton.id = 'deleteButton';
deleteButton.textContent = 'Delete';

// Create an icon for minimized state
const memoIcon = document.createElement('div');
memoIcon.id = 'memoIcon';
memoIcon.textContent = '📝'; // Example icon, you can use any emoji or image

// Append the buttons to the header
memoHeader.appendChild(toggleButton);
memoHeader.appendChild(deleteButton);

// Append the header and text area to the container
memoContainer.appendChild(memoHeader);
memoContainer.appendChild(memoTextArea);

// Append the container and icon to the body
document.body.appendChild(memoContainer);
document.body.appendChild(memoIcon);

// Load saved memo from localStorage
chrome.storage.local.get('pageMemo', function (data) {
    if (data.pageMemo) {
        memoTextArea.value = data.pageMemo;
    }
});

// Load saved memo position from localStorage
chrome.storage.local.get(['memoPositionX', 'memoPositionY'], function (data) {
    if (data.memoPositionX !== undefined && data.memoPositionY !== undefined) {
        memoContainer.style.left = data.memoPositionX + 'px';
        memoContainer.style.top = data.memoPositionY + 'px';
    }
});

function saveMemoPosition() {
    chrome.storage.local.set({
        memoPositionX: memoContainer.offsetLeft,
        memoPositionY: memoContainer.offsetTop
    });
}

// Save memo to localStorage when text area content changes
memoTextArea.addEventListener('input', function () {
    chrome.storage.local.set({ pageMemo: memoTextArea.value });
});

// Make the memo draggable
memoHeader.onmousedown = function (event) {
    if (event.target === toggleButton || event.target === deleteButton) return; // Prevent dragging when clicking the buttons

    event.preventDefault();

    let shiftX = event.clientX - memoContainer.getBoundingClientRect().left;
    let shiftY = event.clientY - memoContainer.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        memoContainer.style.left = pageX - shiftX + 'px';
        memoContainer.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.clientX, event.clientY);
        saveMemoPosition();  // Save position while moving
    }

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        document.onmouseup = null;
        saveMemoPosition();  // Save position after moving
    };
};

memoHeader.ondragstart = function () {
    return false;
};

// Toggle memo visibility
toggleButton.onclick = function () {
    if (memoTextArea.style.display === 'none' || memoTextArea.style.display === '') {
        memoTextArea.style.display = 'block';
        memoContainer.style.width = '250px';  // Original container width when shown
        memoContainer.style.height = 'auto';  // Auto adjust height when shown
        memoHeader.style.display = 'flex';  // Show header
        memoIcon.style.display = 'none';  // Hide icon
        toggleButton.textContent = 'Hide';
    } else {
        memoTextArea.style.display = 'none';
        memoContainer.style.width = '40px';  // Minimize the container width when hidden
        memoContainer.style.height = '40px'; // Minimize the container height when hidden
        memoHeader.style.display = 'none';  // Hide header
        memoIcon.style.display = 'block';  // Show icon
        memoIcon.style.left = memoContainer.style.left;  // Set icon position
        memoIcon.style.top = memoContainer.style.top;  // Set icon position
        toggleButton.textContent = 'Show';
    }
};

// Add event listener to delete the memo
deleteButton.addEventListener('click', function () {
    chrome.storage.local.remove('pageMemo', function () {
        memoTextArea.value = '';
    });
});

// Show memo when icon is clicked
memoIcon.onclick = function () {
    memoTextArea.style.display = 'block';
    memoContainer.style.width = '250px';  // Original container width when shown
    memoContainer.style.height = 'auto';  // Auto adjust height when shown
    memoHeader.style.display = 'flex';  // Show header
    memoIcon.style.display = 'none';  // Hide icon
    toggleButton.textContent = 'Hide';
};
