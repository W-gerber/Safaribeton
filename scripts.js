document.addEventListener("DOMContentLoaded", function () {
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobileDevice) {
    const mobileStylesheet = document.createElement("link");
    mobileStylesheet.rel = "stylesheet";
    mobileStylesheet.href = "mobile-styles.css";
    document.head.appendChild(mobileStylesheet);
  }
  const animatedElements = document.querySelectorAll('.scroll-animate');
  const animateObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animateObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  animatedElements.forEach(el => animateObserver.observe(el));
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav ul li a");
  const header = document.querySelector("header");

  function updateActiveSection() {
    let scrollPos = window.scrollY + header.offsetHeight + 10;
    let currentSectionId = "";

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentSectionId) {
        link.classList.add("active");
      }
    });
  }

  updateActiveSection();
  window.addEventListener("scroll", updateActiveSection);
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
  const carouselItems = document.querySelectorAll(".shop-item");
  carouselItems.forEach(item => {
    const images = item.querySelectorAll(".carousel img");
    let currentImageIndex = 0;

    const leftArrow = document.createElement("button");
    leftArrow.classList.add("carousel-arrow", "left");
    leftArrow.innerHTML = "&lt;";
    item.appendChild(leftArrow);

    const rightArrow = document.createElement("button");
    rightArrow.classList.add("carousel-arrow", "right");
    rightArrow.innerHTML = "&gt;";
    item.appendChild(rightArrow);

    function updateImageDisplay() {
      images.forEach((img, index) => {
        img.style.display = (index === currentImageIndex) ? "block" : "none";
      });
    }

    leftArrow.addEventListener("click", () => {
      currentImageIndex = (currentImageIndex === 0) ? images.length - 1 : currentImageIndex - 1;
      updateImageDisplay();
    });

    rightArrow.addEventListener("click", () => {
      currentImageIndex = (currentImageIndex === images.length - 1) ? 0 : currentImageIndex + 1;
      updateImageDisplay();
    });

    updateImageDisplay();
  });
  emailjs.init("service_45a4pps");
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      emailjs.sendForm("service_45a4pps", "__ejs-test-mail-service__", this)
        .then(function (response) {
          console.log("SUCCESS!", response);
          alert("Your message has been sent successfully!");
        }, function (error) {
          console.log("FAILED...", error);
          alert("Oops! Something went wrong.");
        });
    });
  }
  const projectLinks = document.querySelectorAll("figure.snip1206 a");
  projectLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      projectLinks.forEach(l => l.classList.remove("hover"));
      this.classList.add("hover");
      setTimeout(() => {
        this.classList.remove("hover");
      }, 1000);
    });
  });
});
