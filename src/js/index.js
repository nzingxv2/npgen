/*!
 * @file        index.js
 * @project     npgem
 * @author      nzingxv2 <nzingxv2@gmail.com>
 * @copyright   Copyright (c) 2025 nzingxv2
 * @license     MIT License
 *
 * @description 
 * Main JavaScript file for Your npgen.
 * Handles interactive behaviors, event listeners, and dynamic updates.
 *
 * @version     1.0.0
 * @created     2025-07-10
 * @last-updated 2025-07-10
 */


document.addEventListener('DOMContentLoaded', function() {
    /**
     * DOM Elements
     * @type {NodeListOf<Element>}
     */
    const sectionButtons = document.querySelectorAll('.section-btn');
    const numberButtons = document.querySelectorAll('.number-btn');
    const codeInput = document.getElementById('codeInput');
    const resultCode = document.getElementById('resultCode');
    const resultBox = document.getElementById('resultBox');
    const copyStatus = document.getElementById('copyStatus');
    const themeToggle = document.getElementById('themeToggle');
    const copyBtn = document.getElementById('copyBtn');
    
    /** @type {string} Current selected section */
    let currentSection = 'OD';
    let currentNumber = '24'; // Default sesuai tombol active

    // Initialize
    updateResult();
    codeInput.focus();

    /**
     * Handles section button click events
     */
    sectionButtons.forEach(button => {
        button.addEventListener('click', () => {
            sectionButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentSection = button.dataset.section;
            updateResult();
            codeInput.focus();
        });
    });

    /**
     * Handles number button click events
     */
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

            // Auto-copy when 7 digits entered
            if (this.value.length === 7) {
                copyToClipboard();
                resetInput();
            }
        });
    }

    // Copy button handler
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            copyToClipboard();
            resetInput();
        }
    });

    // Copy button
    copyBtn.addEventListener('click', function() {
        copyToClipboard();
        resetInput();
    });

    /**
     * Global keyboard shortcuts handler
     * @param {KeyboardEvent} e - Keyboard event
     */
    document.addEventListener('keydown', function(e) {
        // Input field shortcuts
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

        // Section selection shortcuts (F1-F4)
        if (['F1', 'F2', 'F3', 'F4'].includes(e.key)) {
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

        // Number selection shortcuts (F5-F8)
        if (['F5', 'F6', 'F7', 'F8'].includes(e.key)) {
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

    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            this.textContent = document.body.classList.contains('dark-mode') ? '🌞' : '🌓';
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });

        // Load saved theme preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '🌞';
        }
    }

    /**
     * Auto-focus input when clicking anywhere in card
     * @param {MouseEvent} e - Click event
     */
    document.addEventListener('click', function(e) {
        if (e.target.closest('.card') && e.target !== codeInput) {
            codeInput.focus();
        }
    });

    //////////////////////////
    // FUNCTION DEFINITIONS //
    //////////////////////////

    /**
     * Updates result code display
     */
    function updateResult() {
        let codeValue = codeInput.value.padStart(7, '0');
        resultCode.textContent = `${currentSection}-${currentNumber}-F${codeValue}`;
    }

    /**
     * Copies result code to clipboard
     */
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

    /**
     * Resets input field and refocuses
     */
    function resetInput() {
        codeInput.value = '';
        updateResult();
        setTimeout(() => codeInput.focus(), 10);
    }

    /**
     * Triggers error shake animation on element
     * @param {HTMLElement} element - Element to animate
     */
    function triggerErrorShake(element) {
        element.classList.add('error-shake');
        setTimeout(() => {
            element.classList.remove('error-shake');
        }, 500);
    }
});