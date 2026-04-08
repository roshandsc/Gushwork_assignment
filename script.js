document.addEventListener('DOMContentLoaded', () => {
    /**
     * STICKY HEADER LOGIC
     * Implementation: Appears when the user scrolls past the 'First Fold' (Hero Section).
     * Behavior: Slides down when scrolling down, and retracts when scrolling above the fold.
     */
    const stickyHeader = document.getElementById('sticky-header');
    const heroSection = document.querySelector('.hero-section');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        // Calculate the first fold based on hero section height.
        const firstFold = heroSection ? (heroSection.offsetTop + heroSection.offsetHeight) : window.innerHeight;

        if (currentScrollY > firstFold) {
            // Header is visible when past the fold
            stickyHeader.classList.add('is-visible');
        } else {
            // Header retracts when user scrolls back into the hero area
            stickyHeader.classList.remove('is-visible');
        }

        lastScrollY = currentScrollY;
    }, { passive: true }); // Optimized for scroll performance

    /**
     * IMAGE CAROUSEL & INTERACTIVE ZOOM
     * Handles thumbnail switching, arrow navigation, and high-fidelity magnification lens.
     */
    const mainImage = document.getElementById('main-image');
    const zoomPreview = document.getElementById('zoom-preview');
    const mainImageContainer = document.getElementById('main-image-container');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Navigation Controls
    const prevImageBtn = document.getElementById('prev-image');
    const nextImageBtn = document.getElementById('next-image');

    let currentIndex = 0;
    
    /**
     * Updates the gallery display based on provided index.
     * @param {number} index - The target image index.
     */
    function updateMainImage(index) {
        if (index < 0 || index >= thumbnails.length) return;
        
        // Update active thumbnail state
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');
        
        // Synchronize main view and zoom preview
        const fullSrc = thumbnails[index].getAttribute('data-full');
        mainImage.src = thumbnails[index].src;
        zoomPreview.style.backgroundImage = `url(${fullSrc})`;
        
        currentIndex = index;
    }

    // Attachment: Thumbnail Events
    thumbnails.forEach((thumb, index) => {
        // Switch on click
        thumb.addEventListener('click', () => updateMainImage(index));
        // Switch on hover for premium reactivity
        thumb.addEventListener('mouseenter', () => updateMainImage(index));
    });

    // Attachment: Navigation Arrows
    if (prevImageBtn) {
        prevImageBtn.addEventListener('click', () => {
            let nextIdx = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
            updateMainImage(nextIdx);
        });
    }

    if (nextImageBtn) {
        nextImageBtn.addEventListener('click', () => {
            let nextIdx = (currentIndex + 1) % thumbnails.length;
            updateMainImage(nextIdx);
        });
    }

    /**
     * MAGNIFICATION LENS EVENT HANDLING
     * Only active on desktop viewports (>= 1100px).
     */
    mainImageContainer.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1100) {
            zoomPreview.classList.add('active');
        }
    });

    mainImageContainer.addEventListener('mouseleave', () => {
        zoomPreview.classList.remove('active');
    });

    mainImageContainer.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 1100 || !zoomPreview.classList.contains('active')) return;

        const bounds = mainImageContainer.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        // Convert coordinates to percentage for background-position mapping
        const xPercent = (mouseX / bounds.width) * 100;
        const yPercent = (mouseY / bounds.height) * 100;

        zoomPreview.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
        zoomPreview.style.backgroundSize = '250%'; // 2.5x Magnification factor
    });

    /**
     * FAQ ACCORDION LOGIC
     * Smoothly toggles FAQ answers with auto-closing of non-active items.
     */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other accordion items for a cleaner UX
            faqItems.forEach(i => {
                i.classList.remove('active');
                const answer = i.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = null;
                    answer.style.padding = "0 24px 0 24px";
                }
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    // Dynamic calculation for smooth transition
                    answer.style.maxHeight = answer.scrollHeight + 40 + "px";
                    answer.style.padding = "0 24px 20px 24px";
                }
            }
        });
    });
});
