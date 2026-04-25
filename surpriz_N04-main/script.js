document.addEventListener('DOMContentLoaded', () => {
    const blocks = document.querySelectorAll('.block');
    const column = document.querySelector('.central-column');
    
    // Assign random small rotations for the final "pile" state
    blocks.forEach((block) => {
        const randomRot = (Math.random() * 12 - 6).toFixed(2); // Random rotation between -6 and 6 degrees
        block.style.setProperty('--rotation', `${randomRot}deg`);
    });

    /**
     * Function to handle scroll animations
     */
    function handleScroll() {
        const scrollY = window.scrollY;
        
        // 1. Rotate the central column based on scroll distance
        // This creates the effect that the column is spinning as you scroll
        if (column) {
            const rotation = scrollY * 0.2; // Adjust speed here
            column.style.transform = `rotateY(${rotation}deg)`;
        }

        // 2. Check each block for entry into the viewport
        const triggerBottom = window.innerHeight * 0.85;

        blocks.forEach(block => {
            const blockTop = block.getBoundingClientRect().top;

            if (blockTop < triggerBottom) {
                block.classList.add('active');
            } else {
                // Fly back out when scrolling up
                block.classList.remove('active');
            }
        });
    }

    // Use requestAnimationFrame for smoother performance during scroll
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    // Initial check on load
    handleScroll();
    
    // Smooth scroll for the page
    document.documentElement.style.scrollBehavior = 'smooth';
});
