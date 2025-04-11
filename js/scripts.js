(function () {
  // --- Google Analytics ---
  const gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-XWG4YB3C13";
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XWG4YB3C13");

  // --------------------------------
  // DOMContentLoaded main script block
  // --------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    // 1) Scroll animation setup
    const animatedElements = document.querySelectorAll(".scroll-animate");
    if (animatedElements.length > 0) {
      const animateObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              animateObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      animatedElements.forEach((el) => animateObserver.observe(el));
    }

    // 2) Section highlighting in nav & header "scrolled" class
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav ul li a");
    const header = document.querySelector("header");

    const handleScroll = () => {
      const scrollPos = window.scrollY + header.offsetHeight + 10;
      let currentSectionId = "";
      sections.forEach((section) => {
        if (scrollPos >= section.offsetTop) {
          currentSectionId = section.getAttribute("id");
        }
      });
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${currentSectionId}`
        );
      });
      header.classList.toggle("scrolled", window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    // 3) Shop item carousels
    document.querySelectorAll(".shop-item").forEach((item) => {
      const images = item.querySelectorAll(".carousel img");
      let currentImageIndex = 0;

      const leftArrow = document.createElement("button");
      leftArrow.classList.add("carousel-arrow", "left");
      leftArrow.textContent = "<";
      item.appendChild(leftArrow);

      const rightArrow = document.createElement("button");
      rightArrow.classList.add("carousel-arrow", "right");
      rightArrow.textContent = ">";
      item.appendChild(rightArrow);

      const updateImageDisplay = () => {
        images.forEach((img, index) => {
          img.style.display = index === currentImageIndex ? "block" : "none";
        });
      };

      leftArrow.addEventListener("click", () => {
        currentImageIndex =
          currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
        updateImageDisplay();
      });

      rightArrow.addEventListener("click", () => {
        currentImageIndex =
          currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
        updateImageDisplay();
      });

      updateImageDisplay();
    });
    // 4) Contact form (EmailJS)
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const submitButton = this.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        // Prepare form data
        const formData = {
          name: this.querySelector("#name").value,
          surname: this.querySelector("#surname").value,
          email: this.querySelector("#email").value,
          number: this.querySelector("#Number").value,
          message: this.querySelector("#message").value
        };

        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        })
          .then((response) => {
            if (!response.ok) {
              return response.text().then((text) => {
                throw new Error(text);
              });
            }
            return response.json();
          })
          .then((data) => {
            console.log("SUCCESS!", data);
            showPopup("✅ Your message has been sent successfully!", true);
          })
          .catch((error) => {
            console.error("FAILED...", error);
            showPopup("❌ Oops! Something went wrong.", false);
          })
          .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = "Send Message";
          });
      });
    }

    function showPopup(message, isSuccess) {
      const popup = document.createElement("div");
      popup.classList.add("popup-message");
      popup.textContent = message;
      popup.style.backgroundColor = isSuccess
        ? "rgba(107, 255, 107, 0.75)"
        : "rgba(197, 65, 65, 0.75)";
      popup.style.color = isSuccess ? "#333" : "#fff";

      document.body.appendChild(popup);

      setTimeout(() => {
        popup.classList.add("fade-out");
        setTimeout(() => popup.remove(), 500);
      }, 2500);
    }

    // 5) "Figure.snip1206" hover effect
    document.querySelectorAll("figure.snip1206 a").forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        document
          .querySelectorAll("figure.snip1206 a")
          .forEach((l) => l.classList.remove("hover"));
        this.classList.add("hover");
        setTimeout(() => {
          this.classList.remove("hover");
        }, 1000);
      });
    });

    // 6) Intersection Observer for .projects-grid
    const projectsSection = document.querySelector(".projects-section");
    const projectsGrid = document.querySelector(".projects-grid");

    if (projectsSection && projectsGrid) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              projectsGrid.classList.add("visible");
            }
          });
        },
        {
          threshold: 0.2,
        }
      );
      observer.observe(projectsSection);
    }

    // 7) Smooth scroll for in-page links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    // -------------------------------------------
    // New Projects Slider functionality (arrows in middle) – Updated
    // -------------------------------------------
    (function () {
      const track = document.querySelector(".projects-track");
      const leftArrow = document.querySelector(".slider-arrow.left");
      const rightArrow = document.querySelector(".slider-arrow.right");
      const cards = document.querySelectorAll(".project-card");

      if (!track || cards.length === 0) return;

      let currentIndex = 0;

      const updateSlider = () => {
        const cardWidth = cards[0].offsetWidth + 0; // Adjusted for margin
        const newTransform = -currentIndex * cardWidth;
        track.style.transform = `translateX(${newTransform}px)`;
      };

      // Left arrow – scroll right (backwards)
      leftArrow.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateSlider();
        }
      });

      // Right arrow – scroll left (forwards)
      rightArrow.addEventListener("click", () => {
        if (currentIndex < cards.length - 1) {
          currentIndex++;
          updateSlider();
        }
      });

      updateSlider();
    })();
  });
})();

// 8) Change theme-color on scroll
window.addEventListener("scroll", function () {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (window.scrollY > 0) {
    themeColorMeta.setAttribute("content", "rgba(0, 0, 0, 0.5)");
  } else {
    themeColorMeta.setAttribute("content", "#003c27");
  }
});
