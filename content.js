fetch(chrome.runtime.getURL('memo.html'))
    .then(response => response.text())
    .then(data => {
        document.body.insertAdjacentHTML('beforeend', data);

        const memoContainer = document.getElementById('memoContainer');
        const memoTextArea = document.getElementById('pageMemo');
        const memoHeader = document.getElementById('memoHeader');
        const toggleButton = document.getElementById('toggleButton');
        const deleteButton = document.getElementById('deleteButton');
        const memoIcon = document.getElementById('memoIcon');

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
    })
    .catch(error => console.error('Error loading memo.html:', error));
