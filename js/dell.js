(function () {
  "use strict";

  const CaseStudy = window.PortfolioCaseStudy;
  if (!CaseStudy) {
    return;
  }

  CaseStudy.initSidebarNavigation();

  const comparisonGroups = CaseStudy.initBinaryButtonGroups(
    ".cs-toggle[data-compare-target]",
    {
      indicatorOptions: {
        setX: true,
        setWidth: true,
        setCenter: true,
      },
      onActivate(button, group) {
        applyComparisonState(button, group);
      },
    },
  );
  const layoutModule = document.querySelector("[data-case-layout-module]");
  const hifiPlaceholderSrc =
    "images/portfolio/landers/dell/new/hifi-placeholder.svg";
  const layoutContent = {
    hero: {
      title: "Hero Structure & First Impression",
      callout:
        "The hero section was structured to communicate Dell Rewards value immediately while keeping the enrollment path clear and visually dominant.",
      description:
        "The hero section was structured to communicate Dell Rewards value immediately while keeping the enrollment path clear and visually dominant. The wireframe focused on hierarchy, CTA placement, and balancing promotional messaging with product visuals before introducing final branding and imagery.",
      wireframeSrc: "images/portfolio/landers/dell/new/wireframe-hero.jpg",
      wireframeAlt: "Dell Rewards wireframe hero section",
      hifiSrc: "images/portfolio/landers/dell/new/hifi-hero.jpg",
      hifiAlt: "Dell Rewards hi-fidelity hero section",
    },
    featuredDeals: {
      title: "Featured Deals Prioritization",
      callout:
        "This section was designed to surface promotional offers quickly while preserving a clean scan pattern.",
      description:
        "This section was designed to surface promotional offers quickly while preserving a clean scan pattern. The wireframe prioritized deal clarity, spacing, and card grouping so users could compare offers without losing momentum toward enrollment.",
      wireframeSrc:
        "images/portfolio/landers/dell/new/wireframe-featured-deals.jpg",
      wireframeAlt: "Dell Rewards wireframe featured deals section",
      hifiSrc: "images/portfolio/landers/dell/new/hifi-featured-deals.jpg",
      hifiAlt: "Dell Rewards hi-fidelity featured deals section",
    },
    rewardsPoints: {
      title: "Rewards Points Clarity",
      callout:
        "The points module was structured to explain how earning works in simple steps with clear sequencing and pacing.",
      description:
        "The points module was structured to explain how earning works in simple steps. The wireframe focused on clear sequencing, easy-to-parse labels, and visual pacing so users could understand value mechanics before moving further down the page.",
      wireframeSrc:
        "images/portfolio/landers/dell/new/wireframe-howitworks-rewardspoints.jpg",
      wireframeAlt: "Dell Rewards wireframe rewards points section",
      hifiSrc:
        "images/portfolio/landers/dell/new/hifi-howitworks-rewardspoints.jpg",
      hifiAlt: "Dell Rewards hi-fidelity rewards points section",
    },
    memberBenefits: {
      title: "Member Benefits Grid Structure",
      callout:
        "The benefits area used a modular grid to make features easier to scan and compare at a glance.",
      description:
        "The benefits area used a modular grid layout to make features easy to scan and compare. The wireframe emphasized consistent card structure, hierarchy across benefit groups, and concise messaging to reduce cognitive load.",
      wireframeSrc:
        "images/portfolio/landers/dell/new/wirweframe-member-benefits.jpg",
      wireframeAlt: "Dell Rewards wireframe member benefits grid section",
      hifiSrc: "images/portfolio/landers/dell/new/hifi-member-benefits.jpg",
      hifiAlt: "Dell Rewards hi-fidelity member benefits grid section",
    },
    accountValue: {
      title: "Account Value Framing",
      callout:
        "This section framed long-term member value with balanced visual weight and clear transitions from promo content.",
      description:
        "This section framed long-term member value and retention signals. The wireframe was planned to reinforce trust and ownership benefits with balanced visual weight and clear transitions from promotional content.",
      wireframeSrc:
        "images/portfolio/landers/dell/new/wireframe-account-value.jpg",
      wireframeAlt: "Dell Rewards wireframe account value section",
      hifiSrc: "images/portfolio/landers/dell/new/hifi-account-value.jpg",
      hifiAlt: "Dell Rewards hi-fidelity account value section",
    },
    faq: {
      title: "FAQ & Objection Handling",
      callout:
        "The FAQ block was placed to resolve enrollment hesitation with concise objection handling before final CTA actions.",
      description:
        "The FAQ block was placed to resolve enrollment hesitation near the bottom of the page. The wireframe emphasized concise objection handling, readable grouping, and low-friction access to answers before final CTA actions.",
      wireframeSrc: "images/portfolio/landers/dell/new/wireframe-faq.jpg",
      wireframeAlt: "Dell Rewards wireframe FAQ and objection handling section",
      hifiSrc: "images/portfolio/landers/dell/new/hifi-faq.jpg",
      hifiAlt:
        "Dell Rewards hi-fidelity FAQ and objection handling section",
    },
  };

  function applyComparisonState(button, group) {
    const targetSelector = group.dataset.compareTarget;
    if (!targetSelector) {
      return;
    }

    const image = document.querySelector(targetSelector);
    const scrollWindow = image ? image.closest(".cs-image-scroll-window") : null;
    const fullScreenLink = group
      .closest(".cs-toggle-row")
      ?.querySelector(".case-comparison-cta-desktop-only");

    if (!image) {
      return;
    }

    const isMobileViewport = window.matchMedia("(max-width: 980px)").matches;
    const nextSrc = isMobileViewport
      ? button.dataset.compareMobileSrc || button.dataset.compareSrc
      : button.dataset.compareSrc;
    const nextAlt = isMobileViewport
      ? button.dataset.compareMobileAlt || button.dataset.compareAlt
      : button.dataset.compareAlt;

    if (nextSrc) {
      image.src = nextSrc;
    }

    if (nextAlt) {
      image.alt = nextAlt;
    }

    if (fullScreenLink && button.dataset.compareSrc) {
      fullScreenLink.href = button.dataset.compareSrc;
      fullScreenLink.setAttribute(
        "aria-label",
        `View full screen ${button.textContent.trim()} comparison image`,
      );
    }

    if (scrollWindow) {
      scrollWindow.scrollTop = 0;
    }
  }

  if (layoutModule) {
    const layoutTabButtons = Array.from(
      layoutModule.querySelectorAll("[data-layout-key]"),
    );
    const layoutModeGroup = layoutModule.querySelector("[data-layout-mode-toggle]");
    const layoutModeButtons = layoutModeGroup
      ? Array.from(layoutModeGroup.querySelectorAll("[data-layout-mode]"))
      : [];
    const layoutHotspot = layoutModule.querySelector("[data-layout-hotspot]");
    const layoutImage = layoutModule.querySelector("[data-layout-image]");
    const layoutImageCard = layoutModule.querySelector(".case-layout-image-card");
    const layoutImageScrollWindow = layoutImage
      ? layoutImage.closest(".cs-image-scroll-window")
      : null;
    let activeLayoutKey =
      layoutTabButtons.find((button) => button.classList.contains("is-active"))
        ?.dataset.layoutKey || "hero";
    let activeLayoutMode =
      layoutModeButtons.find((button) => button.classList.contains("is-active"))
        ?.dataset.layoutMode || "wireframe";

    function renderLayoutModule() {
      const content = layoutContent[activeLayoutKey];
      if (!content || !layoutImage) {
        return;
      }

      if (layoutHotspot) {
        layoutHotspot.style.left = "50%";
        layoutHotspot.style.top = "174px";
      }

      const nextSrc =
        activeLayoutMode === "hifi"
          ? content.hifiSrc || hifiPlaceholderSrc
          : content.wireframeSrc;
      const nextAlt =
        activeLayoutMode === "hifi"
          ? content.hifiAlt || `${content.title} hi-fidelity placeholder`
          : content.wireframeAlt;

      if (nextSrc) {
        layoutImage.src = nextSrc;
      }
      if (nextAlt) {
        layoutImage.alt = nextAlt;
      }

      if (layoutImageScrollWindow) {
        layoutImageScrollWindow.scrollTop = 0;
      }

      if (layoutModeGroup) {
        const activeModeButton =
          layoutModeButtons.find((button) => button.classList.contains("is-active")) ||
          layoutModeButtons[0];
        if (activeModeButton) {
          CaseStudy.updateBinaryToggleIndicator(layoutModeGroup, activeModeButton, {
            setX: true,
            setWidth: true,
            setCenter: true,
          });
        }
      }
    }

    layoutTabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        layoutTabButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        activeLayoutKey = button.dataset.layoutKey || "hero";
        renderLayoutModule();
        CaseStudy.scrollTargetIntoView(layoutImageCard);
      });
    });

    layoutModeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        layoutModeButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        activeLayoutMode = button.dataset.layoutMode || "wireframe";
        renderLayoutModule();
      });
    });

    CaseStudy.bindBinaryToggleSurfaceClick(layoutModeGroup, layoutModeButtons);
    renderLayoutModule();
  }

  window.addEventListener("resize", () => {
    comparisonGroups.forEach((group) => {
      const activeButton = CaseStudy.getActiveButton(group);
      if (activeButton) {
        applyComparisonState(activeButton, group);
        CaseStudy.updateBinaryToggleIndicator(group, activeButton, {
          setX: true,
          setWidth: true,
          setCenter: true,
        });
      }
    });

    if (layoutModule) {
      const layoutModeGroup = layoutModule.querySelector("[data-layout-mode-toggle]");
      const activeModeButton = layoutModeGroup
        ? CaseStudy.getActiveButton(layoutModeGroup)
        : null;
      if (layoutModeGroup && activeModeButton) {
        CaseStudy.updateBinaryToggleIndicator(layoutModeGroup, activeModeButton, {
          setX: true,
          setWidth: true,
          setCenter: true,
        });
      }
    }
  });

  CaseStudy.initMobileShowcaseAutoScroll({
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
  });
})();
