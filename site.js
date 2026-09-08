const toggle = document.querySelector("[data-nav-toggle]");
const links = document.querySelector("[data-nav-links]");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const organization = String(data.get("organization") || "").trim();
    const message = String(data.get("message") || "").trim();

    const local = ["m", "m", "b", "o", "t", "g", "r", "o", "u", "p"].join("");
    const domain = ["g", "m", "a", "i", "l", ".", "c", "o", "m"].join("");
    const recipient = `${local}@${domain}`;
    const subject = "AlphaWeave Capital platform walkthrough";
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      organization ? `Organization: ${organization}` : "Organization:",
      "",
      message
    ].join("\n");

    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

document.querySelectorAll("[data-click-card]").forEach((card) => {
  card.setAttribute("aria-expanded", "false");
});

document.querySelectorAll("[data-card-detail]").forEach((detailTarget) => {
  const scope = detailTarget.closest(".container") || detailTarget.closest(".section") || document;
  const cards = Array.from(scope.querySelectorAll("[data-click-card]"));
  const initialText = detailTarget.textContent.trim();

  if (!cards.length) return;

  const setDetail = (card) => {
    const isOpen = card.classList.contains("is-active");

    cards.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-expanded", "false");
      item.querySelectorAll(".inline-detail").forEach((detail) => detail.remove());
    });

    if (isOpen) {
      detailTarget.textContent = initialText;
      return;
    }

    const detail = card.dataset.detail || "";
    const title = card.dataset.title || card.querySelector("h3, strong")?.textContent?.trim() || "Detail";
    const inlineDetail = document.createElement("div");
    inlineDetail.className = "inline-detail";
    const inlineCopy = document.createElement("span");
    inlineCopy.textContent = detail || card.textContent.trim();
    inlineDetail.append(inlineCopy);

    card.classList.add("is-active");
    card.setAttribute("aria-expanded", "true");
    card.appendChild(inlineDetail);
    detailTarget.textContent = `${title}: ${detail || card.textContent.trim()}`;
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => setDetail(card));
  });
});

document.querySelectorAll("video").forEach((video) => {
  const resetVideoStart = () => {
    if (!Number.isFinite(video.duration)) return;
    video.pause();
    if (video.currentTime !== 0) {
      video.currentTime = 0;
    }
  };

  video.addEventListener("loadedmetadata", resetVideoStart, {once: true});
  video.addEventListener("ended", resetVideoStart);
});

window.addEventListener("pageshow", () => {
  document.querySelectorAll("video").forEach((video) => {
    video.pause();
    if (video.readyState > 0 && video.currentTime !== 0) {
      video.currentTime = 0;
    }
  });
});

