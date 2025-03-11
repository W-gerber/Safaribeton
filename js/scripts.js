(function () {
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

  document.addEventListener("DOMContentLoaded", () => {
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
        link.classList.toggle("active", link.getAttribute("href") === `#${currentSectionId}`);
      });
      header.classList.toggle("scrolled", window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

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
        currentImageIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
        updateImageDisplay();
      });

      rightArrow.addEventListener("click", () => {
        currentImageIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
        updateImageDisplay();
      });

      updateImageDisplay();
    });

    emailjs.init("SxH6Bi3FPlFrT6Vbu");

    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const submitButton = this.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        emailjs
          .sendForm("service_bkz7sda", "template_jqrv3n2", this)
          .then((response) => {
            console.log("SUCCESS!", response);
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
      popup.style.backgroundColor = isSuccess ? "rgba(0, 255, 0, 0.75)" : "rgba(204, 42, 42, 0.75)";
      popup.style.color = isSuccess ? "#333" : "#fff";

      document.body.appendChild(popup);

      setTimeout(() => {
        popup.classList.add("fade-out");
        setTimeout(() => popup.remove(), 500);
      }, 2500);
    }

    document.querySelectorAll("figure.snip1206 a").forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        document.querySelectorAll("figure.snip1206 a").forEach((l) => l.classList.remove("hover"));
        this.classList.add("hover");
        setTimeout(() => {
          this.classList.remove("hover");
        }, 1000);
      });
    });
  });
})();
window.addEventListener('scroll', function() {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (window.scrollY > 0) {
    themeColorMeta.setAttribute('content', 'rgba(0, 0, 0, 0.5)');
  } else {
    themeColorMeta.setAttribute('content', '#003c27');
  }
}); 
