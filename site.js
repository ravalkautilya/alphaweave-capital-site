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
  const currentStrategySelect = demo.querySelector("[data-demo-current-strategy]");
  const targetAssetsSelect = demo.querySelector("[data-demo-target-assets]");
  const riskSelect = demo.querySelector("[data-demo-risk]");
  const apiInput = demo.querySelector("[data-demo-api-input]");
  const apiRunButton = demo.querySelector("[data-demo-api-run]");
  const apiStatusEl = demo.querySelector("[data-demo-api-status]");
  const stateEl = demo.querySelector("[data-demo-state]");
  const psmEl = demo.querySelector("[data-demo-psm]");
  const weightsEl = demo.querySelector("[data-demo-weights]");
  const modulesEl = demo.querySelector("[data-demo-modules]");
  const entitlementEl = demo.querySelector("[data-demo-entitlement]");
  const riskMetricsEl = demo.querySelector("[data-demo-risk-metrics]");
  const assetSwitchEl = demo.querySelector("[data-demo-asset-switch]");
  const assetSwitchReasonEl = demo.querySelector("[data-demo-asset-switch-reason]");
  const strategySwitchEl = demo.querySelector("[data-demo-strategy-switch]");
  const strategySwitchReasonEl = demo.querySelector("[data-demo-strategy-switch-reason]");
  const replayButton = demo.querySelector("[data-demo-replay]");
  const replayProgressEl = demo.querySelector("[data-demo-replay-progress]");
  const replayStatusEl = demo.querySelector("[data-demo-replay-status]");
  const lineEl = demo.querySelector("[data-demo-line]");
  const markerEl = demo.querySelector("[data-demo-markers]");
  const blotterEl = demo.querySelector("[data-demo-blotter]");
  let replayTimer = null;
  let replayStep = null;
  let lastEventCount = 0;
  let apiReplayPayload = null;

  const assetProfiles = {
    NVDA: {score: 0.91, beta: 1.24, incumbent: true},
    COIN: {score: 0.82, beta: 1.68, incumbent: true},
    MSFT: {score: 0.72, beta: 0.92, incumbent: false},
    AAPL: {score: 0.66, beta: 0.98, incumbent: false},
    TSLA: {score: 0.58, beta: 1.55, incumbent: false}
  };

  const strategyScores = {
    momentum: 0.83,
    macd_crossover: 0.74,
    bollinger_bands: 0.62,
    buy_and_hold: 0.58
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

  const switchStateForAsset = (asset, selectedAssets) => {
    const profile = assetProfiles[asset] || {};
    if (profile.incumbent && selectedAssets.includes(asset)) return "retained";
    if (profile.incumbent && !selectedAssets.includes(asset)) return "dropped";
    if (!profile.incumbent && selectedAssets.includes(asset)) return "selected";
    return "not selected";
  };

  const actionForSwitchState = (switchState, index, riskMode) => {
    if (switchState === "dropped") return "SELL";
    if (switchState === "retained") {
      if (riskMode === "press") return "RESIZE";
      return index === 0 ? "RESIZE" : "NO_EXEC";
    }
    if (switchState === "selected") return "BUY";
    return "NO_EXEC";
  };

  const markerClass = (action) => {
    if (action === "BUY") return "demo-marker-buy";
    if (action === "SELL") return "demo-marker-sell";
    return "demo-marker-resize";
  };

  const normalizeApiBase = (value) => String(value || "").trim().replace(/\/+$/, "");

  const configuredApiBase = () => normalizeApiBase(
    apiInput?.value
    || demo.dataset.demoApiBase
    || window.localStorage.getItem("alphaweave-demo-api-base")
    || new URLSearchParams(window.location.search).get("api")
    || ""
  );

  const setApiStatus = (text, mode = "") => {
    if (!apiStatusEl) return;
    apiStatusEl.textContent = text;
    apiStatusEl.dataset.status = mode;
  };

  const activeAssetsFromButtons = () => {
    const assets = assetButtons
      .filter((button) => button.classList.contains("is-active"))
      .map((button) => button.dataset.demoAsset)
      .filter(Boolean);
    return assets.length ? assets : ["NVDA"];
  };

  const activeModulesFromButtons = () => {
    const modules = moduleButtons
      .filter((button) => button.classList.contains("is-active"))
      .map((button) => button.dataset.demoModule)
      .filter(Boolean);
    return modules.length ? modules : ["backtest"];
  };

  const apiModuleNames = (modules) => {
    const map = {
      backtest: "asset_switching",
      ai_psm: "risk_position_sizing",
      policy: "policy_simulator",
      paper: "paper_trade",
      replay: "trade_replay"
    };
    return modules.map((module) => map[module] || module);
  };

  const strategyName = (strategy) => strategyLabels[strategy] || String(strategy || "").replaceAll("_", " ");

  const currentPayload = () => ({
    client_id: "website-demo",
    assets: activeAssetsFromButtons(),
    strategy: strategySelect?.value || "momentum",
    strategies: [
      currentStrategySelect?.value || "buy_and_hold",
      strategySelect?.value || "momentum"
    ].filter(Boolean),
    risk_posture: riskSelect?.value || "balanced",
    execution_mode: activeModulesFromButtons().includes("paper") ? "paper" : "demo",
    target_active_assets: Math.max(1, Number(targetAssetsSelect?.value || 2)),
    granularity: "6h",
    modules: apiModuleNames(activeModulesFromButtons())
  });

  const chartPointsFromCapital = (capitalSeries) => {
    const rows = Array.isArray(capitalSeries) && capitalSeries.length ? capitalSeries : [];
    if (!rows.length) {
      return [
        [36, 120],
        [180, 108],
        [324, 78],
        [468, 88],
        [616, 52]
      ];
    }
    const values = rows.map((row) => Number(row.pnl_pct ?? row.capital ?? 0)).filter(Number.isFinite);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(max - min, 0.0001);
    return rows.map((row, index) => {
      const value = Number(row.pnl_pct ?? row.capital ?? 0);
      const x = 36 + (580 * index / Math.max(rows.length - 1, 1));
      const y = 138 - ((value - min) / span) * 86;
      return [Math.round(x), Math.round(y)];
    });
  };

  const actionWeight = (payload, asset) => {
    const weights = payload?.risk_capped_weights || {};
    const value = Number(weights[asset]);
    return Number.isFinite(value) ? `${Math.round(value * 100)}%` : "unchanged";
  };

  const renderApiReplay = (payload, options = {}) => {
    if (!payload) return {eventCount: 0};
    const visibleCountOverride = Number.isInteger(options.visibleCount) ? options.visibleCount : null;
    const events = Array.isArray(payload.events) ? payload.events : [];
    const modules = Array.isArray(payload.modules) ? payload.modules : [];
    const points = chartPointsFromCapital(payload.capital_series);
    const visibleCount = visibleCountOverride === null
      ? events.length
      : Math.max(0, Math.min(events.length, visibleCountOverride));
    const visibleEvents = events.slice(0, visibleCount);
    const chartPointCount = visibleCountOverride === null
      ? points.length
      : Math.max(2, Math.min(points.length, visibleCount + 1));
    const visiblePoints = points.slice(0, chartPointCount);
    const assets = Object.keys(payload.risk_capped_weights || {});
    const psm = Number(payload.summary?.risk_capped_position_size_multiplier || events[0]?.psm || 1);

    if (stateEl) {
      stateEl.textContent = `${assets.length || events.length} active assets, ${strategyName(payload.strategy)} | API replay ${payload.run_id || ""}`;
    }
    if (psmEl) psmEl.textContent = psm.toFixed(2);
    if (weightsEl) {
      weightsEl.textContent = assets.length
        ? assets.map((asset) => `${asset} ${actionWeight(payload, asset)}`).join(" / ")
        : "No active weights returned";
    }
    if (modulesEl) modulesEl.textContent = modules.map((module) => module.replaceAll("_", " ")).join(" / ") || "Demo replay";
    if (entitlementEl) {
      entitlementEl.textContent = `API-backed replay | ${payload.execution_mode || "demo"} | ${payload.granularity || "6h"} | ${payload.sleeve_id || "sleeve"}`;
    }
    if (riskMetricsEl) {
      const last = Array.isArray(payload.capital_series) ? payload.capital_series[payload.capital_series.length - 1] : null;
      const pnl = Number(last?.pnl_pct || 0) * 100;
      riskMetricsEl.textContent = `${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}% / replay path`;
    }
    if (assetSwitchEl) assetSwitchEl.textContent = `Active assets: ${assets.join(", ") || activeAssetsFromButtons().join(", ")}`;
    if (assetSwitchReasonEl) assetSwitchReasonEl.textContent = "Returned by the hosted demo API from the selected candidate universe.";
    if (strategySwitchEl) strategySwitchEl.textContent = `Strategies reviewed: ${(payload.strategies || [payload.strategy]).map(strategyName).join(" / ")}`;
    if (strategySwitchReasonEl) strategySwitchReasonEl.textContent = "The browser created a replay-ready hosted demo run and rendered the returned decision trail.";

    lastEventCount = events.length;
    if (lineEl) {
      lineEl.classList.toggle("is-replaying", visibleCountOverride !== null);
      lineEl.setAttribute("points", visiblePoints.map(([x, y]) => `${x},${y}`).join(" "));
    }
    if (replayProgressEl) {
      const pct = events.length ? Math.round((visibleCount / events.length) * 100) : 0;
      replayProgressEl.style.width = `${visibleCountOverride === null ? 100 : pct}%`;
    }
    if (replayStatusEl) {
      if (visibleCountOverride === null) {
        replayStatusEl.textContent = `API replay ready: ${events.length} decision timestamps`;
      } else if (visibleCount === 0) {
        replayStatusEl.textContent = "API replay queued at measured start";
      } else {
        const event = visibleEvents[visibleEvents.length - 1];
        replayStatusEl.textContent = `${event.asof_date || event.time} | ${event.action} ${event.asset} | PSM ${Number(event.psm || 1).toFixed(2)}`;
      }
    }
    if (markerEl) {
      markerEl.innerHTML = visibleEvents.map((event, index) => {
        const [x, y] = points[Math.min(index, points.length - 1)] || [180 + index * 120, 90];
        const labelY = Math.max(22, y - 26 - index * 4);
        return `
          <line x1="${x}" y1="${y}" x2="${x}" y2="${labelY + 8}" stroke="rgba(255,255,255,0.28)" stroke-width="1"></line>
          <circle class="${markerClass(event.action)}" cx="${x}" cy="${y}" r="7"></circle>
          <text class="demo-marker-label" x="${x + 10}" y="${labelY}">${event.action} ${event.asset}</text>
        `;
      }).join("");
    }
    if (blotterEl) {
      blotterEl.innerHTML = visibleEvents.map((event) => `
        <tr>
          <td>${event.asof_date || event.time || ""}</td>
          <td>${event.asset || ""}</td>
          <td>${strategyName(event.strategy || payload.strategy)}</td>
          <td>${event.event_type || "api_replay"}</td>
          <td>${event.action || ""}</td>
          <td>${Number(event.psm || psm).toFixed(2)}</td>
          <td>${actionWeight(payload, event.asset)}</td>
          <td>${event.event_type === "decision_path_no_exec" ? "Policy" : "API replay"}</td>
          <td>${event.reason || "hosted demo replay"}</td>
        </tr>
      `).join("");
    }
    return {eventCount: events.length};
  };

  const stopReplay = (resetStep = true) => {
    if (replayTimer) {
      window.clearInterval(replayTimer);
      replayTimer = null;
    }
    if (resetStep) replayStep = null;
    if (replayButton) replayButton.textContent = "Play replay";
  };

  const renderDemo = (options = {}) => {
    if (apiReplayPayload) {
      return renderApiReplay(apiReplayPayload, options);
    }
    const visibleCountOverride = Number.isInteger(options.visibleCount) ? options.visibleCount : null;
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
    const currentStrategy = currentStrategySelect?.value || "buy_and_hold";
    const targetAssets = Math.max(1, Number(targetAssetsSelect?.value || 2));
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
    const activeAssets = ranked.slice(0, Math.min(targetAssets, ranked.length));
    const reviewedAssets = Array.from(new Set([...activeAssets, ...ranked.filter((asset) => assetProfiles[asset]?.incumbent)]));
    const droppedAssets = ranked.filter((asset) => assetProfiles[asset]?.incumbent && !activeAssets.includes(asset));
    const newAssets = activeAssets.filter((asset) => !assetProfiles[asset]?.incumbent);
    const rawWeight = Math.min(risk.cap, 1 / Math.max(activeAssets.length, 1));
    const weights = activeAssets.map((asset) => `${asset} ${(rawWeight * 100).toFixed(0)}%`);
    const avgBeta = activeAssets.reduce((sum, asset) => sum + (assetProfiles[asset]?.beta || 1), 0) / activeAssets.length;
    const psm = Math.max(0.5, risk.psm - Math.max(0, avgBeta - 1.15) * 0.08);
    const strategyDelta = (strategyScores[strategy] || 0.5) - (strategyScores[currentStrategy] || 0.5);
    const strategySwitchThreshold = riskMode === "press" ? 0.04 : 0.1;
    const strategySwitchAllowed = strategy === currentStrategy || strategyDelta >= strategySwitchThreshold;
    const activeStrategy = strategySwitchAllowed ? strategy : currentStrategy;
    const yShift = risk.drift + ranked.length * -4;
    const points = [
      [36, 118 + yShift],
      [180, 104 + yShift],
      [324, 72 + yShift],
      [468, 88 + yShift],
      [616, 54 + yShift]
    ];

    if (stateEl) {
      stateEl.textContent = `${activeAssets.length} active of ${ranked.length} candidates, ${strategyLabels[activeStrategy] || activeStrategy}`;
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
      entitlementEl.textContent = `${scopeForModules(modules)} | configured assets ${ranked.length} | run assets ${activeAssets.length} | strategies 2 | sleeves 1`;
    }
    if (riskMetricsEl) {
      const moduleLift = modules.includes("ai_psm") ? 12 : 0;
      const policyLift = modules.includes("policy") ? 6 : 0;
      const expectedReturn = (risk.returnBps + moduleLift + policyLift) / 100;
      const expectedDrawdown = (risk.drawdownBps + (modules.includes("policy") ? 5 : 0)) / 100;
      riskMetricsEl.textContent = `+${expectedReturn.toFixed(2)}% / ${expectedDrawdown.toFixed(2)}%`;
    }
    if (assetSwitchEl) {
      const selectedText = activeAssets.join(", ");
      const droppedText = droppedAssets.length ? `; dropped ${droppedAssets.join(", ")}` : "";
      assetSwitchEl.textContent = `Active assets: ${selectedText}${droppedText}`;
    }
    if (assetSwitchReasonEl) {
      assetSwitchReasonEl.textContent = newAssets.length
        ? `${newAssets.join(", ")} entered because their edge scores fit the target active asset count and risk cap.`
        : "Incumbent assets stayed active because no candidate had enough score advantage to replace them.";
    }
    if (strategySwitchEl) {
      strategySwitchEl.textContent = strategy === currentStrategy
        ? `Strategy retained: ${strategyLabels[currentStrategy] || currentStrategy}`
        : `${strategyLabels[currentStrategy] || currentStrategy} to ${strategyLabels[strategy] || strategy}`;
    }
    if (strategySwitchReasonEl) {
      if (strategy === currentStrategy) {
        strategySwitchReasonEl.textContent = "Strategy retained: candidate and incumbent are the same strategy.";
      } else if (strategySwitchAllowed) {
        strategySwitchReasonEl.textContent = `Switch accepted: candidate score advantage ${(strategyDelta * 100).toFixed(0)} points cleared the ${Math.round(strategySwitchThreshold * 100)} point policy hurdle.`;
      } else {
        strategySwitchReasonEl.textContent = `Switch held: candidate advantage ${(strategyDelta * 100).toFixed(0)} points did not clear the ${Math.round(strategySwitchThreshold * 100)} point policy hurdle.`;
      }
    }
    const events = reviewedAssets.slice(0, 5).map((asset, index) => {
      const switchState = switchStateForAsset(asset, activeAssets);
      const action = actionForSwitchState(switchState, index, riskMode);
      return {
        time: `2026-09-0${index + 1} ${index % 2 ? "15:30" : "09:30"}`,
        asset,
        strategy: strategyLabels[activeStrategy] || activeStrategy,
        switchState,
        action,
        psm: psm.toFixed(2),
        x: points[Math.min(index + 1, points.length - 1)][0],
        y: points[Math.min(index + 1, points.length - 1)][1],
        weight: activeAssets.includes(asset) ? `${(rawWeight * 100).toFixed(0)}%` : "0%",
        module: action === "NO_EXEC"
          ? "Policy"
          : modules.includes("ai_psm") ? "AI/PSM" : "Backtest",
        reason: action === "NO_EXEC"
          ? `${switchState} after policy review; capital unchanged`
          : `${switchState} by asset ranking; ${strategySwitchAllowed ? "strategy policy cleared" : "strategy held"}`
      };
    });
    lastEventCount = events.length;
    const visibleCount = visibleCountOverride === null
      ? events.length
      : Math.max(0, Math.min(events.length, visibleCountOverride));
    const visibleEvents = events.slice(0, visibleCount);
    const chartPointCount = visibleCountOverride === null
      ? points.length
      : Math.max(2, Math.min(points.length, visibleCount + 1));
    const visiblePoints = points.slice(0, chartPointCount);

    if (lineEl) {
      lineEl.classList.toggle("is-replaying", visibleCountOverride !== null);
      lineEl.setAttribute("points", visiblePoints.map(([x, y]) => `${x},${y}`).join(" "));
    }
    if (replayProgressEl) {
      const pct = events.length ? Math.round((visibleCount / events.length) * 100) : 0;
      replayProgressEl.style.width = `${visibleCountOverride === null ? 100 : pct}%`;
    }
    if (replayStatusEl) {
      if (visibleCountOverride === null) {
        replayStatusEl.textContent = `Ready: ${events.length} decision timestamps`;
      } else if (visibleCount === 0) {
        replayStatusEl.textContent = "Replay queued at measured start";
      } else {
        const event = visibleEvents[visibleEvents.length - 1];
        replayStatusEl.textContent = `${event.time} | ${event.action} ${event.asset} | PSM ${event.psm}`;
      }
    }

    if (markerEl) {
      markerEl.innerHTML = visibleEvents.map((event, index) => {
        const labelY = Math.max(22, event.y - 26 - index * 4);
        return `
          <line x1="${event.x}" y1="${event.y}" x2="${event.x}" y2="${labelY + 8}" stroke="rgba(255,255,255,0.28)" stroke-width="1"></line>
          <circle class="${markerClass(event.action)}" cx="${event.x}" cy="${event.y}" r="7"></circle>
          <text class="demo-marker-label" x="${event.x + 10}" y="${labelY}">${event.action} ${event.asset}</text>
        `;
      }).join("");
    }

    if (blotterEl) {
      blotterEl.innerHTML = visibleEvents.map((event) => `
        <tr>
          <td>${event.time}</td>
          <td>${event.asset}</td>
          <td>${event.strategy}</td>
          <td>${event.switchState}</td>
          <td>${event.action}</td>
          <td>${event.psm}</td>
          <td>${event.weight}</td>
          <td>${event.module}</td>
          <td>${event.reason}</td>
        </tr>
      `).join("");
    }
    return {eventCount: events.length};
  };

  const startReplay = () => {
    stopReplay(false);
    replayStep = 0;
    renderDemo({visibleCount: replayStep});
    if (replayButton) replayButton.textContent = "Pause replay";
    replayTimer = window.setInterval(() => {
      replayStep = Number(replayStep || 0) + 1;
      renderDemo({visibleCount: replayStep});
      if (replayStep >= lastEventCount) {
        stopReplay(false);
        if (replayButton) replayButton.textContent = "Replay again";
      }
    }, 900);
  };

  const runApiPreview = async () => {
    const apiBase = configuredApiBase();
    if (!apiBase) {
      setApiStatus("Enter a local or Railway API URL first.", "warn");
      return;
    }
    if (apiInput) {
      apiInput.value = apiBase;
      window.localStorage.setItem("alphaweave-demo-api-base", apiBase);
    }
    stopReplay();
    setApiStatus("Calling demo API...", "pending");
    if (apiRunButton) apiRunButton.disabled = true;
    try {
      const createResponse = await fetch(`${apiBase}/demo-runs`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(currentPayload())
      });
      if (!createResponse.ok) {
        throw new Error(`POST /demo-runs returned ${createResponse.status}`);
      }
      const created = await createResponse.json();
      const replayResponse = await fetch(`${apiBase}/demo-runs/${encodeURIComponent(created.run_id)}/replay`);
      if (!replayResponse.ok) {
        throw new Error(`GET /replay returned ${replayResponse.status}`);
      }
      apiReplayPayload = await replayResponse.json();
      renderApiReplay(apiReplayPayload);
      setApiStatus(`Connected to API. Rendered ${created.run_id}.`, "ok");
    } catch (error) {
      apiReplayPayload = null;
      renderDemo();
      setApiStatus(`API unavailable: ${error.message}. Showing local browser preview.`, "warn");
    } finally {
      if (apiRunButton) apiRunButton.disabled = false;
    }
  };

  assetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      stopReplay();
      apiReplayPayload = null;
      button.classList.toggle("is-active");
      renderDemo();
    });
  });

  moduleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      stopReplay();
      apiReplayPayload = null;
      button.classList.toggle("is-active");
      renderDemo();
    });
  });

  replayButton?.addEventListener("click", () => {
    if (replayTimer) {
      stopReplay(false);
      return;
    }
    startReplay();
  });
  apiRunButton?.addEventListener("click", () => {
    runApiPreview();
  });
  [strategySelect, currentStrategySelect, targetAssetsSelect, riskSelect].forEach((input) => {
    input?.addEventListener("change", () => {
      stopReplay();
      apiReplayPayload = null;
      renderDemo();
    });
  });
  const initialApiBase = configuredApiBase();
  if (apiInput && initialApiBase) apiInput.value = initialApiBase;
  renderDemo();
});

