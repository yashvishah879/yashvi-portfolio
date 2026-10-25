(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    var labelDark = "Switch to Dark Mode";
    var labelLight = "Switch to Light Mode";

    function updateThemeButtonLabel() {
      themeToggle.textContent = document.body.classList.contains("dark-mode")
        ? labelLight
        : labelDark;
    }

    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      updateThemeButtonLabel();
    });

    updateThemeButtonLabel();
  }

  var sections = [
    { id: "about", link: document.querySelector('.site-nav a[href="#about"]') },
    { id: "skills", link: document.querySelector('.site-nav a[href="#skills"]') },
    { id: "projects", link: document.querySelector('.site-nav a[href="#projects"]') },
  ].filter(function (entry) {
    return entry.link && document.getElementById(entry.id);
  });

  if (sections.length === 0) {
    return;
  }

  document.body.classList.add("nav-highlight");

  function setActiveSection(sectionId) {
    sections.forEach(function (entry) {
      var isActive = entry.id === sectionId;
      if (isActive) {
        entry.link.setAttribute("aria-current", "true");
      } else {
        entry.link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -45% 0px",
        threshold: 0,
      }
    );

    sections.forEach(function (entry) {
      var el = document.getElementById(entry.id);
      if (el) {
        observer.observe(el);
      }
    });
  } else {
    setActiveSection(sections[0].id);
  }
})();
