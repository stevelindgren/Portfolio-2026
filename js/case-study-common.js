(function () {
  "use strict";

  function getActiveButton(group) {
    if (!group) {
      return null;
    }

    return group.querySelector("button.is-active") || group.querySelector("button");
  }

  function addMediaQueryListener(mediaQuery, callback) {
    if (!mediaQuery || typeof callback !== "function") {
      return;
    }

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", callback);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(callback);
    }
  }

  function initSidebarNavigation(options) {
    const settings = Object.assign(
      {
        sidebarSelector: ".case-scroll-sidebar",
        headerSelector: "#header",
        revealOffset: 4,
        activeOffset: 160,
        pageBottomThreshold: 8,
      },
      options || {},
    );

    const sidebar = document.querySelector(settings.sidebarSelector);
    const sidebarLinks = Array.from(
      document.querySelectorAll(`${settings.sidebarSelector} a`),
    );
    const trackedSections = sidebarLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (!sidebar || !sidebarLinks.length || !trackedSections.length) {
      return null;
    }

    function updateSidebar() {
      const overviewSection = trackedSections[0];
      const header = document.querySelector(settings.headerSelector);
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const revealThreshold = Math.max(0, headerHeight + settings.revealOffset);
      const shouldShow =
        overviewSection.getBoundingClientRect().top <= revealThreshold;

      sidebar.classList.toggle("is-visible", shouldShow);

      if (!shouldShow) {
        return;
      }

      let active = trackedSections[0];

      trackedSections.forEach((section) => {
        if (section.getBoundingClientRect().top <= settings.activeOffset) {
          active = section;
        }
      });

      const scrollBottom = window.scrollY + window.innerHeight;
      const pageBottom = document.documentElement.scrollHeight;
      if (pageBottom - scrollBottom <= settings.pageBottomThreshold) {
        active = trackedSections[trackedSections.length - 1];
      }

      sidebarLinks.forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${active.id}`,
        );
      });
    }

    updateSidebar();
    window.addEventListener("scroll", updateSidebar, { passive: true });
    window.addEventListener("resize", updateSidebar);

    return {
      sidebar,
      sidebarLinks,
      trackedSections,
      updateSidebar,
    };
  }

  function scrollTargetIntoView(target, options) {
    if (!target) {
      return;
    }

    const settings = Object.assign(
      {
        headerSelector: "#header",
        extraOffset: 24,
      },
      options || {},
    );

    const header = document.querySelector(settings.headerSelector);
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const top =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      settings.extraOffset;

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth",
      });
    });
  }

  function updateBinaryToggleIndicator(group, activeButton, options) {
    if (!group || !group.classList.contains("cs-toggle") || !activeButton) {
      return;
    }

    const settings = Object.assign(
      {
        setX: false,
        setWidth: false,
        setCenter: true,
      },
      options || {},
    );
    const toggleButtons = Array.from(group.querySelectorAll("button"));
    const activeIndex = toggleButtons.indexOf(activeButton);

    group.classList.toggle("is-right-active", activeIndex === 1);

    const groupRect = group.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    if (settings.setX) {
      group.style.setProperty("--toggle-x", `${buttonRect.left - groupRect.left}px`);
    }

    if (settings.setWidth) {
      group.style.setProperty("--toggle-w", `${buttonRect.width}px`);
    }

    if (settings.setCenter && toggleButtons.length >= 2) {
      const leftRect = toggleButtons[0].getBoundingClientRect();
      const rightRect = toggleButtons[1].getBoundingClientRect();
      const toggleCenter = (leftRect.right + rightRect.left) / 2 - groupRect.left;
      group.style.setProperty("--toggle-center", `${toggleCenter}px`);
    }
  }

  function bindBinaryToggleSurfaceClick(group, buttons) {
    if (
      !group ||
      !group.classList.contains("cs-toggle") ||
      !buttons ||
      buttons.length < 2
    ) {
      return;
    }

    group.addEventListener("click", (event) => {
      if (event.target.closest("button")) {
        return;
      }

      const groupRect = group.getBoundingClientRect();
      const targetIndex =
        event.clientX >= groupRect.left + groupRect.width / 2 ? 1 : 0;
      const targetButton = buttons[targetIndex] || buttons[0];

      if (targetButton && !targetButton.classList.contains("is-active")) {
        targetButton.click();
      }
    });
  }

  function initBinaryButtonGroups(selector, options) {
    const settings = Object.assign(
      {
        bindSurfaceClick: true,
        getScrollTarget: null,
        indicatorOptions: null,
        onActivate: null,
        updateIndicator: null,
      },
      options || {},
    );
    const groups = Array.from(document.querySelectorAll(selector));

    groups.forEach((group) => {
      const buttons = Array.from(group.querySelectorAll("button"));
      if (!buttons.length) {
        return;
      }

      const maybeUpdateIndicator = (button) => {
        if (!group.classList.contains("cs-toggle") || !button) {
          return;
        }

        if (typeof settings.updateIndicator === "function") {
          settings.updateIndicator(group, button, buttons);
          return;
        }

        updateBinaryToggleIndicator(group, button, settings.indicatorOptions);
      };

      const activateButton = (button, shouldScroll) => {
        if (!button) {
          return;
        }

        buttons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");

        if (typeof settings.onActivate === "function") {
          settings.onActivate(button, group, buttons);
        }

        maybeUpdateIndicator(button);

        if (shouldScroll && typeof settings.getScrollTarget === "function") {
          scrollTargetIntoView(settings.getScrollTarget(group, button, buttons));
        }
      };

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          activateButton(button, true);
        });

        button.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") {
            return;
          }

          event.preventDefault();
          button.click();
        });
      });

      if (settings.bindSurfaceClick) {
        bindBinaryToggleSurfaceClick(group, buttons);
      }

      activateButton(getActiveButton(group) || buttons[0], false);
    });

    return groups;
  }

  function initComparisonScrollHint(options) {
    const settings = Object.assign(
      {
        mediaQuery: null,
        viewportSelector: "#comparison .cs-image-scroll-window",
        sessionKey: "comparison-scroll-hint-seen",
        startDelay: 420,
        resetDelay: 640,
        startTop: 30,
      },
      options || {},
    );

    if (settings.mediaQuery && !settings.mediaQuery.matches) {
      return;
    }

    const viewport = document.querySelector(settings.viewportSelector);
    if (!viewport || viewport.scrollHeight <= viewport.clientHeight + 4) {
      return;
    }

    try {
      if (sessionStorage.getItem(settings.sessionKey) === "1") {
        return;
      }

      sessionStorage.setItem(settings.sessionKey, "1");
    } catch (error) {
      return;
    }

    window.setTimeout(() => {
      viewport.scrollTo({ top: settings.startTop, behavior: "smooth" });
      window.setTimeout(() => {
        viewport.scrollTo({ top: 0, behavior: "smooth" });
      }, settings.resetDelay);
    }, settings.startDelay);
  }

  function initMobileShowcaseAutoScroll(options) {
    const settings = Object.assign(
      {
        sectionSelector: "#mobile",
        screenSelector: "#mobile .case-device-screen",
        threshold: 0.45,
        interactionCooldownMs: 4200,
        downPath: [
          { ratio: 0.2, duration: 640, pause: 150 },
          { ratio: 0.42, duration: 720, pause: 190 },
          { ratio: 0.66, duration: 810, pause: 240 },
          { ratio: 0.86, duration: 860, pause: 280 },
          { ratio: 1, duration: 920, pause: 620 },
        ],
        upPath: [
          { ratio: 0.74, duration: 720, pause: 200 },
          { ratio: 0.44, duration: 700, pause: 180 },
          { ratio: 0, duration: 780, pause: 360 },
        ],
        referenceScrollDistances: null,
      },
      options || {},
    );

    const mobileSection = document.querySelector(settings.sectionSelector);
    const phoneScreens = Array.from(document.querySelectorAll(settings.screenSelector));

    if (!mobileSection || !phoneScreens.length) {
      return null;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return null;
    }

    let lastUserInteractionTs = 0;
    let isSectionVisible = false;
    let runToken = 0;
    let loopRunning = false;

    const now = () => performance.now();

    const markUserInteraction = () => {
      lastUserInteractionTs = now();
    };

    phoneScreens.forEach((screen) => {
      screen.addEventListener("wheel", markUserInteraction, {
        passive: true,
      });
      screen.addEventListener("touchstart", markUserInteraction, {
        passive: true,
      });
      screen.addEventListener("touchmove", markUserInteraction, {
        passive: true,
      });
      screen.addEventListener("pointerdown", markUserInteraction, {
        passive: true,
      });
      screen.addEventListener("keydown", markUserInteraction);
    });

    function wait(ms, token) {
      return new Promise((resolve) => {
        const startedAt = now();

        const tick = () => {
          if (token !== runToken || !isSectionVisible) {
            resolve(false);
            return;
          }

          if (now() - startedAt >= ms) {
            resolve(true);
            return;
          }

          requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      });
    }

    function easeInOutSine(t) {
      return 0.5 - Math.cos(Math.PI * t) / 2;
    }

    function hasRecentUserInteraction() {
      return now() - lastUserInteractionTs < 120;
    }

    function animateScrollTo(screen, targetScrollTop, duration, token) {
      return new Promise((resolve) => {
        const startTop = screen.scrollTop;
        const delta = targetScrollTop - startTop;

        if (Math.abs(delta) < 1) {
          resolve(true);
          return;
        }

        const startedAt = now();
        const step = () => {
          if (token !== runToken || !isSectionVisible) {
            resolve(false);
            return;
          }

          if (hasRecentUserInteraction()) {
            resolve(false);
            return;
          }

          const elapsed = now() - startedAt;
          const progress = Math.min(1, elapsed / duration);
          const eased = easeInOutSine(progress);
          screen.scrollTop = startTop + delta * eased;

          if (progress < 1) {
            requestAnimationFrame(step);
            return;
          }

          resolve(true);
        };

        requestAnimationFrame(step);
      });
    }

    function getScreenDurationScale(screenIndex, maxScroll) {
      const referenceDistances = settings.referenceScrollDistances;
      if (!Array.isArray(referenceDistances)) {
        return 1;
      }

      const referenceDistance = Number(referenceDistances[screenIndex]);
      if (!Number.isFinite(referenceDistance) || referenceDistance <= 0) {
        return 1;
      }

      return Math.max(maxScroll / referenceDistance, 1);
    }

    async function runSwipeSequence(screen, token, screenIndex) {
      const maxScroll = Math.max(0, screen.scrollHeight - screen.clientHeight);
      if (maxScroll <= 6) {
        return true;
      }
      const durationScale = getScreenDurationScale(screenIndex, maxScroll);

      for (const step of settings.downPath) {
        const ok = await animateScrollTo(
          screen,
          maxScroll * step.ratio,
          step.duration * durationScale,
          token,
        );
        if (!ok) {
          return false;
        }
        if (!(await wait(step.pause, token))) {
          return false;
        }
      }

      for (const step of settings.upPath) {
        const ok = await animateScrollTo(
          screen,
          maxScroll * step.ratio,
          step.duration * durationScale,
          token,
        );
        if (!ok) {
          return false;
        }
        if (!(await wait(step.pause, token))) {
          return false;
        }
      }

      return true;
    }

    async function waitForInteractionCooldown(token) {
      while (token === runToken && isSectionVisible) {
        const elapsed = now() - lastUserInteractionTs;
        if (elapsed >= settings.interactionCooldownMs) {
          return true;
        }

        const remaining = settings.interactionCooldownMs - elapsed;
        if (!(await wait(Math.min(remaining, 500), token))) {
          return false;
        }
      }

      return false;
    }

    async function runLoop(token) {
      phoneScreens.forEach((screen) => {
        screen.scrollTop = 0;
      });

      while (token === runToken && isSectionVisible) {
        if (!(await waitForInteractionCooldown(token))) {
          return;
        }

        for (const [screenIndex, screen] of phoneScreens.entries()) {
          if (token !== runToken || !isSectionVisible) {
            return;
          }

          const ok = await runSwipeSequence(screen, token, screenIndex);
          if (!ok) {
            break;
          }
        }
      }
    }

    function startLoop() {
      if (loopRunning) {
        return;
      }

      loopRunning = true;
      runToken += 1;
      const token = runToken;

      runLoop(token).finally(() => {
        if (token === runToken) {
          loopRunning = false;
        }
      });
    }

    function stopLoop() {
      runToken += 1;
      loopRunning = false;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isSectionVisible = Boolean(entry && entry.isIntersecting);
        if (isSectionVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: settings.threshold },
    );

    observer.observe(mobileSection);

    return {
      observer,
      startLoop,
      stopLoop,
    };
  }

  window.PortfolioCaseStudy = {
    addMediaQueryListener,
    bindBinaryToggleSurfaceClick,
    getActiveButton,
    initBinaryButtonGroups,
    initComparisonScrollHint,
    initMobileShowcaseAutoScroll,
    initSidebarNavigation,
    scrollTargetIntoView,
    updateBinaryToggleIndicator,
  };
})();
