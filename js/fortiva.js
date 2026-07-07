(function () {
  "use strict";

  const CaseStudy = window.PortfolioCaseStudy;
  if (!CaseStudy) {
    return;
  }

  CaseStudy.initSidebarNavigation();

  const desktopCalloutMediaQuery = window.matchMedia("(min-width: 981px)");

  function applyImageScroll(card) {
    const image = card.querySelector(".cs-image-scroll-window img");
    const windowFrame = card.querySelector(".cs-image-scroll-window");
    if (!image || !windowFrame) {
      return;
    }

    const ratioValue = Number.parseFloat(card.dataset.activeImageScroll || "0");
    const scrollRatio = Number.isFinite(ratioValue)
      ? Math.min(1, Math.max(0, ratioValue))
      : 0;
    const maxOffset = Math.max(
      0,
      windowFrame.scrollHeight - windowFrame.clientHeight,
    );
    windowFrame.scrollTop = maxOffset * scrollRatio;
  }

  function applyTabCardState(button, group) {
    const targetSelector = group.dataset.calloutTarget;
    if (!targetSelector) {
      return;
    }

    const card = document.querySelector(targetSelector);
    if (!card) {
      return;
    }

    const calloutBoxSelector = group.dataset.calloutBox;
    const callout = calloutBoxSelector
      ? document.querySelector(calloutBoxSelector)
      : card.querySelector(".cs-callout");
    const usesExternalCallout = Boolean(calloutBoxSelector);
    const hotspot = card.querySelector(".cs-hotspot");
    const image = card.querySelector(".cs-image-scroll-window img");
    const pulseGap = 32;

    if (callout && button.dataset.callout) {
      callout.textContent = button.dataset.callout;
    }

    if (callout && !usesExternalCallout && button.dataset.calloutLeft) {
      callout.style.left = button.dataset.calloutLeft;
    }

    if (callout && !usesExternalCallout) {
      const calloutAlign = button.dataset.calloutAlign || "left";
      if (!desktopCalloutMediaQuery.matches) {
        callout.style.transform = "none";
      } else if (calloutAlign === "right") {
        callout.style.transform = "translateX(-100%)";
      } else if (calloutAlign === "center") {
        callout.style.transform = "translateX(-50%)";
      } else {
        callout.style.transform = "none";
      }
    }

    const hotspotLeft =
      !desktopCalloutMediaQuery.matches && button.dataset.mobileHotspotLeft
        ? button.dataset.mobileHotspotLeft
        : button.dataset.hotspotLeft;
    const hotspotTop =
      !desktopCalloutMediaQuery.matches && button.dataset.mobileHotspotTop
        ? button.dataset.mobileHotspotTop
        : button.dataset.hotspotTop;

    card.classList.toggle(
      "is-mobile-hotspot-visible",
      !desktopCalloutMediaQuery.matches && Boolean(button.dataset.mobileHotspotTop),
    );

    if (hotspot && hotspotLeft) {
      hotspot.style.left = hotspotLeft;
    }

    if (hotspot && hotspotTop) {
      hotspot.style.top = hotspotTop;
    }

    if (
      desktopCalloutMediaQuery.matches &&
      callout &&
      !usesExternalCallout &&
      hotspot &&
      hotspotTop
    ) {
      const hotspotTopToken = hotspotTop.trim();
      let hotspotTopPx = 0;

      if (hotspotTopToken.endsWith("%")) {
        const ratio = Number.parseFloat(hotspotTopToken) / 100;
        hotspotTopPx = card.clientHeight * ratio;
      } else {
        hotspotTopPx = Number.parseFloat(hotspotTopToken);
      }

      const calloutTopToken = (button.dataset.calloutTop || "").trim();
      let isBelowPulse = false;
      if (calloutTopToken.endsWith("%")) {
        const ratio = Number.parseFloat(calloutTopToken) / 100;
        isBelowPulse = ratio > hotspotTopPx / Math.max(card.clientHeight, 1);
      } else if (calloutTopToken) {
        isBelowPulse = Number.parseFloat(calloutTopToken) > hotspotTopPx;
      }

      const calloutHeight = callout.offsetHeight;
      let computedTop = isBelowPulse
        ? hotspotTopPx + pulseGap
        : hotspotTopPx - calloutHeight - pulseGap;

      computedTop = Math.max(
        8,
        Math.min(card.clientHeight - calloutHeight - 8, computedTop),
      );
      callout.style.top = `${computedTop}px`;
    } else if (callout && !usesExternalCallout && button.dataset.calloutTop) {
      callout.style.top = button.dataset.calloutTop;
    }

    const imageSrc =
      !desktopCalloutMediaQuery.matches && button.dataset.mobileImageSrc
        ? button.dataset.mobileImageSrc
        : button.dataset.imageSrc;
    const imageAlt =
      !desktopCalloutMediaQuery.matches && button.dataset.mobileImageAlt
        ? button.dataset.mobileImageAlt
        : button.dataset.imageAlt;

    if (image && imageSrc) {
      image.src = imageSrc;
    }

    if (image && imageAlt) {
      image.alt = imageAlt;
    }

    const imageScroll =
      !desktopCalloutMediaQuery.matches && button.dataset.mobileImageScroll
        ? button.dataset.mobileImageScroll
        : button.dataset.imageScroll;

    if (imageScroll) {
      card.dataset.activeImageScroll = imageScroll;
    } else {
      card.dataset.activeImageScroll = "0";
    }

    if (image && !image.complete) {
      image.addEventListener("load", () => applyImageScroll(card), {
        once: true,
      });
    }
    applyImageScroll(card);
  }

  function applyComparisonState(button, group) {
    const targetSelector = group.dataset.compareTarget;
    if (!targetSelector) {
      return;
    }

    const image = document.querySelector(targetSelector);
    const scrollWindow = image ? image.closest(".cs-image-scroll-window") : null;
    const currentSrc = image ? image.getAttribute("src") : null;

    if (!image) {
      return;
    }

    const isMobileViewport = !desktopCalloutMediaQuery.matches;
    const nextSrc = isMobileViewport
      ? button.dataset.compareMobileSrc || button.dataset.compareSrc
      : button.dataset.compareSrc;
    const nextAlt = isMobileViewport
      ? button.dataset.compareMobileAlt || button.dataset.compareAlt
      : button.dataset.compareAlt;

    if (nextSrc && nextSrc !== currentSrc) {
      const swapToken = String(Date.now());
      image.dataset.swapToken = swapToken;
      image.classList.add("is-swapping");

      window.setTimeout(() => {
        if (image.dataset.swapToken !== swapToken) {
          return;
        }

        image.src = nextSrc;
        if (nextAlt) {
          image.alt = nextAlt;
        }

        const finishSwap = () => {
          if (image.dataset.swapToken !== swapToken) {
            return;
          }

          requestAnimationFrame(() => image.classList.remove("is-swapping"));
        };

        if (image.complete) {
          finishSwap();
        } else {
          image.addEventListener("load", finishSwap, { once: true });
        }
      }, 120);
    } else if (nextAlt) {
      image.alt = nextAlt;
    }

    if (scrollWindow) {
      scrollWindow.scrollTop = 0;
    }
  }

  function getInteractiveScrollTarget(group) {
    if (!group || !group.dataset.calloutTarget) {
      return null;
    }

    return document.querySelector(group.dataset.calloutTarget);
  }

  function syncResponsiveInteractiveState() {
    document.querySelectorAll(".cs-tabs, .cs-toggle").forEach((group) => {
      const activeButton = CaseStudy.getActiveButton(group);
      if (!activeButton) {
        return;
      }

      applyTabCardState(activeButton, group);
      applyComparisonState(activeButton, group);
      CaseStudy.updateBinaryToggleIndicator(group, activeButton, {
        setX: true,
        setWidth: true,
        setCenter: true,
      });
    });
  }

  function refreshActiveCardImageScroll() {
    document
      .querySelectorAll(".cs-tabs[data-callout-target]")
      .forEach((group) => {
        const targetSelector = group.dataset.calloutTarget;
        const card = targetSelector ? document.querySelector(targetSelector) : null;
        const activeButton = group.querySelector("button.is-active");
        if (activeButton) {
          applyTabCardState(activeButton, group);
        }
        if (card) {
          applyImageScroll(card);
        }
      });

    document.querySelectorAll(".cs-toggle").forEach((group) => {
      const activeButton = group.querySelector("button.is-active");
      if (activeButton) {
        applyComparisonState(activeButton, group);
      }
      CaseStudy.updateBinaryToggleIndicator(group, activeButton, {
        setX: true,
        setWidth: true,
        setCenter: true,
      });
    });
  }

  CaseStudy.initBinaryButtonGroups(".cs-tabs, .cs-toggle", {
    getScrollTarget(group) {
      return getInteractiveScrollTarget(group);
    },
    indicatorOptions: {
      setX: true,
      setWidth: true,
      setCenter: true,
    },
    onActivate(button, group) {
      applyTabCardState(button, group);
      applyComparisonState(button, group);
    },
  });

  CaseStudy.initComparisonScrollHint({
    mediaQuery: desktopCalloutMediaQuery,
  });
  CaseStudy.addMediaQueryListener(
    desktopCalloutMediaQuery,
    syncResponsiveInteractiveState,
  );
  window.addEventListener("resize", refreshActiveCardImageScroll);

  CaseStudy.initMobileShowcaseAutoScroll({
    interactionCooldownMs: 5200,
    downPath: [
      { ratio: 0.2, duration: 940, pause: 240 },
      { ratio: 0.42, duration: 1060, pause: 280 },
      { ratio: 0.66, duration: 1200, pause: 340 },
      { ratio: 0.86, duration: 1280, pause: 380 },
      { ratio: 1, duration: 1380, pause: 920 },
    ],
    upPath: [
      { ratio: 0.74, duration: 1080, pause: 300 },
      { ratio: 0.44, duration: 1040, pause: 260 },
      { ratio: 0, duration: 1160, pause: 540 },
    ],
  });
})();
