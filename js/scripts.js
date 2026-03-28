(function () {
  const EMAILJS_PUBLIC_KEY = "SxH6Bi3FPlFrT6Vbu";
  const EMAILJS_SERVICE_ID = "service_bkz7sda";
  const EMAILJS_TEMPLATE_ID = "template_jqrv3n2";

  const hideSkeleton = () => {
    const skeleton = document.querySelector(".page-skeleton");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-loaded");

    if (!skeleton) {
      return;
    }

    skeleton.classList.add("is-hidden");
    window.setTimeout(() => skeleton.remove(), 500);
  };

  const onIdle = (callback) => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(callback, { timeout: 1200 });
      return;
    }

    window.setTimeout(callback, 1);
  };

  const attachMediaChange = (mediaQuery, callback) => {
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", callback);
      return;
    }

    mediaQuery.addListener(callback);
  };

  const loadExternalScript = (src) =>
    new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);

      if (existingScript) {
        if (existingScript.dataset.loaded === "true") {
          resolve();
          return;
        }

        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener(
          "error",
          () => reject(new Error(`Failed to load script: ${src}`)),
          { once: true }
        );
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.addEventListener(
        "load",
        () => {
          script.dataset.loaded = "true";
          resolve();
        },
        { once: true }
      );
      script.addEventListener(
        "error",
        () => reject(new Error(`Failed to load script: ${src}`)),
        { once: true }
      );
      document.head.appendChild(script);
    });

  const ensureEmailJs = (() => {
    let emailJsPromise;

    return async () => {
      if (window.emailjs && window.emailjs.__safariBetonReady) {
        return window.emailjs;
      }

      if (!emailJsPromise) {
        emailJsPromise = loadExternalScript("https://cdn.emailjs.com/dist/email.min.js").then(
          () => {
            if (!window.emailjs) {
              throw new Error("EmailJS failed to initialize.");
            }

            window.emailjs.init(EMAILJS_PUBLIC_KEY);
            window.emailjs.__safariBetonReady = true;
            return window.emailjs;
          }
        );
      }

      return emailJsPromise;
    };
  })();

  const showPopup = (message, isSuccess) => {
    const popup = document.createElement("div");
    popup.classList.add("popup-message");
    popup.textContent = message;
    popup.style.backgroundColor = isSuccess
      ? "rgba(107, 255, 107, 0.75)"
      : "rgba(197, 65, 65, 0.75)";
    popup.style.color = isSuccess ? "#333" : "#fff";

    document.body.appendChild(popup);

    window.setTimeout(() => {
      popup.classList.add("fade-out");
      window.setTimeout(() => popup.remove(), 500);
    }, 2500);
  };

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
    const header = document.querySelector("header");
    const nav = document.querySelector("header nav");
    const navMenu = document.querySelector("nav ul");
    const navLinks = Array.from(document.querySelectorAll("nav ul li a"));
    const sections = Array.from(document.querySelectorAll("section"));
    const hamburger = document.querySelector(".hamburger");
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const contactForm = document.getElementById("contact-form");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 769px)");

    const openMobileNav = () => {
      if (!hamburger || !nav) {
        return;
      }

      hamburger.classList.add("active");
      hamburger.setAttribute("aria-expanded", "true");
      nav.classList.add("is-open");
      document.body.classList.add("nav-open");
    };

    const closeMobileNav = () => {
      if (!hamburger || !nav) {
        return;
      }

      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    };

    if (hamburger && navMenu) {
      hamburger.addEventListener("click", () => {
        if (nav.classList.contains("is-open")) {
          closeMobileNav();
          return;
        }

        openMobileNav();
      });

      attachMediaChange(desktopQuery, (event) => {
        if (event.matches) {
          closeMobileNav();
        }
      });

      document.addEventListener("click", (event) => {
        if (!nav.classList.contains("is-open")) {
          return;
        }

        const target = event.target;
        if (!(target instanceof Node)) {
          return;
        }

        if (hamburger.contains(target) || nav.contains(target)) {
          return;
        }

        closeMobileNav();
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeMobileNav();
        }
      });
    }

    onIdle(() => {
      const bubbleTargets = Array.from(
        document.querySelectorAll("#services, #about, .projects-section, #contact, #shop")
      );
      const isMobileQuery = window.matchMedia("(max-width: 768px)");
      const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
      const bubbleTimers = [];
      const bubbleVariants = [
        "bubble--light",
        "bubble--soft",
        "bubble--green",
        "bubble--green-deep",
      ];
      const bubbleDurationRanges = {
        "bubble--light": [4200, 5600],
        "bubble--soft": [5400, 7000],
        "bubble--green": [6000, 7600],
        "bubble--green-deep": [7000, 8600],
      };
      const targetCoverageRatio = 0.12;

      const scheduleTimeout = (callback, delay) => {
        let timeoutId = 0;
        timeoutId = window.setTimeout(() => {
          const timerIndex = bubbleTimers.indexOf(timeoutId);
          if (timerIndex >= 0) {
            bubbleTimers.splice(timerIndex, 1);
          }
          callback();
        }, delay);
        bubbleTimers.push(timeoutId);
        return timeoutId;
      };

      const clearBubbleTimers = () => {
        while (bubbleTimers.length > 0) {
          const timer = bubbleTimers.pop();
          window.clearTimeout(timer);
        }
      };

      const removeBubbleFields = () => {
        document.querySelectorAll(".bubble-field").forEach((field) => field.remove());
      };

      const getBubbleArea = (field) =>
        Array.from(field.children).reduce((totalArea, bubbleNode) => {
          const diameter = Number(bubbleNode.dataset.size || 0);
          return totalArea + Math.PI * Math.pow(diameter / 2, 2);
        }, 0);

      const getBubbleCenter = (bubbleNode) => ({
        x: Number(bubbleNode.dataset.centerX || 0),
        y: Number(bubbleNode.dataset.centerY || 0),
        size: Number(bubbleNode.dataset.size || 0),
      });

      const isBubblePositionOpen = (field, centerX, centerY, size) => {
        const minGapRatio = 0.9;

        return Array.from(field.children).every((bubbleNode) => {
          const existingBubble = getBubbleCenter(bubbleNode);
          const minDistance = ((existingBubble.size + size) / 2) * minGapRatio;
          const xDistance = existingBubble.x - centerX;
          const yDistance = existingBubble.y - centerY;
          return Math.hypot(xDistance, yDistance) >= minDistance;
        });
      };

      const findBubblePosition = (field, size) => {
        const fieldWidth = Math.max(field.clientWidth, size);
        const fieldHeight = Math.max(field.clientHeight, size);
        const minX = size / 2;
        const maxX = Math.max(minX, fieldWidth - size / 2);
        const minY = size / 2;
        const maxY = Math.max(minY, fieldHeight - size / 2);

        for (let attempt = 0; attempt < 18; attempt += 1) {
          const centerX = minX + Math.random() * (maxX - minX);
          const centerY = minY + Math.random() * (maxY - minY);

          if (isBubblePositionOpen(field, centerX, centerY, size)) {
            return { centerX, centerY };
          }
        }

        return null;
      };

      const spawnBubble = (field, sectionIndex) => {
        if (!field.isConnected) {
          return 0;
        }

        const bubble = document.createElement("span");
        const variant =
          bubbleVariants[
            (sectionIndex + Math.floor(Math.random() * bubbleVariants.length)) %
              bubbleVariants.length
          ];
        const [minDuration, maxDuration] = bubbleDurationRanges[variant];
        const size = Math.round(84 + Math.random() * 176);
        const duration = Math.round(
          minDuration + Math.random() * (maxDuration - minDuration)
        );
        const position = findBubblePosition(field, size);
        const area = Math.PI * Math.pow(size / 2, 2);

        if (!position) {
          return 0;
        }

        bubble.className = `bubble ${variant}`;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${position.centerX - size / 2}px`;
        bubble.style.top = `${position.centerY - size / 2}px`;
        bubble.style.setProperty("--bubble-duration", `${duration}ms`);
        bubble.dataset.size = String(size);
        bubble.dataset.centerX = String(position.centerX);
        bubble.dataset.centerY = String(position.centerY);

        field.appendChild(bubble);
        bubble.addEventListener(
          "animationend",
          () => {
            bubble.remove();
          },
          { once: true }
        );

        return area;
      };

      const scheduleCoverageLoop = (field, sectionIndex) => {
        const tick = () => {
          if (!field.isConnected) {
            return;
          }

          const section = field.parentElement;
          if (!section) {
            return;
          }

          const sectionArea = Math.max(section.clientWidth * section.clientHeight, 1);
          const targetArea = sectionArea * targetCoverageRatio;
          let currentArea = getBubbleArea(field);
          let spawnBudget = 5;

          while (currentArea < targetArea && spawnBudget > 0) {
            currentArea += spawnBubble(field, sectionIndex);
            spawnBudget -= 1;
          }

          scheduleTimeout(tick, 950 + sectionIndex * 70);
        };

        tick();
      };

      const initDynamicBubbles = () => {
        clearBubbleTimers();
        removeBubbleFields();

        if (
          bubbleTargets.length === 0 ||
          isMobileQuery.matches ||
          prefersReducedMotion.matches ||
          !finePointerQuery.matches
        ) {
          return;
        }

        bubbleTargets.forEach((section, sectionIndex) => {
          const field = document.createElement("div");
          field.className = "bubble-field";
          field.setAttribute("aria-hidden", "true");
          section.prepend(field);
          scheduleCoverageLoop(field, sectionIndex);
        });
      };

      initDynamicBubbles();
      attachMediaChange(isMobileQuery, initDynamicBubbles);
      attachMediaChange(finePointerQuery, initDynamicBubbles);
      attachMediaChange(prefersReducedMotion, initDynamicBubbles);
    });

    const animatedElements = document.querySelectorAll(".scroll-animate");
    if (animatedElements.length > 0) {
      const animateObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("visible");
            animateObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.1 }
      );

      animatedElements.forEach((element) => animateObserver.observe(element));
    }

    let lastScrollY = window.scrollY;
    let scrollTicking = false;

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      const headerHeight = header ? header.offsetHeight : 0;
      const scrollPos = currentScrollY + headerHeight + 10;

      if (header) {
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          header.classList.add("hidden");
        } else {
          header.classList.remove("hidden");
        }
      }

      let currentSectionId = "";
      sections.forEach((section) => {
        if (scrollPos >= section.offsetTop) {
          currentSectionId = section.getAttribute("id") || "";
        }
      });

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${currentSectionId}`);
      });

      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", currentScrollY > 0 ? "#02130c" : "#032317");
      }

      lastScrollY = currentScrollY;
      scrollTicking = false;
    };

    const requestScrollUpdate = () => {
      if (scrollTicking) {
        return;
      }

      scrollTicking = true;
      window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });

    document.querySelectorAll(".shop-item").forEach((item, itemIndex) => {
      const carousel = item.querySelector(".carousel");
      const title = item.querySelector("h3");
      const images = Array.from(item.querySelectorAll(".carousel img"));
      let currentImageIndex = 0;

      if (!carousel || !title || images.length === 0) {
        return;
      }

      const mobileShopQuery = window.matchMedia("(max-width: 480px)");
      const titleRow = document.createElement("div");
      titleRow.classList.add("shop-item__header");
      item.insertBefore(titleRow, title);
      titleRow.appendChild(title);

      const controls = document.createElement("div");
      controls.classList.add("shop-item__controls");

      const leftArrow = document.createElement("button");
      leftArrow.classList.add("carousel-arrow", "left");
      leftArrow.type = "button";
      leftArrow.setAttribute("aria-label", `Show previous product image ${itemIndex + 1}`);
      leftArrow.textContent = "<";
      controls.appendChild(leftArrow);

      const rightArrow = document.createElement("button");
      rightArrow.classList.add("carousel-arrow", "right");
      rightArrow.type = "button";
      rightArrow.setAttribute("aria-label", `Show next product image ${itemIndex + 1}`);
      rightArrow.textContent = ">";
      controls.appendChild(rightArrow);

      const syncCarouselControlsPlacement = () => {
        if (mobileShopQuery.matches) {
          titleRow.appendChild(title);
          item.insertBefore(controls, titleRow);
          return;
        }

        titleRow.append(leftArrow, title, rightArrow);
      };

      syncCarouselControlsPlacement();
      attachMediaChange(mobileShopQuery, syncCarouselControlsPlacement);

      const updateImageDisplay = () => {
        images.forEach((image, index) => {
          image.style.display = index === currentImageIndex ? "block" : "none";
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

    if (contactForm) {
      const submitButton = contactForm.querySelector("button[type='submit']");
      const primeEmailJs = () => {
        ensureEmailJs().catch(() => {
          // Ignore priming failures; submit will surface a visible message if needed.
        });
      };

      contactForm.addEventListener("focusin", primeEmailJs, { once: true });

      const formObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) {
            return;
          }

          primeEmailJs();
          formObserver.disconnect();
        },
        { rootMargin: "200px 0px" }
      );
      formObserver.observe(contactForm);

      contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!submitButton) {
          return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        try {
          const emailjs = await ensureEmailJs();
          await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this);
          this.reset();
          showPopup("Your message has been sent successfully.", true);
        } catch (error) {
          console.error("FAILED...", error);
          showPopup("Oops! Something went wrong. Please try again.", false);
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = "Send Message";
        }
      });
    }

    document.querySelectorAll("figure.snip1206 a").forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        document
          .querySelectorAll("figure.snip1206 a")
          .forEach((anchor) => anchor.classList.remove("hover"));
        this.classList.add("hover");
        window.setTimeout(() => {
          this.classList.remove("hover");
        }, 1000);
      });
    });

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
        { threshold: 0.2 }
      );
      observer.observe(projectsSection);
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (event) {
        const targetSelector = this.getAttribute("href");

        if (!targetSelector || targetSelector === "#") {
          return;
        }

        const target = document.querySelector(targetSelector);
        if (!target) {
          return;
        }

        event.preventDefault();
        closeMobileNav();
        target.scrollIntoView({
          behavior: prefersReducedMotion.matches ? "auto" : "smooth",
          block: "start",
        });
      });
    });

    (() => {
      const aboutPhoto = document.getElementById("about-rotating-photo");

      if (aboutPhoto) {
        const imageSources = (aboutPhoto.dataset.aboutImages || "")
          .split("|")
          .map((value) => value.trim())
          .filter(Boolean);
        const imageAlts = (aboutPhoto.dataset.aboutAlts || "")
          .split("|")
          .map((value) => value.trim());

        if (imageSources.length > 1) {
          let aboutIndex = 0;

          const swapAboutPhoto = (nextIndex) => {
            aboutPhoto.classList.add("is-fading");

            window.setTimeout(() => {
              aboutPhoto.src = imageSources[nextIndex];
              aboutPhoto.alt = imageAlts[nextIndex] || aboutPhoto.alt;
              aboutPhoto.classList.remove("is-fading");
            }, 220);
          };

          imageSources.slice(1).forEach((src) => {
            const preloadImage = new Image();
            preloadImage.src = src;
          });

          window.setInterval(() => {
            aboutIndex = (aboutIndex + 1) % imageSources.length;
            swapAboutPhoto(aboutIndex);
          }, 7000);
        }
      }
    })();

    (() => {
      const featuredImage = document.getElementById("projects-featured-image");
      const featuredTitle = document.getElementById("projects-featured-title");
      const featuredDescription = document.getElementById("projects-featured-description");
      const leftArrow = document.querySelector(".slider-arrow.left");
      const rightArrow = document.querySelector(".slider-arrow.right");
      const cards = Array.from(document.querySelectorAll(".projects-data .project-card"));

      if (!featuredImage || !featuredTitle || !featuredDescription || !leftArrow || !rightArrow || cards.length === 0) {
        return;
      }

      let currentIndex = 0;

      const render = () => {
        const activeCard = cards[currentIndex];
        const activeImage = activeCard.querySelector("img");
        const activeTitle = activeCard.querySelector(".project-title");
        const activeDescription = activeCard.querySelector(".project-description");

        if (!activeImage || !activeTitle || !activeDescription) {
          return;
        }

        featuredImage.classList.add("is-fading");
        window.setTimeout(() => {
          featuredImage.src = activeImage.src;
          featuredImage.alt = activeImage.alt;
          featuredTitle.textContent = activeTitle.textContent || "Safari Beton Projects";
          featuredDescription.textContent =
            activeDescription.textContent ||
            "Crafted precast systems for homes and developments that demand strength, speed, and a polished finish.";
          featuredImage.classList.remove("is-fading");
        }, 320);

        cards.forEach((card, index) => {
          card.classList.toggle("is-active", index === currentIndex);
        });
      };

      leftArrow.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        render();
      });

      rightArrow.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % cards.length;
        render();
      });

      render();
    })();
  });

  window.addEventListener(
    "load",
    () => {
      window.setTimeout(hideSkeleton, 250);
    },
    { once: true }
  );

  window.setTimeout(hideSkeleton, 2200);
})();
