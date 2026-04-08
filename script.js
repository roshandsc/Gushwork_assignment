document.addEventListener('DOMContentLoaded', () => {
    /* --- Sticky Header Logic --- */
    const stickyHeader = document.getElementById('sticky-header');
    const heroSection = document.querySelector('.hero-section');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const firstFold = heroSection ? (heroSection.offsetTop + heroSection.offsetHeight) : window.innerHeight;

        // "Appears when scrolling beyond the first fold"
        // "Disappears when scrolling back up"
        if (currentScrollY > firstFold) {
            if (currentScrollY > lastScrollY) {
                // Scrolling down past fold
                stickyHeader.classList.add('is-visible');
            } else {
                // Scrolling back up
                stickyHeader.classList.remove('is-visible');
            }
        } else {
            // Always hide if above the fold
            stickyHeader.classList.remove('is-visible');
        }

        lastScrollY = currentScrollY;
    });

    /* --- Image Carousel & Zoom Logic --- */
    const mainImage = document.getElementById('main-image');
    const zoomPreview = document.getElementById('zoom-preview');
    const mainImageContainer = document.getElementById('main-image-container');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Arrows
    const prevImageBtn = document.getElementById('prev-image');
    const nextImageBtn = document.getElementById('next-image');

    let currentIndex = 0;
    
    // Initialize zoom box background
    if (thumbnails.length > 0) {
        zoomPreview.style.backgroundImage = `url(${thumbnails[0].dataset.full})`;
    }

    function updateMainImage(index) {
        if (index < 0 || index >= thumbnails.length) return;
        
        // Remove active class from all
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        // Add active class to new
        thumbnails[index].classList.add('active');
        
        // Update main image source
        const minSrc = thumbnails[index].src;
        const fullSrc = thumbnails[index].dataset.full;
        
        mainImage.src = minSrc;
        zoomPreview.style.backgroundImage = `url(${fullSrc})`;
        
        currentIndex = index;
    }

    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            updateMainImage(index);
        });
        // Switch main image immediately on hover to replicate high-end interactive carousels
        thumb.addEventListener('mouseenter', () => {
            updateMainImage(index);
        });
    });

    if (prevImageBtn) {
        prevImageBtn.addEventListener('click', () => {
            let nextIdx = currentIndex - 1;
            if (nextIdx < 0) nextIdx = thumbnails.length - 1;
            updateMainImage(nextIdx);
        });
    }

    if (nextImageBtn) {
        nextImageBtn.addEventListener('click', () => {
            let nextIdx = currentIndex + 1;
            if (nextIdx >= thumbnails.length) nextIdx = 0;
            updateMainImage(nextIdx);
        });
    }

    // --- Zoom Hover Effect ---
    mainImageContainer.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1100) { // Only on larger screens
            zoomPreview.classList.add('active');
            zoomPreview.style.opacity = '1';
        }
    });

    mainImageContainer.addEventListener('mouseleave', () => {
        zoomPreview.classList.remove('active');
        zoomPreview.style.opacity = '0';
    });

    mainImageContainer.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 1100 || !zoomPreview.classList.contains('active')) return;

        // Get bounds and cursor position
        const bounds = mainImageContainer.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        // Calculate percentage position
        const xPercent = (mouseX / bounds.width) * 100;
        const yPercent = (mouseY / bounds.height) * 100;

        // Apply background position to zoom box
        zoomPreview.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
        
        // Increase background size so it actually zooms in
        zoomPreview.style.backgroundSize = '200%';
    });

    /* --- FAQ Accordion Logic --- */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all others
            faqItems.forEach(i => {
                i.classList.remove('active');
                // The styling handles the icon rotation.
                const answer = i.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = null;
                    answer.style.padding = "0 24px 0 24px";
                }
            });
            
            // Open this one if it was not active
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + 40 + "px"; // Account for padding
                    answer.style.padding = "0 24px 20px 24px";
                }
            }
        });
    });
});
