# Trade Dashboard Specimen: Play-Forward Blotter

This episode follows one directional sleeve in the play-forward trade dashboard. It calls out the sleeve, the active strategy state, asset switching inside the sleeve, changing risk-capped weights, BUY, SELL, and RESIZE events, and populated risk cards.

PSM means position size multiple.

## Run

- Run id: `trade_dashboard_specimen_20260903_082451`
- Mode: historic replay
- Playback: 1800 ms
- Granularity: 6h
- Measured start: `2026-02-02T13:30:00`
- Sleeve: `monthly_ai_rotatable_directional`
- Active strategy: `buy_and_hold`
- Candidate behavior shown: asset switching and position sizing inside the sleeve
- Portfolio points: 20
- Tracker executions: 12
- Allocation snapshots: 20

## Narration

The dashboard opens at the measured start date, so the plot begins where the run starts carrying measured P&L. The line is not a placeholder: it comes from the portfolio series and shows the account moving through the replay window.

The sleeve shown is `monthly_ai_rotatable_directional`. The active strategy is `buy_and_hold`, so the run is not trying to prove that strategy switching changed the result here. The strategy panel is still important because it confirms which strategy is attached to the sleeve while the asset book changes underneath it.

The first timestamp opens the sleeve with AAPL and MSFT. Both are BUY events, both have PSM 0.92, and both are visible as a single grouped annotation because they occur at the same timestamp.

On February 3 at 19:30, the book rotates. AAPL is sold after weaker relative momentum, while NVDA is bought as the stronger risk-adjusted candidate. The annotation groups the mixed actions on one timestamp instead of scattering labels across the chart.

On February 5 at 13:30, MSFT is resized. This is not a duplicate buy; it is a position-tracker RESIZE event. The dashboard marks it in yellow and shows the PSM used for the resize.

On February 6 at 19:30, COIN enters the sleeve. Economically, that adds a higher-beta, crypto-linked security to the directional sleeve after stronger relative fit. This is an asset-switching event inside the same sleeve, not a new sleeve. At this point the risk-capped weights have already moved away from the initial AAPL/MSFT split.

On February 10 at 13:30, MSFT is sold and AMD is bought. That is a capital rotation: one holding is removed and a new semiconductor exposure is added. The portfolio line keeps moving across the event instead of flattening, which is the core behavior the dashboard specimen is meant to prove.

On February 11 at 19:30, COIN is resized with PSM 0.74. The resize is deliberately smaller because the path is positive but volatility is higher.

The final timestamp closes AMD and reopens AAPL. The dashboard ends with the weight cards showing the active sleeve, the active strategy-in-sleeve weight, the position asset weights, and the risk-capped position weights. The risk cards are populated too: PSM 0.94, gross exposure 95%, net exposure 95%, capital in use $100,624, capital available $5,296, max drawdown 0.0148, annual return 0.512, Sharpe 1.37, and volatility 0.193.

## What The Demo Proves

- The replay is driven by position-tracker executions.
- The sleeve is explicit: `monthly_ai_rotatable_directional`.
- Strategy state is explicit: `buy_and_hold` remains the active strategy in this specimen.
- Asset switching happens inside the sleeve as AAPL, MSFT, NVDA, COIN, AMD enter, exit, or resize.
- BUY, SELL, and RESIZE appear on the plot at their timestamps.
- Multiple actions at the same timestamp are grouped into one annotation.
- Risk-capped position weights change through the run.
- Risk metrics are populated and non-zero.
- The dashboard starts at measured start instead of drifting into pre-measurement history.

## Evidence Files

- Manifest: `assets/podcasts/cases/trade-dashboard-specimen/trade-dashboard-specimen-manifest.json`
- API payload: `assets/podcasts/cases/trade-dashboard-specimen/trade-dashboard-specimen-payload.json`
- Tracker event rows: `assets/podcasts/cases/trade-dashboard-specimen/trade-dashboard-specimen-events.csv`
- Risk-capped weight timeline: `assets/podcasts/cases/trade-dashboard-specimen/trade-dashboard-specimen-risk-capped-weights.csv`
- Screenshot sequence: `assets/podcasts/cases/trade-dashboard-specimen/trade-dashboard-specimen-00-open.png` through `trade-dashboard-specimen-04-replay.png`
- Voiced replay video: `assets/podcasts/trade-dashboard-specimen-play-forward-voiced.mp4`
- Narration audio: `assets/podcasts/trade-dashboard-specimen-play-forward.narration.mp3`
