# Episode 06 - October 2023 AI/PSM Loss-Control Case Study

Case window: 2023-10, 2023-10-16 to 2023-10-27.

## Episode Angle

This episode is not an upside victory lap. It is a loss-control case study.

The fixed baseline lost money. The question is whether the allocation stack reduced the damage, and whether AI/PSM added anything after asset switching had already improved the path.

That is a real institutional question: when the simple strategy is wrong for the moment, can the system rotate the tradable set, reduce beta, change execution behavior, and preserve capital better than the static book?

## Report Performance

| Stage | Return | Incremental Effect |
|---|---:|---:|
| Static base: buy-and-hold on NVDA, TSLA | -7.81% | baseline |
| Strategy switching | -7.81% | +0.00% |
| Asset switching | -3.09% | +4.72% |
| AI/PSM overlay | -1.60% | +1.49% over asset stage |

Total improvement versus the static baseline: +6.21 percentage points.

The system did not make the period profitable. It turned a -7.81% drawdown-style result into a -1.60% result.

## What Switching Did

Strategy switching did not help in this case. The active strategy stayed buy-and-hold, so the strategy layer was correctly measured as zero pickup.

Asset switching did the heavy lifting. The baseline held NVDA and TSLA. The asset-switching stage expanded the tradable set to AMD, COIN, GOOGL, NVDA, and TSLA, then produced a return of -3.09% instead of -7.81%.

That is the core allocation improvement: the system did not need a brilliant new strategy to help. It needed a better asset set for a bad tape.

## What AI/PSM Added

AI/PSM improved the asset-stage result from -3.09% to -1.60%.

The overlay reduced beta from 0.3670 to 0.3328 while the benchmark was down about -4.88%. That matters: in a weak market window, the overlay helped by being less exposed to the same bad tape.

The decision audit shows the overlay changed the execution path:

- Asset-stage events: ENTER_LONG=7, EXIT_LONG=5, NO_EXEC=124
- AI/PSM overlay events: ENTER_LONG=8, EXIT_LONG=2, NO_EXEC=126
- Accepted AI/PSM changes: 1
- Executable AI/PSM changes: 1
- Executable resize count: 1

The clean podcast phrasing:

> Asset switching reduced the loss by changing what the system was willing to hold. AI/PSM reduced it again by changing how the system participated.

## Reports To Review In The Episode

1. Strategy/asset summary HTML  
   `reports\monthly_ai_impact\strategy_asset_sampled_finding_alpha_episode_06_october_2023_ai_psm_loss_control_20260809_145958_sa_summary.html`

   Use this first. It shows baseline, strategy, and asset-stage returns side by side.

2. AI/PSM summary HTML  
   `reports\monthly_ai_impact\ai_psm_sampled_2023_01_to_2026_06_finding_alpha_episode_06_october_2023_ai_psm_loss_control_20260809_145958_ai_summary.html`

   Use this to show that the overlay improved the asset-stage path.

3. Strategy/asset detail CSV  
   `reports\monthly_ai_impact\strategy_asset_sampled_finding_alpha_episode_06_october_2023_ai_psm_loss_control_20260809_145958_sa_detail.csv`

   Point to the exact stage returns and the asset-stage beta change.

4. AI/PSM detail CSV  
   `reports\monthly_ai_impact\ai_psm_sampled_2023_01_to_2026_06_finding_alpha_episode_06_october_2023_ai_psm_loss_control_20260809_145958_ai_detail.csv`

   Point to `ai_execution_review_return`, `ai_execution_review_alpha`, `overlay_beta`, `asset_beta`, and event deltas.

5. Overlay decision audit  
   `reports\backtest\backtest_20260809194804_52ef73d1\multi_sleeve\decision_audit.csv`

   Use this as the source-of-truth execution record. It shows actual portfolio events and confirms the overlay run used buy-and-hold as the executed strategy.

6. Risk summaries  
   `reports\backtest\backtest_20260809194804_52ef73d1\multi_sleeve\position_risk_metrics_weighted_summary.csv`  
   `reports\backtest\backtest_20260809194804_52ef73d1\multi_sleeve\decision_risk_metrics_weighted_summary.csv`

   Use these to discuss how the overlay changed realized risk, not just headline return.

