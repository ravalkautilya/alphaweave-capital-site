# Alpha Case: 2024-09-12 to 2024-09-18 Positive Allocation Stack

## Case Angle

This is a dated alpha case, not a numbered background episode.

The case reviews a sampled run where the generated reports clearly separate baseline, strategy review, asset selection, and AI/PSM overlay behavior.

The point of the episode is the evidence trail: what the P and L dashboard shows, what the risk summaries say, what the PSM ledger records, and what the decision audit proves about executed portfolio events.

## Baseline

The baseline is buy-and-hold.

The static baseline uses the initial COIN and NVDA book with the `buy_and_hold` strategy.

## Performance Stack

| Stage | Return | Pickup |
| --- | ---: | ---: |
| Static baseline, buy-and-hold COIN/NVDA | -0.54% | baseline |
| Strategy switching | -0.54% | +0.00 percentage points |
| Asset switching | +1.02% | +1.56 percentage points |
| AI/PSM overlay | +1.17% | +0.15 percentage points over asset stage |

Total overlay improvement versus baseline: +1.71 percentage points.

The path is:

`-0.54% -> +1.02% -> +1.17%`

Strategy-switching detail: `macd_crossover` was the selected shadow candidate in the strategy stage, but it was not activated. The active executable strategy stayed `buy_and_hold`, with zero runtime strategy switch events and a `MIN_HOLD` switch reason. In the later asset stage, the selected shadow candidates were mostly `macd_crossover`, with one `momentum` selection, but the active strategy still remained `buy_and_hold`.

## What Worked

Asset switching did the main work.

- Baseline assets: COIN, NVDA
- Asset-stage assets: AMD, COIN, GOOGL, NVDA, TSLA
- Asset pickup: +1.56 percentage points
- Asset-stage return: +1.02%

AI/PSM added a smaller improvement.

- AI/PSM pickup: +0.15 percentage points
- Overlay return: +1.17%
- Overlay beta: 0.1805 versus asset-stage beta of 0.1822
- Report-level event path changed: asset stage had 6 ENTER_LONG and 6 EXIT_LONG events; overlay had 4 ENTER_LONG and 3 EXIT_LONG events

## ReportAgent Event Rows

These rows are pulled from the generated ReportAgent `multi_sleeve\decision_audit.csv` files, filtered to the measured window and non-empty portfolio events. This is the evidence source for the trade path described in the podcast.

Event artifact copies:

- `alpha-case-2024-09-12-to-2024-09-18-reportagent-events.csv`
- `alpha-case-2024-09-12-to-2024-09-18-reportagent-events.json`

The decision audit confirms the strategy remained `buy_and_hold`. The change came from asset selection and AI/PSM execution behavior, not from a new trading rule.

The strategy report still matters because it proves what did not happen: the system evaluated `macd_crossover` as the selected candidate, but did not switch the active strategy before asset switching. That is why strategy pickup is zero and the asset pickup should be read as asset selection on top of the same active `buy_and_hold` rule.

Measured-window asset-stage events from `decision_audit.csv`:

| Date | Asset | Raw signal | Model action | Portfolio event |
| --- | --- | --- | --- | --- |
| 2024-09-12 13:30 | NVDA | BUY | BUY | EXIT_LONG |
| 2024-09-12 19:30 | NVDA | BUY | HOLD | ENTER_LONG |

Measured-window AI/PSM overlay events from `decision_audit.csv`:

| Date | Asset | Raw signal | Model action | Final action | Portfolio event | PSM | Confidence | Policy reason |
| --- | --- | --- | --- | --- | --- | ---: | ---: | --- |
| 2024-09-12 13:30 | COIN | BUY | BUY | BUY | ENTER_LONG | 1.00 | 0.55 | expected_uplift_below_stage_acceptance_margin |
| 2024-09-12 13:30 | NVDA | BUY | SELL |  | EXIT_LONG |  | 1.00 |  |
| 2024-09-12 19:30 | NVDA | BUY | BUY | BUY | ENTER_LONG | 1.00 | 0.85 | expected_uplift_below_stage_acceptance_margin |
| 2024-09-16 19:30 | AMD | BUY | SELL |  | EXIT_LONG |  | 1.00 |  |
| 2024-09-17 13:30 | AMD | BUY | BUY | BUY | ENTER_LONG | 1.00 | 0.60 | no_ai_psm_exposure_change |
| 2024-09-17 13:30 | NVDA | BUY | LIQUIDATE | LIQUIDATE | EXIT_LONG | 1.00 | 0.62 | exception_and_uplift_cleared |
| 2024-09-17 19:30 | NVDA | BUY | BUY | BUY | ENTER_LONG | 1.00 | 0.70 | expected_uplift_below_stage_acceptance_margin |

