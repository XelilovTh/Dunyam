document.addEventListener('DOMContentLoaded', () => {
    const blocks = document.querySelectorAll('.block');
    
    // Assign random small rotations and offsets for the "pile" effect
    // This gives a more 3D/natural look when they land on the column
    blocks.forEach((block, index) => {
        const randomRot = (Math.random() * 8 - 4).toFixed(2); // Random rotation between -4 and 4 degrees
        block.style.setProperty('--rotation', `${randomRot}deg`);
    });

    /**
     * Function to check scroll position and activate blocks
     */
    function checkBlocks() {
        // Trigger the animation when the block is 80% from the top of the viewport
        const triggerBottom = window.innerHeight * 0.8;

        blocks.forEach(block => {
            const blockTop = block.getBoundingClientRect().top;

            if (blockTop < triggerBottom) {
                block.classList.add('active');
            } else {
                // If you want them to fly back out when scrolling up:
                block.classList.remove('active');
            }
        });
    }

    // Listen for scroll events
    window.addEventListener('scroll', checkBlocks);
    
    // Run once on load to catch blocks already in view
    checkBlocks();
    
    // Add a little bit of smooth scrolling for better experience
    document.documentElement.style.scrollBehavior = 'smooth';
});