## Narration Draft

Today we are looking at a losing period on purpose.

The baseline is simple: buy and hold the starting book, NVDA and TSLA, during the October 2023 sample window. That baseline lost 7.81 percent. This is exactly the kind of window where a static system can look fine in a long backtest but still be painful in real allocation terms.

The first layer is strategy switching. In this case, it did not add return. The system stayed with buy-and-hold, so the strategy pickup was zero. That is not a failure by itself. It tells us the improvement did not come from swapping the trading rule.

The second layer is asset switching. This is where the system helped materially. Instead of staying locked into NVDA and TSLA, it evaluated a wider asset set: AMD, COIN, GOOGL, NVDA, and TSLA. The asset-switching result was still negative, but much less negative: minus 3.09 percent instead of minus 7.81 percent.

That is the first lesson. Sometimes alpha is not a heroic prediction. Sometimes it is avoiding the worst version of the same exposure.

Then we add the AI/PSM overlay. This is the layer that asks whether the portfolio should participate differently once the asset-selection path is already running. The overlay did not turn the window into a gain, but it improved the asset-stage result again, from minus 3.09 percent to minus 1.60 percent.

The report shows why this matters. Asset switching reduced the loss by 4.72 percentage points versus the baseline. AI/PSM added another 1.49 percentage points versus the asset stage. Total improvement versus the static baseline was about 6.21 percentage points.

Now the important part: we do not just accept that story because it sounds nice. We open the reports.

The strategy and asset summary shows the staged decomposition. Baseline lost money. Strategy pickup was zero. Asset switching reduced the loss.

The AI/PSM detail report shows the overlay return and the alpha pickup. It also shows beta dropped from about 0.367 to 0.333 while the benchmark was down nearly 4.9 percent. That is the overlay doing something useful in a bad market environment: participating less in a losing tape.

Finally, the decision audit is the flight recorder. It shows the actual portfolio events. The asset-stage run had more exits. The overlay had fewer exits, one accepted AI/PSM change, one executable change, and one executable resize. The final result was not magic. It was a different execution path.

The conclusion is not that AI always makes money. The conclusion is narrower and more useful: in this October window, the allocation stack reduced a large static loss, and AI/PSM added additional loss control after asset switching had already helped.

That is the kind of evidence we want from an allocation intelligence system. Not a vague claim that it is smarter, but a reportable answer to a specific question: what changed, did it help, and where did the return difference come from?

## Caveat For The Episode

The manifest currently flags a strategy metadata mismatch because one summary field lists the configured rotatable strategy universe for the AI/PSM files. The execution audit shows the actual executed strategy was buy-and-hold throughout the asset-stage and overlay runs. Treat this as a reporting metadata issue, not an execution mismatch.

## Source Artifacts

- Strategy/asset summary: `reports\monthly_ai_impact\strategy_asset_sampled_summary_finding_alpha_episode_06_october_2023_ai_psm_loss_control_20260809_145958_sa.json`
- Strategy/asset detail: `reports\monthly_ai_impact\strategy_asset_sampled_finding_alpha_episode_06_october_2023_ai_psm_loss_control_20260809_145958_sa_detail.csv`
- Strategy/asset target: `reports\monthly_ai_impact\strategy_asset_sampled_2023_10_target_finding_alpha_episode_06_october_2023_ai_psm_loss_control_20260809_145958_sa.csv`
- AI/PSM summary: `reports\monthly_ai_impact\ai_psm_sampled_monthly_summary_finding_alpha_episode_06_october_2023_ai_psm_loss_control_20260809_145958_ai.json`
- AI/PSM detail: `reports\monthly_ai_impact\ai_psm_sampled_2023_01_to_2026_06_finding_alpha_episode_06_october_2023_ai_psm_loss_control_20260809_145958_ai_detail.csv`
- AI/PSM target: `reports\monthly_ai_impact\ai_psm_sampled_2023_10_target_finding_alpha_episode_06_october_2023_ai_psm_loss_control_20260809_145958_ai.csv`