The practical takeaway is that the overlay did not create alpha through higher PSM. It created the small +0.15 percentage-point pickup through a different executed event path.

## PSM Decision Ledger

The PSM ledger is also pulled from the overlay ReportAgent `multi_sleeve\decision_audit.csv`. It ties each AI/PSM decision to sizing fields, confidence, and the policy reason.

Artifact copies:

- `alpha-case-2024-09-12-to-2024-09-18-psm-decision-ledger.csv`
- `alpha-case-2024-09-12-to-2024-09-18-psm-decision-ledger.json`

Important report finding: the sizing fields are audited beside the executed portfolio events. The report therefore says the AI/PSM lift was an action-path win, not a resize story.

| Date | Asset | Model action | Portfolio event | Sizing fields | Confidence | Policy reason |
| --- | --- | --- | --- | --- | ---: | --- |
| 2024-09-12 13:30 | COIN | BUY | ENTER_LONG | audited | 0.55 | expected_uplift_below_stage_acceptance_margin |
| 2024-09-12 19:30 | NVDA | BUY | ENTER_LONG | audited | 0.85 | expected_uplift_below_stage_acceptance_margin |
| 2024-09-13 13:30 | COIN | HOLD | NO_EXEC | audited | 0.75 | no_ai_psm_exposure_change |
| 2024-09-17 13:30 | AMD | BUY | ENTER_LONG | audited | 0.60 | no_ai_psm_exposure_change |
| 2024-09-17 13:30 | NVDA | LIQUIDATE | EXIT_LONG | audited | 0.62 | exception_and_uplift_cleared |
| 2024-09-17 19:30 | NVDA | BUY | ENTER_LONG | audited | 0.70 | expected_uplift_below_stage_acceptance_margin |

That is the nuance the podcast should show on screen: PSM was audited and policy-controlled, but the overlay pickup came from changed portfolio events, especially the NVDA liquidation/re-entry path, not from increasing size.

## Report Review

1. Strategy/asset summary:
   `strategy_asset_sampled_finding_alpha_episode_06_september_2024_positive_alpha_stack_20260810_064611_sa_summary.html`

   This report shows the staged return path. Strategy switching did not add return in this case. `macd_crossover` was selected as the shadow candidate, but the active strategy stayed `buy_and_hold`. Asset switching did the main work.

2. AI/PSM summary:
   `ai_psm_sampled_2023_01_to_2026_06_finding_alpha_episode_06_september_2024_positive_alpha_stack_20260810_064611_ai_summary.html`

   This report shows the overlay return versus the asset-stage return. The overlay improved the window from +1.02% to +1.17%.

3. Strategy/asset detail CSV:
   `strategy_asset_sampled_finding_alpha_episode_06_september_2024_positive_alpha_stack_20260810_064611_sa_detail.csv`

   This file is the row-level attribution source for baseline, strategy, and asset pickup.

4. AI/PSM detail CSV:
   `ai_psm_sampled_2023_01_to_2026_06_finding_alpha_episode_06_september_2024_positive_alpha_stack_20260810_064611_ai_detail.csv`

   This file is the row-level source for overlay pickup, beta, PSM, accepted changes, and component counts.

5. Decision audit:
   `decision_audit.csv`

   The decision audit is the execution flight recorder. It confirms that the overlay changed portfolio events.

## ReportAgent Evidence Shown

These are the actual ReportAgent outputs from the run, separate from the monthly wrapper summaries.

Key ReportAgent files:

| ReportAgent file | Why it matters |
| --- | --- |
| `dynamic_plots\pnl_dashboard_dynamic_plot.html` | Visual path of P and L and drawdown for the run. This is the fastest way to see whether the improvement was smooth or came from one jump. |
| `multi_sleeve\position_risk_metrics_weighted_summary.csv` | Position-level realized performance and risk. This is where the final executed portfolio path should be reviewed. |
| `multi_sleeve\decision_risk_metrics_weighted_summary.csv` | Decision-level risk and performance. This helps compare what the decision layer wanted versus what the portfolio path produced. |
| `multi_sleeve\decision_audit.csv` | The final audit trail: active assets, strategy, model action, portfolio event, PSM, confidence, and policy reasons. |
| Sleeve-level `position_risk_metrics_weighted_summary.csv` | Same position/risk report, scoped to the directional sleeve. Useful when multi-sleeve aggregation hides the source. |
| Sleeve-level `decision_risk_metrics_weighted_summary.csv` | Same decision/risk report, scoped to the directional sleeve. Useful for verifying whether the overlay changed decision quality. |
| Sleeve-level `decision_audit.csv` | Same audit trail, scoped to the sleeve. Useful for checking the exact asset-level events without unrelated sleeves. |

