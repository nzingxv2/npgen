document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const sectionButtons = document.querySelectorAll('.section-btn');
    const numberButtons = document.querySelectorAll('.number-btn');
    const codeInput = document.getElementById('codeInput');
    const resultCode = document.getElementById('resultCode');
    const resultBox = document.getElementById('resultBox');
    const copyStatus = document.getElementById('copyStatus');
    const themeToggle = document.getElementById('themeToggle');
    const copyBtn = document.getElementById('copyBtn');

    // State
    let currentSection = 'OD';
    let currentNumber = '24'; // Default sesuai tombol active

    // Initialize
    updateResult();
    codeInput.focus();

    // Event Listeners
    sectionButtons.forEach(button => {
        button.addEventListener('click', () => {
            sectionButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentSection = button.dataset.section;
            updateResult();
            codeInput.focus();
        });
    });

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            numberButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentNumber = button.dataset.number;
            updateResult();
            codeInput.focus();
        });
    });

    codeInput.addEventListener('input', function() {
        // Sanitize input - only allow numbers
        this.value = this.value.replace(/[^0-9]/g, '');

        // Auto-truncate to 7 digits
        if (this.value.length > 7) {
            this.value = this.value.slice(0, 7);
            triggerErrorShake(this);
        }

        updateResult();

        // Auto copy when 7 digits are entered
        if (this.value.length === 7) {
            copyToClipboard();
            resetInput();
        }
    });

    // Copy button
    copyBtn.addEventListener('click', function() {
        copyToClipboard();
        resetInput();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.target === codeInput) {
            if (e.key === 'Enter' || e.key === 'F9') {
                e.preventDefault();
                copyToClipboard();
                resetInput();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                codeInput.value = '';
                updateResult();
                codeInput.focus();
            }
        }

        // Global shortcuts
        // Section shortcuts (F1-F4)
        if (e.key === 'F1') {
            e.preventDefault();
            document.querySelector('[data-section="OD"]').click();
        } else if (e.key === 'F2') {
            e.preventDefault();
            document.querySelector('[data-section="SP"]').click();
        } else if (e.key === 'F3') {
            e.preventDefault();
            document.querySelector('[data-section="BN"]').click();
        } else if (e.key === 'F4') {
            e.preventDefault();
            document.querySelector('[data-section="TP"]').click();
        }

        // Number shortcuts (F5-F8)
        else if (e.key === 'F5') {
            e.preventDefault();
            document.querySelector('[data-number="23"]').click();
        } else if (e.key === 'F6') {
            e.preventDefault();
            document.querySelector('[data-number="24"]').click();
        } else if (e.key === 'F7') {
            e.preventDefault();
            document.querySelector('[data-number="25"]').click();
        } else if (e.key === 'F8') {
            e.preventDefault();
            document.querySelector('[data-number="26"]').click();
        }
    });

    // Theme toggle
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.textContent = document.body.classList.contains('dark-mode') ? '🌞' : '🌓';
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Check saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '🌞';
    }

    // Auto focus when clicking anywhere
    document.addEventListener('click', function(e) {
        if (e.target.closest('.card') && e.target !== codeInput) {
            codeInput.focus();
        }
    });

    // Functions
    function updateResult() {
        let codeValue = codeInput.value.padStart(7, '0');
        resultCode.textContent = `${currentSection}-${currentNumber}-F${codeValue}`;
    }

    function copyToClipboard() {
        const text = resultCode.textContent;

        navigator.clipboard.writeText(text).then(() => {
            // Visual feedback
            resultBox.classList.add('copied');
            copyStatus.classList.add('visible');

            setTimeout(() => {
                resultBox.classList.remove('copied');
                copyStatus.classList.remove('visible');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    function resetInput() {
        codeInput.value = '';
        updateResult();
        setTimeout(() => codeInput.focus(), 10);
    }

    function triggerErrorShake(element) {
        element.classList.add('error-shake');
        setTimeout(() => {
            element.classList.remove('error-shake');
        }, 500);
    }
});