document.querySelectorAll("[data-demo-portal]").forEach((portal) => {
  const storageKey = "alphaweave-demo-portal-runs";
  const viewButtons = Array.from(portal.querySelectorAll("[data-portal-view]"));
  const views = Array.from(portal.querySelectorAll("[data-portal-panel]"));
  const moduleChecks = Array.from(portal.querySelectorAll("[data-portal-module]"));
  const runButton = portal.querySelector("[data-portal-run]");
  const runName = portal.querySelector("[data-portal-run-name]");
  const runType = portal.querySelector("[data-portal-run-type]");
  const assetButtons = Array.from(portal.querySelectorAll("[data-portal-asset]"));
  const strategyButtons = Array.from(portal.querySelectorAll("[data-portal-strategy]"));
  const targetAssetsSelect = portal.querySelector("[data-portal-target-assets]");
  const riskSelect = portal.querySelector("[data-portal-risk]");
  const granularitySelect = portal.querySelector("[data-portal-granularity]");
  const entitlementEl = portal.querySelector("[data-portal-entitlement]");
  const moduleSummaryEl = portal.querySelector("[data-portal-module-summary]");
  const countsEl = portal.querySelector("[data-portal-counts]");
  const runListEl = portal.querySelector("[data-portal-run-list]");
  const replayTitleEl = portal.querySelector("[data-portal-replay-title]");
  const returnEl = portal.querySelector("[data-portal-return]");
  const drawdownEl = portal.querySelector("[data-portal-drawdown]");
  const psmEl = portal.querySelector("[data-portal-psm]");
  const weightsEl = portal.querySelector("[data-portal-weights]");
  const lineEl = portal.querySelector("[data-portal-line]");
  const markerEl = portal.querySelector("[data-portal-markers]");
  const eventsEl = portal.querySelector("[data-portal-events]");
  const usageRunsEl = portal.querySelector("[data-usage-runs]");
  const usageAssetsEl = portal.querySelector("[data-usage-assets]");
  const usageStrategiesEl = portal.querySelector("[data-usage-strategies]");
  const usageViewsEl = portal.querySelector("[data-usage-views]");
  const usageJsonEl = portal.querySelector("[data-usage-json]");

  const moduleLabels = {
    backtest: "Backtest",
    ai_psm: "AI/PSM",
    policy: "Policy simulator",
    paper: "Paper trade replay",
    live: "Live trading governance"
  };

  const riskProfiles = {
    balanced: {label: "Balanced", psm: 1.0, ret: 0.74, dd: -0.22},
    risk_off: {label: "Risk-off", psm: 0.72, ret: 0.43, dd: -0.11},
    press: {label: "Press winners", psm: 1.18, ret: 1.06, dd: -0.36}
  };

  const strategyLabels = {
    momentum: "Momentum",
    macd_crossover: "MACD",
    rsi_strategy: "RSI",
    bollinger_bands: "Bollinger",
    buy_and_hold: "Buy and hold"
  };

  const loadRuns = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  };

  const saveRuns = (runs) => {
    localStorage.setItem(storageKey, JSON.stringify(runs.slice(0, 8)));
  };

  const activeModules = () => moduleChecks
    .filter((input) => input.checked)
    .map((input) => input.dataset.portalModule)
    .filter(Boolean);

  const scopeFor = (type, modules) => {
    if (modules.includes("live")) return "trades:live:create";
    if (type === "paper_trade_scheduler" || modules.includes("paper")) return "trades:paper:create";
    if (modules.includes("policy")) return "policies:simulate";
    return "backtests:create";
  };

  const showView = (name) => {
    viewButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.portalView === name));
    views.forEach((view) => view.classList.toggle("is-active", view.dataset.portalPanel === name));
  };

  const currentSetup = () => {
    const assets = assetButtons
      .filter((button) => button.classList.contains("is-active"))
      .map((button) => button.dataset.portalAsset)
      .filter(Boolean);
    const strategies = strategyButtons
      .filter((button) => button.classList.contains("is-active"))
      .map((button) => button.dataset.portalStrategy)
      .filter(Boolean);
    const modules = activeModules();
    const risk = riskProfiles[riskSelect?.value || "balanced"] || riskProfiles.balanced;
    return {
      name: String(runName?.value || "Demo AI allocation review").trim() || "Demo AI allocation review",
      type: runType?.value || "sample_backtest",
      assets: assets.length ? assets : ["NVDA"],
      strategies: strategies.length ? strategies : ["momentum"],
      modules,
      risk,
      targetAssets: Number(targetAssetsSelect?.value || 2),
      granularity: granularitySelect?.value || "6h"
    };
  };

  const renderSetup = () => {
    const setup = currentSetup();
    const scope = scopeFor(setup.type, setup.modules);
    const allowed = setup.type !== "paper_trade_scheduler" || setup.modules.includes("paper");
    if (entitlementEl) {
      entitlementEl.textContent = allowed ? `Allowed: ${scope}` : "Blocked: paper module not enabled";
    }
    if (moduleSummaryEl) {
      moduleSummaryEl.textContent = setup.modules.length
        ? setup.modules.map((module) => moduleLabels[module] || module).join(" / ")
        : "No modules selected";
    }
    if (countsEl) {
      const activeAssets = Math.min(setup.targetAssets, setup.assets.length);
      countsEl.textContent = `${setup.assets.length} candidate assets / ${activeAssets} active / ${setup.strategies.length} strategies / 1 sleeve`;
    }
  };

  const makeRun = () => {
    const setup = currentSetup();
    const allowed = setup.type !== "paper_trade_scheduler" || setup.modules.includes("paper");
    const now = new Date();
    const topAssets = setup.assets.slice(0, Math.min(setup.targetAssets, setup.assets.length));
    const activeStrategy = setup.strategies[0] || "momentum";
    const weight = `${Math.round(100 / Math.max(topAssets.length, 1))}%`;
    const psm = setup.modules.includes("ai_psm") ? setup.risk.psm : 1.0;
    const events = topAssets.map((asset, index) => {
      const eventType = index === 0 ? "asset_switch_selected" : index === 1 ? "ai_psm_reviewed" : "risk_cap_applied";
      const action = index === 0 ? "BUY" : index === 1 ? "RESIZE" : "NO_EXEC";
      return {
        time: `2026-09-0${index + 1} ${index % 2 ? "15:30" : "09:30"}`,
        asset,
        strategy: strategyLabels[activeStrategy] || activeStrategy,
        eventType,
        action,
        psm: psm.toFixed(2),
        weight: action === "NO_EXEC" ? "unchanged" : weight,
        reason: action === "NO_EXEC"
          ? "Risk cap reviewed the sleeve and kept capital unchanged."
          : `${setup.risk.label} policy cleared ${asset} for ${strategyLabels[activeStrategy] || activeStrategy}.`
      };
    });
    const run = {
      id: `demo_${now.getTime()}`,
      name: setup.name,
      createdAt: now.toISOString(),
      allowed,
      scope: scopeFor(setup.type, setup.modules),
      type: setup.type,
      assets: setup.assets,
      strategies: setup.strategies,
      modules: setup.modules,
      granularity: setup.granularity,
      returnPct: setup.modules.includes("policy") ? setup.risk.ret + 0.12 : setup.risk.ret,
      drawdownPct: setup.modules.includes("policy") ? setup.risk.dd + 0.05 : setup.risk.dd,
      psm: psm.toFixed(2),
      weights: topAssets.map((asset) => `${asset} ${weight}`).join(" / "),
      points: setup.risk.label === "Risk-off"
        ? "36,118 180,106 324,98 468,92 616,82"
        : setup.risk.label === "Press winners"
          ? "36,124 180,96 324,62 468,72 616,44"
          : "36,120 180,104 324,76 468,82 616,56",
      events
    };
    const runs = [run, ...loadRuns()];
    saveRuns(runs);
    renderAll(run.id);
    showView("replay");
  };

  const renderRuns = (selectedId = "") => {
    const runs = loadRuns();
    if (!runListEl) return;
    if (!runs.length) {
      runListEl.innerHTML = `<p class="portal-empty">No sample runs yet. Generate one from Run setup.</p>`;
      return;
    }
    runListEl.innerHTML = runs.map((run) => `
      <button type="button" data-portal-open-run="${run.id}" class="${run.id === selectedId ? "is-active" : ""}">
        <span>${run.allowed ? "allowed" : "blocked"} | ${run.scope}</span>
        <strong>${run.name}</strong>
        <em>${run.assets.length} assets / ${run.strategies.length} strategies / ${run.granularity} / ${new Date(run.createdAt).toLocaleString()}</em>
      </button>
    `).join("");
    runListEl.querySelectorAll("[data-portal-open-run]").forEach((button) => {
      button.addEventListener("click", () => {
        renderReplay(button.dataset.portalOpenRun);
        renderRuns(button.dataset.portalOpenRun);
        showView("replay");
      });
    });
  };

  const renderReplay = (selectedId = "") => {
    const runs = loadRuns();
    const run = runs.find((item) => item.id === selectedId) || runs[0];
    if (!run) return;
    if (replayTitleEl) replayTitleEl.textContent = run.name;
    if (returnEl) returnEl.textContent = `${run.returnPct >= 0 ? "+" : ""}${run.returnPct.toFixed(2)}%`;
    if (drawdownEl) drawdownEl.textContent = `${run.drawdownPct.toFixed(2)}%`;
    if (psmEl) psmEl.textContent = run.psm;
    if (weightsEl) weightsEl.textContent = run.weights;
    if (lineEl) lineEl.setAttribute("points", run.points);
    if (markerEl) {
      markerEl.innerHTML = run.events.map((event, index) => {
        const x = 180 + index * 144;
        const y = event.action === "NO_EXEC" ? 92 : event.action === "RESIZE" ? 76 : 104;
        const cls = event.action === "BUY" ? "demo-marker-buy" : event.action === "RESIZE" ? "demo-marker-resize" : "demo-marker-sell";
        return `
          <line x1="${x}" y1="${y}" x2="${x}" y2="${Math.max(24, y - 28)}" stroke="rgba(255,255,255,0.28)" stroke-width="1"></line>
          <circle class="${cls}" cx="${x}" cy="${y}" r="7"></circle>
          <text class="demo-marker-label" x="${x + 10}" y="${Math.max(20, y - 32)}">${event.action} ${event.asset}</text>
        `;
      }).join("");
    }
    if (eventsEl) {
      eventsEl.innerHTML = run.events.map((event) => `
        <tr>
          <td>${event.time}</td>
          <td>${event.asset}</td>
          <td>${event.strategy}</td>
          <td>${event.eventType}</td>
          <td>${event.action}</td>
          <td>${event.psm}</td>
          <td>${event.weight}</td>
          <td>${event.reason}</td>
        </tr>
      `).join("");
    }
  };

  const renderUsage = () => {
    const runs = loadRuns();
    const totals = runs.reduce((acc, run) => {
      acc.runs += 1;
      acc.assets += run.assets.length;
      acc.strategies += run.strategies.length;
      acc.views += 1;
      return acc;
    }, {runs: 0, assets: 0, strategies: 0, views: 0});
    if (usageRunsEl) usageRunsEl.textContent = String(totals.runs);
    if (usageAssetsEl) usageAssetsEl.textContent = String(totals.assets);
    if (usageStrategiesEl) usageStrategiesEl.textContent = String(totals.strategies);
    if (usageViewsEl) usageViewsEl.textContent = String(totals.views);
    if (usageJsonEl) {
      usageJsonEl.textContent = JSON.stringify({
        feature: "sample_backtest",
        counts: {
          run_sleeves: totals.runs ? 1 : 0,
          configured_assets: totals.assets,
          configured_strategies: totals.strategies,
          dashboard_views: totals.views
        }
      }, null, 2);
    }
  };

  const renderAll = (selectedId = "") => {
    renderSetup();
    renderRuns(selectedId);
    renderReplay(selectedId);
    renderUsage();
  };

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showView(button.dataset.portalView);
      renderAll();
    });
  });
  const wireToggleGroup = (buttons) => {
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const activeCount = buttons.filter((item) => item.classList.contains("is-active")).length;
        if (button.classList.contains("is-active") && activeCount === 1) return;
        button.classList.toggle("is-active");
        renderSetup();
      });
    });
  };

  wireToggleGroup(assetButtons);
  wireToggleGroup(strategyButtons);
  moduleChecks.forEach((input) => input.addEventListener("change", renderSetup));
  [runName, runType, targetAssetsSelect, riskSelect, granularitySelect].forEach((input) => {
    input?.addEventListener("input", renderSetup);
    input?.addEventListener("change", renderSetup);
  });
  runButton?.addEventListener("click", makeRun);
  renderAll();
});
