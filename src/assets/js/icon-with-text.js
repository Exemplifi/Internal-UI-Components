console.log('icon-with-text.js loaded');
// Icon and Text Component Interactions
document.addEventListener('DOMContentLoaded', function() {
    const viewMoreButtons = document.querySelectorAll('.view-more');

    viewMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contentBlock = button.closest('.icon-text-content').querySelector('.content-hidden');
            const arrowIcon = button.querySelector('.arrow-circle img');
            const viewMoreText = button.querySelector('span');

            // Calculate actual content height before showing
            if (!contentBlock.classList.contains('show')) {
                // Temporarily set max-height to none to get actual height
                contentBlock.style.maxHeight = 'none';
                const actualHeight = contentBlock.scrollHeight;
                contentBlock.style.maxHeight = '0';

                // Force a reflow
                contentBlock.offsetHeight;

                // Set the max-height to actual height for animation
                requestAnimationFrame(() => {
                    contentBlock.style.maxHeight = actualHeight + 'px';
                });
            } else {
                contentBlock.style.maxHeight = '0';
            }

            // Toggle content visibility
            contentBlock.classList.toggle('show');

            // Toggle arrow rotation
            arrowIcon.classList.toggle('rotate');

            // Update button text
            viewMoreText.textContent = contentBlock.classList.contains('show') ? 'View Less' : 'View More';

            // Update ARIA attributes for accessibility
            button.setAttribute('aria-expanded', contentBlock.classList.contains('show'));
        });

        // Add keyboard accessibility
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });

        // Set initial ARIA attributes
        button.setAttribute('role', 'button');
        button.setAttribute('aria-expanded', 'false');
    });
});
