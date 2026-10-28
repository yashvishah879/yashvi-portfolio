(function () {
  "use strict";

  "The Code With AI Quiz is available from the Quiz folder linked in the portfolio Projects section."
  // Leave empty to keep the email button hidden.
  var CONTACT_EMAIL = "yashvishah879@gmail.com";
  var FACTORIAL_MAX = 2000;
  var THEME_STORAGE_KEY = "portfolio-theme";

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  setupEmailButton();
  setupThemeToggle();
  setupNavHighlight();
  setupProjectSearch();
  setupFactorialCalculator();
  setupWeather();
  setupAssistant();

  function setupEmailButton() {
    var emailButton = document.getElementById("email-button");
    if (!emailButton) {
      return;
    }

    var email = String(CONTACT_EMAIL || "").trim();
    if (!email) {
      emailButton.hidden = true;
      emailButton.removeAttribute("href");
      return;
    }

    emailButton.hidden = false;
    emailButton.href = "mailto:" + email;
    emailButton.textContent = "Email";
  }

  function setupThemeToggle() {
    var themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) {
      return;
    }

    var labelDark = "Switch to Dark Mode";
    var labelLight = "Switch to Light Mode";

    function isDark() {
      return (
        document.body.classList.contains("dark-mode") ||
        document.documentElement.classList.contains("theme-dark")
      );
    }

    function applyTheme(dark) {
      document.body.classList.toggle("dark-mode", dark);
      document.documentElement.classList.toggle("theme-dark", dark);
      themeToggle.textContent = dark ? labelLight : labelDark;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
      } catch (error) {
        /* ignore storage errors */
      }
    }

    var stored = "";
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY) || "";
    } catch (error) {
      stored = "";
    }

    if (stored === "dark" || (stored !== "light" && isDark())) {
      applyTheme(true);
    } else {
      applyTheme(false);
    }

    themeToggle.addEventListener("click", function () {
      applyTheme(!isDark());
    });
  }

  function setupNavHighlight() {
    var sections = [
      { id: "about", link: document.querySelector('.site-nav a[href="#about"]') },
      { id: "skills", link: document.querySelector('.site-nav a[href="#skills"]') },
      { id: "projects", link: document.querySelector('.site-nav a[href="#projects"]') },
      { id: "weather-ai", link: document.querySelector('.site-nav a[href="#weather-ai"]') },
    ].filter(function (entry) {
      return entry.link && document.getElementById(entry.id);
    });

    if (sections.length === 0) {
      return;
    }

    document.body.classList.add("nav-highlight");

    function setActiveSection(sectionId) {
      sections.forEach(function (entry) {
        if (entry.id === sectionId) {
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
  }

  function setupProjectSearch() {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".project-card"));
    var pageInput = document.getElementById("project-search");
    var openButton = document.getElementById("open-project-search");
    var showAllButton = document.getElementById("show-all-projects");
    var emptyEl = document.getElementById("project-empty");
    var statusEl = document.getElementById("project-filter-status");
    var dialog = document.getElementById("project-search-dialog");
    var dialogInput = document.getElementById("dialog-search-input");
    var dialogResults = document.getElementById("dialog-search-results");
    var dialogEmpty = document.getElementById("dialog-empty");
    var dialogShowAll = document.getElementById("dialog-show-all");
    var closeDialogButton = document.getElementById("close-search-dialog");
    var lastFocus = null;
    var activeIndex = 0;

    function cardText(card) {
      return [
        card.getAttribute("data-title") || "",
        card.getAttribute("data-description") || "",
        card.getAttribute("data-tags") || "",
      ]
        .join(" ")
        .toLowerCase();
    }

    function matches(card, query) {
      var q = query.trim().toLowerCase();
      if (!q) {
        return true;
      }
      return cardText(card).indexOf(q) !== -1;
    }

    function applyFilter(query) {
      var visible = 0;
      cards.forEach(function (card) {
        var show = matches(card, query);
        card.classList.toggle("is-hidden", !show);
        if (show) {
          visible += 1;
        }
      });

      if (emptyEl) {
        emptyEl.hidden = visible !== 0;
      }

      if (statusEl) {
        if (!query.trim()) {
          statusEl.hidden = true;
          statusEl.textContent = "";
        } else {
          statusEl.hidden = false;
          statusEl.textContent =
            visible === 1
              ? "Showing 1 matching project."
              : "Showing " + visible + " matching projects.";
        }
      }

      return visible;
    }

    function clearFilter() {
      if (pageInput) {
        pageInput.value = "";
      }
      applyFilter("");
    }

    function isTypingTarget(el) {
      if (!el || !el.tagName) {
        return false;
      }
      var tag = el.tagName.toLowerCase();
      return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        el.isContentEditable
      );
    }

    function getDialogButtons() {
      return Array.prototype.slice.call(
        dialogResults.querySelectorAll("button[data-project-index]")
      );
    }

    function setActiveResult(index) {
      var buttons = getDialogButtons();
      if (buttons.length === 0) {
        activeIndex = 0;
        return;
      }
      activeIndex = (index + buttons.length) % buttons.length;
      buttons.forEach(function (button, i) {
        button.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
      });
      buttons[activeIndex].scrollIntoView({ block: "nearest" });
    }

    function renderDialogResults(query) {
      if (!dialogResults) {
        return;
      }
      dialogResults.innerHTML = "";
      var matched = cards.filter(function (card) {
        return matches(card, query);
      });

      if (dialogEmpty) {
        dialogEmpty.hidden = matched.length !== 0;
      }

      matched.forEach(function (card) {
        var item = document.createElement("li");
        var button = document.createElement("button");
        var title = document.createElement("span");
        var meta = document.createElement("span");
        button.type = "button";
        button.setAttribute("data-project-index", String(cards.indexOf(card)));
        title.className = "result-title";
        title.textContent = card.getAttribute("data-title") || "Project";
        meta.className = "result-meta";
        meta.textContent = card.getAttribute("data-tags") || "";
        button.appendChild(title);
        button.appendChild(meta);
        item.appendChild(button);
        dialogResults.appendChild(item);
      });

      setActiveResult(0);
    }

    function openDialog() {
      if (!dialog) {
        return;
      }
      lastFocus = document.activeElement;
      dialog.hidden = false;
      document.body.classList.add("search-open");
      renderDialogResults(dialogInput ? dialogInput.value : "");
      if (dialogInput) {
        dialogInput.focus();
        dialogInput.select();
      }
    }

    function closeDialog() {
      if (!dialog || dialog.hidden) {
        return;
      }
      dialog.hidden = true;
      document.body.classList.remove("search-open");
      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
    }

    function revealProject(card) {
      closeDialog();
      clearFilter();
      cards.forEach(function (item) {
        item.classList.remove("is-highlight");
      });
      card.classList.add("is-highlight");
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      window.setTimeout(function () {
        card.classList.remove("is-highlight");
      }, 1800);
    }

    if (pageInput) {
      pageInput.addEventListener("input", function () {
        applyFilter(pageInput.value);
      });
    }

    if (openButton) {
      openButton.addEventListener("click", openDialog);
    }

    if (showAllButton) {
      showAllButton.addEventListener("click", clearFilter);
    }

    if (dialogShowAll) {
      dialogShowAll.addEventListener("click", function () {
        if (dialogInput) {
          dialogInput.value = "";
        }
        clearFilter();
        closeDialog();
        var projects = document.getElementById("projects");
        if (projects) {
          projects.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    if (closeDialogButton) {
      closeDialogButton.addEventListener("click", closeDialog);
    }

    if (dialog) {
      dialog.addEventListener("click", function (event) {
        if (event.target && event.target.getAttribute("data-close-search") === "true") {
          closeDialog();
        }
      });

      dialog.addEventListener("click", function (event) {
        var button = event.target.closest("button[data-project-index]");
        if (!button) {
          return;
        }
        var index = Number(button.getAttribute("data-project-index"));
        if (cards[index]) {
          revealProject(cards[index]);
        }
      });
    }

    if (dialogInput) {
      dialogInput.addEventListener("input", function () {
        renderDialogResults(dialogInput.value);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        if (dialog && !dialog.hidden) {
          return;
        }
        if (isTypingTarget(event.target)) {
          return;
        }
        event.preventDefault();
        openDialog();
        return;
      }

      if (!dialog || dialog.hidden) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveResult(activeIndex + 1);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveResult(activeIndex - 1);
        return;
      }

      if (event.key === "Enter") {
        var buttons = getDialogButtons();
        if (buttons[activeIndex]) {
          event.preventDefault();
          buttons[activeIndex].click();
        }
      }
    });
  }

  function setupFactorialCalculator() {
    var form = document.getElementById("factorial-form");
    var input = document.getElementById("factorial-input");
    var statusEl = document.getElementById("factorial-status");
    if (!form || !input || !statusEl) {
      return;
    }

    function factorial(n) {
      var result = 1n;
      var i;
      for (i = 2n; i <= n; i++) {
        result *= i;
      }
      return result;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var raw = input.value.trim();
      statusEl.classList.remove("is-error");
      statusEl.textContent = "";

      if (!raw) {
        statusEl.classList.add("is-error");
        statusEl.textContent = "Enter a non-negative whole number.";
        return;
      }

      if (!/^\d+$/.test(raw)) {
        statusEl.classList.add("is-error");
        statusEl.textContent =
          "Only non-negative whole numbers are allowed. Decimals, signs, and letters are invalid.";
        return;
      }

      var n = Number(raw);
      if (n > FACTORIAL_MAX) {
        statusEl.classList.add("is-error");
        statusEl.textContent =
          "Please enter a number from 0 to " + FACTORIAL_MAX + " so the browser stays responsive.";
        return;
      }

      var value = factorial(BigInt(n));
      statusEl.textContent = "";
      var intro = document.createElement("p");
      intro.className = "factorial-intro";
      intro.textContent = raw + "! =";
      var result = document.createElement("p");
      result.className = "factorial-result";
      result.textContent = value.toString();
      statusEl.appendChild(intro);
      statusEl.appendChild(result);
    });
  }

  function weatherDescription(code) {
    var map = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Light freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    return map[code] || "Weather code " + code;
  }

  function setupWeather() {
    var form = document.getElementById("weather-form");
    var input = document.getElementById("weather-city");
    var result = document.getElementById("weather-result");
    if (!form || !input || !result) {
      return;
    }

    function setMessage(text, isError) {
      result.classList.toggle("is-error", Boolean(isError));
      result.innerHTML = "";
      var p = document.createElement("p");
      p.textContent = text;
      result.appendChild(p);
    }

    function renderWeather(place, current) {
      result.classList.remove("is-error");
      result.innerHTML = "";
      var heading = document.createElement("p");
      heading.innerHTML = "";
      var strong = document.createElement("strong");
      var placeName = place.name;
      if (place.admin1) {
        placeName += ", " + place.admin1;
      }
      if (place.country) {
        placeName += ", " + place.country;
      }
      strong.textContent = placeName;
      heading.appendChild(strong);
      result.appendChild(heading);

      var list = document.createElement("dl");
      function addRow(label, value) {
        if (value === null || value === undefined || value === "") {
          return;
        }
        var dt = document.createElement("dt");
        var dd = document.createElement("dd");
        dt.textContent = label;
        dd.textContent = value;
        list.appendChild(dt);
        list.appendChild(dd);
      }

      if (current && typeof current.temperature_2m === "number") {
        addRow("Temperature", current.temperature_2m + " °C");
      }
      if (current && typeof current.weather_code === "number") {
        addRow("Conditions", weatherDescription(current.weather_code));
      }
      if (current && typeof current.relative_humidity_2m === "number") {
        addRow("Humidity", current.relative_humidity_2m + "%");
      }
      if (current && typeof current.wind_speed_10m === "number") {
        addRow("Wind speed", current.wind_speed_10m + " km/h");
      }

      if (!list.children.length) {
        addRow("Details", "Current readings were not included in the forecast response.");
      }

      result.appendChild(list);
    }

    var weatherRequestId = 0;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var city = input.value.trim();
      if (!city) {
        setMessage("Enter a city name first.", true);
        return;
      }

      var requestId = (weatherRequestId += 1);
      setMessage("Looking up weather…");

      var geoUrl =
        "https://geocoding-api.open-meteo.com/v1/search?name=" +
        encodeURIComponent(city) +
        "&count=1&language=en&format=json";

      fetch(geoUrl)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("network");
          }
          return response.json();
        })
        .then(function (geo) {
          if (requestId !== weatherRequestId) {
            return null;
          }
          if (!geo || !geo.results || !geo.results.length) {
            setMessage("That city was not found. Try a different spelling or a nearby city.", true);
            return null;
          }

          var place = geo.results[0];
          var forecastUrl =
            "https://api.open-meteo.com/v1/forecast?latitude=" +
            encodeURIComponent(place.latitude) +
            "&longitude=" +
            encodeURIComponent(place.longitude) +
            "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto";

          return fetch(forecastUrl).then(function (response) {
            if (!response.ok) {
              throw new Error("network");
            }
            return response.json().then(function (forecast) {
              if (requestId !== weatherRequestId) {
                return;
              }
              renderWeather(place, forecast.current || {});
            });
          });
        })
        .catch(function () {
          if (requestId !== weatherRequestId) {
            return;
          }
          setMessage(
            "Weather could not be loaded. Check your connection and try again.",
            true
          );
        });
    });
  }

  function setupAssistant() {
    var form = document.getElementById("assistant-form");
    var input = document.getElementById("assistant-question");
    var output = document.getElementById("assistant-output");
    var chips = document.querySelectorAll(".chip[data-question]");
    if (!form || !input || !output) {
      return;
    }

    var responses = [
      {
        keys: ["skill", "python", "html", "css", "javascript", "git", "github", "cursor", "vercel", "prompt", "leadership", "team"],
        answer:
          "I am a second-year B.Tech student building skills rather than claiming expertise. I am learning Python and JavaScript; building with HTML, CSS, Git, GitHub, and project work; studying AI and Data Science fundamentals; and exploring prompt engineering, Cursor, and Vercel. I also practice problem solving, leadership, and teamwork.",
      },
      {
        keys: ["reading list", "book"],
        answer:
          "The Reading List App is a live web project. You can add books, change reading status, filter the list, prevent duplicate titles, keep titles to 60 characters, delete books, and see summary counts. Live demo: https://reading-list-app-inky.vercel.app — GitHub: https://github.com/devshreepareek831-blip/reading-list-app",
      },
      {
        keys: ["quiz"],
        answer:
          "Code With AI Quiz is a five-question interactive quiz built with HTML, CSS, and JavaScript, including score calculation. It still needs a separate deployment, so there is no public demo URL on this page.",
      },
      {
        keys: ["factorial"],
        answer:
          "The Factorial Calculator is an in-page demo on this site. It accepts non-negative whole numbers from 0 to 2000, rejects invalid input, and uses BigInt for exact integer results.",
      },
      {
        keys: ["unibus", "bus", "campus", "transport"],
        answer:
          "Unibus is a campus mobility concept focused on helping students access bus routes, stops, and transport information. It is presented as a concept, not as a live product link.",
      },
      {
        keys: ["ecovolt", "sustain", "waste", "environment"],
        answer:
          "EcoVolt AI is a sustainability-focused prototype exploring organic waste, microbial fuel-cell concepts, and AI-assisted environmental awareness. Treat it as a concept/prototype rather than a finished product.",
      },
      {
        keys: ["agentic", "auditor"],
        answer:
          "Agentic Auditor is an agentic AI concept about task-oriented agents reviewing information and producing structured findings. It is exploratory work, not a production auditor.",
      },
      {
        keys: ["sehekar", "seva", "service", "worker", "booking"],
        answer:
          "Sehekar Seva is a cooperative services platform concept for connecting local service requests with skilled workers, including booking and matching workflows.",
      },
      {
        keys: ["smart home", "automation", "iot"],
        answer:
          "Smart Home Automation is a concept project about connected devices and convenient control of household functions. Brainwave Eye Blynk is a related exploratory IoT/assistive project using Blynk-based interaction around brainwave or eye-blink input ideas.",
      },
      {
        keys: ["brainwave", "blynk", "blink", "eye"],
        answer:
          "Brainwave Eye Blynk is an assistive/IoT exploration of brainwave or eye-blink input with Blynk-based interaction. The description stays general and does not claim specific hardware results.",
      },
      {
        keys: ["project", "portfolio", "website", "built"],
        answer:
          "This personal portfolio is built with HTML, CSS, and JavaScript. Other work includes concept projects such as Smart Home Automation, Unibus, EcoVolt AI, Agentic Auditor, and Sehekar Seva, plus the live Reading List App, a quiz that still needs deployment, and the in-page factorial calculator.",
      },
      {
        keys: ["weather", "open-meteo"],
        answer:
          "The Weather section looks up a city with Open-Meteo’s public geocoding and forecast APIs. It shows matched location, temperature, conditions, humidity, and wind when those fields are returned. It does not use hardcoded live readings.",
      },
      {
        keys: ["contact", "email", "github", "reach"],
        answer:
          "You can find my GitHub at https://github.com/devshreepareek831-blip. A public email is not listed on this site yet.",
      },
      {
        keys: ["about", "who", "study", "jecrc", "education", "student", "ai", "data"],
        answer:
          "I'm Devshree Pareek, a second-year B.Tech student specializing in Artificial Intelligence and Data Science at JECRC University. I enjoy turning ideas into practical projects and learning through building.",
      },
      {
        keys: ["assistant", "ai model", "chatgpt", "demo"],
        answer:
          "This assistant is a local demo. It matches keywords to prepared answers on this page. It is not a connected AI model and does not browse the web.",
      },
    ];

    function replyFor(question) {
      var q = question.toLowerCase();
      var i;
      for (i = 0; i < responses.length; i++) {
        if (
          responses[i].keys.some(function (key) {
            return q.indexOf(key) !== -1;
          })
        ) {
          return responses[i].answer;
        }
      }
      return "I can help with questions about Devshree’s studies, skills, projects, GitHub, weather demo, or this local assistant. Try asking about the Reading List App, Unibus, or skills currently being learned.";
    }

    function showReply(text, isError) {
      output.classList.toggle("is-error", Boolean(isError));
      output.innerHTML = "";
      var p = document.createElement("p");
      p.textContent = text;
      output.appendChild(p);
    }

    function submitQuestion(question) {
      var trimmed = String(question || "").trim();
      if (!trimmed) {
        showReply("Please type a question before sending.", true);
        return;
      }
      input.value = trimmed;
      showReply(replyFor(trimmed), false);
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitQuestion(input.value);
    });

    Array.prototype.forEach.call(chips, function (chip) {
      chip.addEventListener("click", function () {
        submitQuestion(chip.getAttribute("data-question") || "");
      });
    });
  }
})();