For the podcast, the report sequence shown on screen should be:

1. Use the strategy/asset monthly summary to establish the staged return stack.
2. Use the AI/PSM monthly summary to establish the overlay pickup.
3. Use the ReportAgent P and L dashboard to inspect the path.
4. Use the Decision Risk Summary row to compare decision quality.
5. The Decision Audit rows prove the actual trades and final portfolio events.

## Narration Draft

This dated alpha case reviews a sampled trading window.

In this podcast, alpha means improvement beyond the fair comparison. It is not just a positive return. It is evidence that a decision improved the result versus the baseline, asset-stage path, benchmark, or risk profile it should be judged against.

This window was selected because the report stack is easy to inspect. The run separates the static baseline, the strategy review, the asset-selection layer, and the AI/PSM overlay instead of hiding everything inside one headline return.

AI/PSM means AI-assisted position size multiplier control. In this run, the AI overlay reviews the strategy and asset-switching state, then can adjust the final action path, duration, or position size multiplier. The point is not that the model gets to improvise; the point is that every AI/PSM change has to show up in the portfolio event ledger and the ReportAgent outputs.

The baseline is buy-and-hold. The starting book is COIN and NVDA, held with the buy-and-hold strategy. The run starts with one million dollars of initial capital, and the measured-window P and L view is rebased to zero at the measured start.

The first report shown is the strategy and asset summary. The strategy row is flat. The system did evaluate macd crossover as the selected shadow candidate, but it did not activate it. The active strategy stayed buy and hold, with zero runtime strategy switch events. This case was not driven by switching the trading rule.

The asset row is where the allocation decision changes. The system expanded the opportunity set from COIN and NVDA to AMD, COIN, Google, NVDA, and TSLA.

So the main conclusion from that report is simple: the asset-selection layer did the main work.

The AI/PSM report slice adds a smaller overlay change on top of the asset-selection path. This was not a leverage story: the overlay beta was slightly lower than the asset-stage beta, and the PSM decision ledger documents the sizing fields beside the executed events.

Now look at the actual trade evidence. In the measured window, the asset-stage path had one NVDA exit on the first day and one NVDA re-entry later that same day.

The AI/PSM overlay path was different. It entered COIN on the first day, exited and re-entered NVDA on the first day, exited AMD later in the window, re-entered AMD on the final day, liquidated NVDA on the final day, and re-entered NVDA later that day.

That is the evidence trail. The final portfolio events changed. The overlay did not just write a different explanation; it produced a different executed path.

Start with the staged P and L comparison. The visual combines the baseline, asset-selection, and AI/PSM report payloads into one chart, with each path starting at zero at the measured start. The commentary here is not a claim; the combined plot is the evidence for how the portfolio path moved through the measured window.

The Position Risk Summary is the position-level realized performance report. Its first row shows the active strategy, effective weight, annual return, Sharpe, Calmar, profit factor, and breach flag for the executed portfolio.

The Decision Risk Summary row is the decision-level report. The first row uses the same run context and lets us compare decision quality against realized position behavior.

The Decision Audit is the most important ReportAgent table for this case. It shows the asset, strategy, model action, final portfolio event, sizing fields, confidence, and policy reason. In the measured window, the asset-stage audit shows two NVDA events: an exit on the first day and a re-entry later that day. The overlay audit shows seven executed events: COIN entered, NVDA exited and re-entered, AMD exited and re-entered, and NVDA liquidated and re-entered. Those rows are the proof that the overlay path changed what actually happened in the portfolio.

This keeps the story honest. The takeaway is that asset switching did the major work, and AI/PSM added a smaller execution-path improvement. The podcast point is not that every layer made a huge gain. The point is that the reports prove what changed, where the pickup came from, and whether the final portfolio path improved.

## Case Takeaways

- The baseline was buy-and-hold in COIN and NVDA.
- Asset switching made the main allocation change.
- AI/PSM added a smaller execution-path change.
- The decision audit shows actual trade-path differences, not just different model text.

## Closing Line

Alpha is easier to claim than to prove. This dated case proves a modest but real allocation improvement: asset selection found the better book, and AI/PSM changed the executed path enough to add a little more.
