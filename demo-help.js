/* Explanations for the public, simulated demos. Does not alter the run model. */
(() => {
  const root = document.querySelector('[data-demo-portal], [data-static-trade-blotter]');
  if (!root) return;
  const portal = root.matches('[data-demo-portal]');
  const toolbar = document.createElement('div');
  toolbar.className = 'demo-help-toolbar';
  toolbar.innerHTML = '<button type="button" class="demo-help-toggle" aria-pressed="false">Explain controls</button><p>Hover or focus an item to learn what it means. On a phone, turn on Explain controls, then tap an item.</p>';
  root.before(toolbar);
  const toggle = toolbar.querySelector('button');
  const tip = document.createElement('div');
  tip.className = 'demo-help-tooltip';
  tip.setAttribute('role', 'tooltip');
  tip.hidden = true;
  document.body.append(tip);
  const descriptions = new Map();
  let counter = 0, active = null, dismissed = null, timer, explainMode = false;

  function bind(el, text) {
    if (!el || !text) return;
    el.dataset.demoHelp = text;
    if (descriptions.has(el)) return;
    const description = document.createElement('span');
    description.className = 'demo-help-description';
    description.id = 'demo-help-description-' + (++counter);
    description.textContent = text;
    document.body.append(description);
    descriptions.set(el, description);
    el.setAttribute('aria-describedby', [el.getAttribute('aria-describedby'), description.id].filter(Boolean).join(' '));
    if (!el.matches('button, input, select, a, label') && !el.querySelector('button:not([disabled]),input:not([disabled]),select:not([disabled]),a')) el.tabIndex = 0;
    if (el.matches('input,select')) {
      const label = el.closest('label') || root.querySelector(`label[for="${el.id}"]`);
      if (label) label.dataset.demoHelp = text;
    }
  }
  function explain(selector, text, parent = false) {
    root.querySelectorAll(selector).forEach(el => bind(parent ? el.parentElement : el, text));
  }
  const stocks = {NVDA:'NVIDIA',COIN:'Coinbase',MSFT:'Microsoft',AAPL:'Apple',TSLA:'Tesla',GOOGL:'Alphabet',AMD:'Advanced Micro Devices',AMZN:'Amazon'};
  const strategies = {
    momentum:'Momentum follows recent price strength or weakness.',
    macd_crossover:'MACD compares moving averages to identify changes in price momentum.',
    rsi_strategy:'RSI measures the strength of recent price moves and is often used to identify overbought or oversold conditions.',
    bollinger_bands:'Bollinger Bands compare price with a moving average and bands based on volatility.',
    buy_and_hold:'Buy and hold keeps an investment rather than repeatedly timing entries and exits.'
  };
  if (portal) {
    root.querySelectorAll('[data-portal-asset]').forEach(el => bind(el,
      `${el.dataset.portalAsset} is ${stocks[el.dataset.portalAsset]}. Toggle it in the candidate list; highlighted assets are included. The preview uses the first selected assets, up to Target active assets, rather than ranking live market data.`));
    root.querySelectorAll('[data-portal-strategy]').forEach(el => bind(el,
      `${strategies[el.dataset.portalStrategy]} Toggle it in the candidate list. This preview labels events with the first selected strategy; it does not execute or compare the strategy algorithms.`));
    explain('[data-portal-run-name]', 'A label for finding this sample in Saved runs. Runs are stored in this browser, not in a shared customer account.');
    explain('[data-portal-run-type]', 'Choose a sample backtest or paper-trade replay. Both generate browser-only examples. Paper replay requires the Paper trade replay module.');
    explain('[data-portal-target-assets]', 'How many selected candidates appear in the sample positions. The preview takes the first selected assets in display order and caps the count at the number available.');
    explain('[data-portal-risk]', 'Balanced, Risk-off, and Press winners choose different preset paths, return figures, drawdown figures, and sizing multipliers. These are illustrative settings, not calculated forecasts.');
    explain('[data-portal-granularity]', 'The interval each market-data bar would represent: 15 minutes, 6 hours, or 1 day. Here it is saved as a setting; changing it does not recalculate the sample path.');
    explain('[data-portal-run]', 'Generate and save a simulated run in this browser, then open its replay. No strategy engine runs and no orders are sent. Up to eight recent samples are retained.');
    explain('[data-portal-view="setup"]', 'Choose candidates and settings for a new simulated run.');
    explain('[data-portal-view="runs"]', 'Find samples saved in this browser and select one to reopen its replay.');
    explain('[data-portal-view="replay"]', 'Inspect the selected sample path, position weights, and example trade events.');
    explain('[data-portal-view="usage"]', 'Illustrative usage counters for retained samples. This does not create an invoice or charge an account.');
    const modules = {
      backtest:'Marks backtesting as enabled in this preview. It does not run a historical backtest.',
      ai_psm:'Enables the sample position size multiplier (PSM) for the chosen risk posture. With this off, sample PSM is 1.00. No AI service is called.',
      policy:'Enables a preset adjustment to sample return and drawdown. No production policy simulation runs here.',
      paper:'Allows the Paper trade replay selection in this demonstration. No broker or paper-trading account is connected.',
      live:'Shows an example live-trading permission in the entitlement summary. It never enables real orders on this public website.'
    };
    root.querySelectorAll('[data-portal-module]').forEach(el => bind(el, modules[el.dataset.portalModule]));
    explain('[data-portal-entitlement]', 'A sample permission check based on run type and enabled modules. This is not verification of a real account subscription.', true);
    explain('[data-portal-module-summary]', 'The demonstration modules currently selected in the sidebar.', true);
    explain('[data-portal-counts]', 'Candidate counts describe the choices available; active assets describe the subset used in the sample. A sleeve is a portion of a portfolio with its own assets and strategies.', true);
    explain('[data-portal-return]', 'The sample percentage gain or loss for the chosen preset. It is not measured investment performance or an annualized return.', true);
    explain('[data-portal-drawdown]', 'Maximum drawdown means the largest fall from a previous portfolio high. The number here is a preset illustration, not calculated from live prices.', true);
    explain('[data-portal-psm]', 'Position size multiplier: 1.00 means base size, 0.75 suggests 75% of base size, and 1.20 suggests 120%. This demo displays the chosen preset; its equal-weight examples are not a full sizing calculation.', true);
    explain('[data-portal-weights]', 'The sample divides weight equally among the active assets. This illustrates the output format rather than running actual portfolio risk constraints.', true);
    explain('.portal-chart', 'An illustrative portfolio path from left to right. The line is a preset sketch, not NVIDIA price history or a calculated equity curve. Markers show the generated events listed below.');
    explain('[data-usage-runs]', 'The number of samples currently retained in this browser, including any marked blocked.', true);
    explain('[data-usage-assets]', 'The sum of candidate asset counts across retained samples. An asset used in two runs counts twice.', true);
    explain('[data-usage-strategies]', 'The sum of candidate strategy counts across retained samples, including candidates not used in the replay.', true);
    explain('[data-usage-views]', 'An example billing counter, set to one per retained sample. This preview does not track actual page views.', true);
    explain('[data-usage-json]', 'The example usage record in JSON format. It shows the fields a metering integration could receive; nothing is submitted for billing.');
  } else {
    explain('[data-regime-select]', 'Choose a predefined market scenario. Each has its own scripted assets, strategies, events, and metrics. Switching scenarios resets the replay.');
    explain('[data-play]', 'Play or pause the scripted events at the selected speed. This animates a demonstration; it does not trade.');
    explain('[data-step]', 'Advance one simulated event so you can inspect its reason and position changes.');
    explain('[data-reset]', 'Return the current scenario to its starting state.');
    explain('[data-speed]', 'How quickly the animation advances between events. This does not change market-data granularity or strategy calculations.');
    const fields = [
      'Assets available in this scripted scenario. These checkboxes are a read-only legend. To choose your own candidates, use Run setup on the Demo portal.',
      'Strategy labels used in the scripted replay. These are a read-only legend; the demo does not execute these algorithms.',
      'The scenario determines how many assets are active at each step. This field cannot be edited in the replay.',
      'The scenario includes preset sizing and risk responses. These are illustrative, not a live risk assessment.',
      'One sleeve: a portion of a portfolio whose assets, strategies, and weights can change as events are replayed.'
    ];
    root.querySelectorAll('.blotter-control-grid > .blotter-field').forEach((el, i) => bind(el, fields[i]));
    explain('[data-run-id]', 'The identifier of the selected scripted scenario, not a production run.', true);
    explain('[data-annual-return]', 'The scenario\'s preset annual-return illustration. It is not calculated from the short capital path shown below and is not a verified trading result.', true);
    explain('[data-max-drawdown]', 'Largest peak-to-trough loss, expressed as a percentage. Here it is a predefined scenario metric.', true);
    explain('[data-sharpe]', 'Sharpe ratio describes return above a reference rate relative to return variability. This demo shows a preset example rather than a calculated result.', true);
    explain('[data-psm]', 'Position size multiplier for the current simulated event. 1.00 is base size; smaller values reduce the proposed size and larger values increase it.', true);
    explain('.blotter-chart-inner', 'Simulated portfolio capital over the scenario, read from left to right. Markers show trade events as you replay them. This is a scripted capital series, not an individual stock-price chart.');
    explain('[data-weights]', 'Illustrative portfolio weights for the current replay state. Each bar represents an asset\'s allocation; these are not broker positions.');
    explain('[data-current-event]', 'The event currently being replayed. Its reason explains the scripted change or decision to leave the position alone.', true);
    explain('[data-position-state]', 'Positions accumulated from the events processed so far. These are simulated holdings.');
    explain('[data-event-feed]', 'A running list of the simulated events already processed. Step through the replay to see the sequence.');
  }
  const columns = {
    Time:'The timestamp assigned to this simulated event.', Asset:'The stock symbol involved in the event.',
    Strategy:'The strategy label associated with this event; the demo does not execute its algorithm.',
    Event:'The recorded step, such as asset selection, entry, exit, sizing review, or risk review.',
    Action:'BUY adds a position, SELL reduces or exits it, RESIZE changes its size, and NO_EXEC records a decision without execution.',
    Price:'The scripted example price for this event. It is not a current market quote.',
    PSM:'Position size multiplier for this event, relative to base size.',
    Weight:'The illustrated share of portfolio capital for this position. Unchanged means the event leaves its allocation alone.',
    Reason:'The explanation recorded for the simulated decision.'
  };
  root.querySelectorAll('th').forEach(el => bind(el, columns[el.textContent.trim()]));
  function dynamicHelp() {
    explain('[data-portal-open-run]', 'Open this saved browser sample and inspect its generated trade replay. It does not launch another run.');
    root.querySelectorAll('[data-portal-markers] circle, [data-markers] circle').forEach(el => {
      const label = el.nextElementSibling?.textContent?.trim() || 'Trade event';
      bind(el, `${label}. A simulated trade marker. Read the corresponding blotter row for the timestamp, position size, and reason.`);
    });
    for (const [el, description] of descriptions) {
      if (!el.isConnected) { description.remove(); descriptions.delete(el); }
    }
    if (active && (!active.isConnected || !active.getClientRects().length)) hide();
  }
  function hide() { clearTimeout(timer); tip.hidden = true; active = null; }
  function position() {
    if (!active) return;
    const r = active.getBoundingClientRect();
    if (!active.getClientRects().length || r.bottom < 0 || r.top > innerHeight) { hide(); return; }
    const box = tip.getBoundingClientRect();
    const left = Math.max(12, Math.min(r.left, innerWidth - box.width - 12));
    const below = r.bottom + 8;
    const top = below + box.height < innerHeight - 12 ? below : Math.max(12, r.top - box.height - 8);
    tip.style.left = left + 'px'; tip.style.top = top + 'px';
  }
  function show(el) {
    if (!el || el === dismissed) return;
    clearTimeout(timer); active = el; tip.textContent = el.dataset.demoHelp; tip.hidden = false; position();
  }
  const target = event => event.target.closest?.('[data-demo-help]');
  root.addEventListener('pointerover', event => { if (event.pointerType !== 'touch') show(target(event)); });
  root.addEventListener('pointerout', event => {
    if (target(event) !== target({target:event.relatedTarget || document.body})) {
      dismissed = null; timer = setTimeout(hide, 180);
    }
  });
  root.addEventListener('focusin', event => { dismissed = null; show(target(event)); });
  root.addEventListener('focusout', () => { timer = setTimeout(hide, 180); });
  tip.addEventListener('pointerenter', () => clearTimeout(timer));
  tip.addEventListener('pointerleave', hide);
  toggle.addEventListener('click', () => {
    explainMode = !explainMode;
    toggle.setAttribute('aria-pressed', String(explainMode));
    toggle.textContent = explainMode ? 'Finish explaining' : 'Explain controls';
    root.classList.toggle('demo-help-mode', explainMode); hide(); dismissed = null;
  });
  root.addEventListener('click', event => {
    if (!explainMode) return;
    const el = target(event);
    if (el) { event.preventDefault(); event.stopImmediatePropagation(); dismissed = null; show(el); }
  }, true);
  root.addEventListener('pointerdown', event => {
    if (explainMode && event.target.matches('select,input')) {
      event.preventDefault(); dismissed = null; show(target(event));
    }
  }, true);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { dismissed = active; hide(); } });
  document.addEventListener('pointerdown', event => { if (!root.contains(event.target) && !tip.contains(event.target)) hide(); });
  window.addEventListener('resize', position);
  document.addEventListener('scroll', position, true);
  new MutationObserver(dynamicHelp).observe(root, {childList:true, subtree:true});
  dynamicHelp();
})();
