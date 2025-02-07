document.addEventListener('DOMContentLoaded', function () {
    // Device detection logic
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Load mobile-specific CSS if on a mobile device
    if (isMobileDevice) {
        let mobileStylesheet = document.createElement("link");
        mobileStylesheet.rel = "stylesheet";
        mobileStylesheet.href = "mobile-styles.css"; // Mobile-specific stylesheet
        document.head.appendChild(mobileStylesheet);
    }

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        let current = '';

        // Detect current section based on scroll position
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Check if the section is within the viewport
            if (window.scrollY >= sectionTop - sectionHeight / 3 &&
                window.scrollY < sectionTop + sectionHeight - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        // Update active class for navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });

        // Adjust header background on scroll
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
