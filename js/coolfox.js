(function () {
  "use strict";

  const CaseStudy = window.PortfolioCaseStudy;
  if (!CaseStudy) {
    return;
  }

  CaseStudy.initSidebarNavigation();

  const desktopCalloutMediaQuery = window.matchMedia("(min-width: 981px)");
  const preloadedTabVideos = new Map();
  let tabVideoPreloadPool = null;

  function isVideoSource(src) {
    return /\.(mp4|webm|ogg)(?:[?#]|$)/i.test(src || "");
  }

  function getCardMedia(windowFrame) {
    return windowFrame ? windowFrame.querySelector("img, video") : null;
  }

  function getTabVideoPreloadPool() {
    if (tabVideoPreloadPool) {
      return tabVideoPreloadPool;
    }

    const pool = document.createElement("div");
    pool.hidden = true;
    pool.setAttribute("aria-hidden", "true");
    document.body.appendChild(pool);
    tabVideoPreloadPool = pool;
    return pool;
  }

  function stashPreloadedVideo(video) {
    if (!(video instanceof HTMLVideoElement)) {
      return;
    }

    video.pause();
    const pool = getTabVideoPreloadPool();
    if (video.parentNode !== pool) {
      pool.appendChild(video);
    }
  }

  function primeTabVideoSource(src) {
    if (!isVideoSource(src)) {
      return null;
    }

    let video = preloadedTabVideos.get(src);
    if (video) {
      return video;
    }

    video = document.createElement("video");
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("muted", "");
    video.setAttribute("loop", "");
    video.setAttribute("playsinline", "");
    video.src = src;
    getTabVideoPreloadPool().appendChild(video);
    video.load();
    preloadedTabVideos.set(src, video);
    return video;
  }

  function getButtonMediaSrc(button) {
    if (!button) {
      return "";
    }

    return !desktopCalloutMediaQuery.matches && button.dataset.mobileImageSrc
      ? button.dataset.mobileImageSrc
      : button.dataset.imageSrc || "";
  }

  function syncCardMedia(card, src, alt) {
    const windowFrame = card.querySelector(".cs-image-scroll-window");
    if (!windowFrame) {
      return null;
    }

    const shouldRenderVideo = isVideoSource(src);
    let media = getCardMedia(windowFrame);

    if (shouldRenderVideo) {
      const video = primeTabVideoSource(src);
      if (!video) {
        return null;
      }

      video.autoplay = true;
      video.preload = "auto";
      video.setAttribute("autoplay", "");

      const previousVideo =
        media instanceof HTMLVideoElement && media !== video ? media : null;

      if (media !== video) {
        if (media) {
          media.replaceWith(video);
        } else {
          windowFrame.appendChild(video);
        }
      }

      if (previousVideo) {
        stashPreloadedVideo(previousVideo);
      }

      media = video;

      const syncVideoAspectRatio = () => {
        if (media.videoWidth > 0 && media.videoHeight > 0) {
          windowFrame.style.setProperty(
            "--cs-media-aspect-ratio",
            `${media.videoWidth} / ${media.videoHeight}`,
          );
        }
      };

      if (media.readyState >= 1) {
        syncVideoAspectRatio();
      } else {
        media.addEventListener("loadedmetadata", syncVideoAspectRatio, {
          once: true,
        });
      }

      media.setAttribute("aria-label", alt || "Case study walkthrough video");

      if (window.portfolioVideoManager) {
        if (window.portfolioVideoManager.isNearViewport(windowFrame)) {
          window.portfolioVideoManager.playVideo(media);
        }
      } else {
        const playPromise = media.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      }

      return media;
    }

    if (!(media instanceof HTMLImageElement)) {
      const image = document.createElement("img");
      const previousVideo = media instanceof HTMLVideoElement ? media : null;

      if (media) {
        media.replaceWith(image);
      } else {
        windowFrame.appendChild(image);
      }

      if (previousVideo) {
        stashPreloadedVideo(previousVideo);
      }

      media = image;
    }

    if (src) {
      media.src = src;
    }

    if (alt) {
      media.alt = alt;
    }

    return media;
  }

  function initTabVideoPrefetch() {
    const solutionTabs = document.querySelector(
      '.cs-tabs[data-callout-target="#solution-card"]',
    );
    if (!solutionTabs) {
      return;
    }

    const buttons = Array.from(solutionTabs.querySelectorAll("button"));
    const videoButtons = buttons.filter((button) =>
      isVideoSource(button.dataset.imageSrc || button.dataset.mobileImageSrc),
    );

    if (!videoButtons.length) {
      return;
    }

    const primeButtonVideo = (button) => {
      primeTabVideoSource(getButtonMediaSrc(button));
    };

    videoButtons.forEach((button) => {
      button.addEventListener("pointerenter", () => primeButtonVideo(button), {
        passive: true,
      });
      button.addEventListener("focus", () => primeButtonVideo(button));
      button.addEventListener("touchstart", () => primeButtonVideo(button), {
        passive: true,
      });
    });

    if (!("IntersectionObserver" in window)) {
      primeButtonVideo(videoButtons[0]);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          primeButtonVideo(videoButtons[0]);
          observer.disconnect();
        });
      },
      {
        rootMargin: "240px 0px",
        threshold: 0.1,
      },
    );

    observer.observe(solutionTabs);
  }

  function applyImageScroll(card) {
    const windowFrame = card.querySelector(".cs-image-scroll-window");
    const media = getCardMedia(windowFrame);
    if (!media || !windowFrame) {
      return;
    }

    if (media instanceof HTMLVideoElement) {
      windowFrame.scrollTop = 0;
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

    const imageSrc =
      !desktopCalloutMediaQuery.matches && button.dataset.mobileImageSrc
        ? button.dataset.mobileImageSrc
        : button.dataset.imageSrc;
    const isVideoMedia = isVideoSource(imageSrc);
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
      !desktopCalloutMediaQuery.matches &&
        !isVideoMedia &&
        Boolean(button.dataset.mobileHotspotTop),
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

    const imageAlt =
      !desktopCalloutMediaQuery.matches && button.dataset.mobileImageAlt
        ? button.dataset.mobileImageAlt
        : button.dataset.imageAlt;
    const windowFrame = card.querySelector(".cs-image-scroll-window");

    if (windowFrame) {
      card.classList.toggle("has-video-media", isVideoMedia);
      windowFrame.classList.toggle("has-video-media", isVideoMedia);

      if (button.dataset.mediaFit) {
        windowFrame.style.setProperty("--cs-media-fit", button.dataset.mediaFit);
      } else {
        windowFrame.style.removeProperty("--cs-media-fit");
      }

      if (button.dataset.mediaAspectRatio) {
        windowFrame.style.setProperty(
          "--cs-media-aspect-ratio",
          button.dataset.mediaAspectRatio,
        );
      } else {
        windowFrame.style.removeProperty("--cs-media-aspect-ratio");
      }
    }

    const media = syncCardMedia(card, imageSrc, imageAlt);
    const imageScroll =
      !desktopCalloutMediaQuery.matches && button.dataset.mobileImageScroll
        ? button.dataset.mobileImageScroll
        : button.dataset.imageScroll;

    if (imageScroll) {
      card.dataset.activeImageScroll = imageScroll;
    } else {
      card.dataset.activeImageScroll = "0";
    }

    if (media instanceof HTMLImageElement && !media.complete) {
      media.addEventListener("load", () => applyImageScroll(card), {
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
        setCenter: true,
      });
    });
  }

  CaseStudy.initBinaryButtonGroups(".cs-tabs, .cs-toggle", {
    getScrollTarget(group) {
      return getInteractiveScrollTarget(group);
    },
    indicatorOptions: {
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
  initTabVideoPrefetch();

  CaseStudy.initMobileShowcaseAutoScroll({
    interactionCooldownMs: 5200,
    referenceScrollDistances: [1361, 2254, 3027],
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
