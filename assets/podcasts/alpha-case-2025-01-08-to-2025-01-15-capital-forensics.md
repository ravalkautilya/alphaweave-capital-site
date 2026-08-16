# January 2025 Capital Report Forensics

Case window: January 2025, first sampled week from 2025-01-08 to 2025-01-15.

## Report Performance

- Static buy-and-hold baseline: -8.83%
- Strategy-switching stage: -8.83%
- Asset-switching stage: -0.81%
- Strategy pickup: +0.00%
- Asset pickup: +8.02%
- AI/PSM overlay return: -0.80%
- AI execution review return over asset stage: +0.01%
- Total improvement over baseline: +8.03%

## Narration Draft

This alpha case is a capital-report forensic review. The run starts with one million dollars of starting capital and a static buy-and-hold baseline in COIN and NVDA. The measured P and L is rebased at the start of the sampled window, so every capital chart begins from zero and measures only the test window.

The first capital report shows the baseline path. The static book lost materially during the sampled week. Strategy review did not activate a different live strategy, so the strategy-stage capital line stayed aligned with the baseline. That is important: the improvement in this case is not coming from strategy rotation.

The asset-stage capital report is where the major change appears. Asset selection moved away from the fragile fixed pair and used the rotatable asset universe. The capital path improved sharply: the asset-stage return was much less negative than the baseline, and the drawdown profile was substantially cleaner.

Now look at the overlay capital reports. AI/PSM means AI execution review plus position size multiplier control. In this January run, the overlay did not create a large independent sizing move. The capital report shows a small positive execution-review lift over the asset stage, but the main story is that asset selection protected capital.

The position risk summary and decision risk summary are the proof rows. They show that the measured return, Sharpe, Calmar, profit factor, and breach fields are computed from the measured window, not from training-period capital. That is the forensic check: the capital reports are aligned to the same measured start, and the pickup numbers are not borrowing prior P and L.

The conclusion is clean. January is not an AI hero case. It is a capital preservation case. The static baseline lost the most, strategy selection did not change the live strategy, asset switching did the real work, and AI/PSM added only a small incremental improvement on top of that cleaner capital path.

## Case Takeaways

- The capital reports show the largest pickup came from asset selection.
- Strategy switching did not activate a live strategy change in this window.
- AI/PSM added a small execution-review lift, not a major resize effect.
- The P and L and risk reports are measured-window reports, rebased from zero.

## Source Artifacts

- Full-stack summary: reports/monthly_ai_impact/full_stack_sampled_summary_20260815_100319.json
- Full-stack detail: reports/monthly_ai_impact/full_stack_sampled_20260815_100319_detail.csv
- Case manifest: docs/podcasts/cases/alpha-case-2025-01-08-to-2025-01-15-capital-forensics.json