document.querySelectorAll("[data-allocation-demo]").forEach((demo) => {
  const assetButtons = Array.from(demo.querySelectorAll("[data-demo-asset]"));
  const moduleButtons = Array.from(demo.querySelectorAll("[data-demo-module]"));
  const strategySelect = demo.querySelector("[data-demo-strategy]");
  const riskSelect = demo.querySelector("[data-demo-risk]");
  const stateEl = demo.querySelector("[data-demo-state]");
  const psmEl = demo.querySelector("[data-demo-psm]");
  const weightsEl = demo.querySelector("[data-demo-weights]");
  const modulesEl = demo.querySelector("[data-demo-modules]");
  const entitlementEl = demo.querySelector("[data-demo-entitlement]");
  const riskMetricsEl = demo.querySelector("[data-demo-risk-metrics]");
  const lineEl = demo.querySelector("[data-demo-line]");
  const markerEl = demo.querySelector("[data-demo-markers]");
  const blotterEl = demo.querySelector("[data-demo-blotter]");

  const assetProfiles = {
    NVDA: {score: 0.91, beta: 1.24},
    COIN: {score: 0.82, beta: 1.68},
    MSFT: {score: 0.72, beta: 0.92},
    AAPL: {score: 0.66, beta: 0.98},
    TSLA: {score: 0.58, beta: 1.55}
  };

  const riskProfiles = {
    balanced: {label: "Balanced", psm: 1.0, cap: 0.48, drift: 0, returnBps: 42, drawdownBps: -18},
    risk_off: {label: "Risk-off", psm: 0.72, cap: 0.36, drift: 18, returnBps: 25, drawdownBps: -9},
    press: {label: "Press winners", psm: 1.18, cap: 0.58, drift: -16, returnBps: 68, drawdownBps: -31}
  };

  const strategyLabels = {
    momentum: "Momentum rotation",
    macd_crossover: "MACD crossover",
    bollinger_bands: "Bollinger bands",
    buy_and_hold: "Buy and hold incumbent"
  };

  const moduleLabels = {
    backtest: "Backtest",
    ai_psm: "AI/PSM",
    policy: "Policy",
    paper: "Paper trade",
    replay: "Replay"
  };

  const scopeForModules = (modules) => {
    if (modules.includes("paper")) return "trades:paper:create";
    if (modules.includes("replay")) return "dashboard_replay:read";
    if (modules.includes("policy")) return "policies:simulate";
    return "backtests:create";
  };

  const actionFor = (asset, index, riskMode) => {
    if (riskMode === "risk_off" && index > 1) return "SELL";
    if (riskMode === "press" && index === 0) return "RESIZE";
    if (index === 0) return "BUY";
    if (index === 1) return "RESIZE";
    return "NO_EXEC";
  };

  const markerClass = (action) => {
    if (action === "BUY") return "demo-marker-buy";
    if (action === "SELL") return "demo-marker-sell";
    return "demo-marker-resize";
  };

  const renderDemo = () => {
    let assets = assetButtons
      .filter((button) => button.classList.contains("is-active"))
      .map((button) => button.dataset.demoAsset)
      .filter(Boolean);

    if (!assets.length) {
      assets = ["NVDA"];
      const nvda = assetButtons.find((button) => button.dataset.demoAsset === "NVDA");
      if (nvda) nvda.classList.add("is-active");
    }

    const riskMode = riskSelect?.value || "balanced";
    const strategy = strategySelect?.value || "momentum";
    const risk = riskProfiles[riskMode] || riskProfiles.balanced;
    let modules = moduleButtons
      .filter((button) => button.classList.contains("is-active"))
      .map((button) => button.dataset.demoModule)
      .filter(Boolean);

    if (!modules.length && moduleButtons.length) {
      modules = ["backtest"];
      const backtest = moduleButtons.find((button) => button.dataset.demoModule === "backtest");
      if (backtest) backtest.classList.add("is-active");
    }

    const ranked = [...assets].sort((a, b) => (assetProfiles[b]?.score || 0) - (assetProfiles[a]?.score || 0));
    const rawWeight = Math.min(risk.cap, 1 / Math.max(ranked.length, 1));
    const weights = ranked.map((asset) => `${asset} ${(rawWeight * 100).toFixed(0)}%`);
    const avgBeta = ranked.reduce((sum, asset) => sum + (assetProfiles[asset]?.beta || 1), 0) / ranked.length;
    const psm = Math.max(0.5, risk.psm - Math.max(0, avgBeta - 1.15) * 0.08);
    const yShift = risk.drift + ranked.length * -4;
    const points = [
      [36, 118 + yShift],
      [180, 104 + yShift],
      [324, 72 + yShift],
      [468, 88 + yShift],
      [616, 54 + yShift]
    ];

    if (stateEl) {
      stateEl.textContent = `${ranked.length}-asset sleeve, ${strategyLabels[strategy] || strategy}`;
    }
    if (psmEl) {
      psmEl.textContent = psm.toFixed(2);
    }
    if (weightsEl) {
      weightsEl.textContent = weights.join(" / ");
    }
    if (modulesEl) {
      modulesEl.textContent = modules.map((module) => moduleLabels[module] || module).join(" / ");
    }
    if (entitlementEl) {
      entitlementEl.textContent = `${scopeForModules(modules)} | assets ${ranked.length} | strategies 1 | sleeves 1`;
    }
    if (riskMetricsEl) {
      const moduleLift = modules.includes("ai_psm") ? 12 : 0;
      const policyLift = modules.includes("policy") ? 6 : 0;
      const expectedReturn = (risk.returnBps + moduleLift + policyLift) / 100;
      const expectedDrawdown = (risk.drawdownBps + (modules.includes("policy") ? 5 : 0)) / 100;
      riskMetricsEl.textContent = `+${expectedReturn.toFixed(2)}% / ${expectedDrawdown.toFixed(2)}%`;
    }
    if (lineEl) {
      lineEl.setAttribute("points", points.map(([x, y]) => `${x},${y}`).join(" "));
    }

    const events = ranked.slice(0, 4).map((asset, index) => {
      const action = actionFor(asset, index, riskMode);
      return {
        time: `2026-09-0${index + 1} ${index % 2 ? "15:30" : "09:30"}`,
        asset,
        action,
        psm: psm.toFixed(2),
        x: points[Math.min(index + 1, points.length - 1)][0],
        y: points[Math.min(index + 1, points.length - 1)][1],
        weight: `${(rawWeight * 100).toFixed(0)}%`,
        module: action === "NO_EXEC"
          ? "Policy"
          : modules.includes("ai_psm") ? "AI/PSM" : "Backtest",
        reason: action === "NO_EXEC"
          ? "Policy reviewed signal and kept capital unchanged"
          : `${strategyLabels[strategy] || strategy} cleared sleeve and risk checks`
      };
    });

    if (markerEl) {
      markerEl.innerHTML = events.map((event, index) => {
        const labelY = Math.max(22, event.y - 26 - index * 4);
        return `
          <line x1="${event.x}" y1="${event.y}" x2="${event.x}" y2="${labelY + 8}" stroke="rgba(255,255,255,0.28)" stroke-width="1"></line>
          <circle class="${markerClass(event.action)}" cx="${event.x}" cy="${event.y}" r="7"></circle>
          <text class="demo-marker-label" x="${event.x + 10}" y="${labelY}">${event.action} ${event.asset}</text>
        `;
      }).join("");
    }

    if (blotterEl) {
      blotterEl.innerHTML = events.map((event) => `
        <tr>
          <td>${event.time}</td>
          <td>${event.asset}</td>
          <td>${strategyLabels[strategy] || strategy}</td>
          <td>${event.action}</td>
          <td>${event.psm}</td>
          <td>${event.weight}</td>
          <td>${event.module}</td>
          <td>${event.reason}</td>
        </tr>
      `).join("");
    }
  };

  assetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("is-active");
      renderDemo();
    });
  });

  moduleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("is-active");
      renderDemo();
    });
  });

  strategySelect?.addEventListener("change", renderDemo);
  riskSelect?.addEventListener("change", renderDemo);
  renderDemo();
});
