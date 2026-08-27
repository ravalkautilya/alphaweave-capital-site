# AlphaWeave Capital Presentation Walkthrough

Presentation: docs/presentation-20260816.html

## Narration Draft

This episode walks through the current AlphaWeave Capital presentation from top to bottom, using the presentation sections themselves on screen.

The title frame sets the claim: AlphaWeave Capital is institutional allocation intelligence and attribution. The deck is about proving which decision layer changed the measured result.

The executive summary starts with the basic architecture. AlphaWeave is not a strategy by itself. It is a decision layer above strategies. It asks which strategy should be active, which assets fit that strategy, how much capital should be deployed, and whether the resulting decision improved the measured path.

The competitive placement section makes the first distinction. Most open trading systems are bot frameworks, model research stacks, or execution engines. AlphaWeave is positioned around staged attribution, policy files, audit trails, and measured capital reports. The point is not that a portfolio went up. The point is knowing what changed, why it changed, and which layer earned credit.

The end-to-end decision flow shows the single-bar pipeline. Data enters first. Asset selection and strategy selection define the candidate trading world. Triage decides whether compact AI and PSM underwriting is worth an LLM call. PSM means position size multiplier: the capital dial after policy and risk checks.

The month-by-month sampled performance section is the main evidence table. The baseline is momentum with fixed starting assets. The rows use sampled ten-business-day windows, so the numbers are short-window measurements, not annualized claims. The table separates strategy pickup, asset pickup, policy-only execution, compact AI and PSM, total improvement, and drawdown behavior.

The market-neutral sleeves section explains a different design goal. Directional sleeves can make money from direction, but market-neutral sleeves make the alpha question cleaner by controlling beta, net exposure, gross exposure, and spread behavior.

The SleeveConstraintAgent section is the enforcement layer for those mandates. It checks whether a sleeve is allowed to carry the exposures it has, and whether beta or gross/net exposure violates the stated objective.

The policy files section is the governance layer behind the agents. Policies define what evidence is enough, when an LLM is allowed to run, when switching is allowed, how state transitions are handled, and when a policy should be reviewed, disabled, or promoted.

The multi-agent AI section explains the full architecture. The full chain can still run latest market intelligence, past intelligence, low-level reflection, high-level reflection, decision review, and DMA as separate stages. The measured AI path now emphasizes compact AI and PSM: one underwriting packet sent to DecisionMakingAgent when triage admits the bar.

The synthetic market data simulation section explains why simulated regimes matter. Synthetic data is useful for forcing edge cases: spikes, noisy trends, drawdown breaks, strategy flips, and policy failures that may be rare in a short real run.

The triage section asks whether LLM calls are worth their cost. Triage is not supposed to block all thinking. It is supposed to admit compact underwriting when the tape changes, when a real event matters, or when a position state deserves review.

The strategy AI controls section defines the controls around execution. This is where duration, sizing, confidence, policy-only behavior, and compact AI behavior are separated so the system can measure what the AI layer actually added.

The incremental AI controls table is the counterfactual view. It separates policy without triage from compact triage plus AI and PSM. That split matters because the LLM only earns credit for what it adds over the deterministic policy path.

The TradeCrew section shows how this becomes runnable software. TradeCrew normalizes context, loads data, runs date by date and sleeve by sleeve, applies strategy and asset selection, invokes compact AI and PSM when admitted, and then sends the final decision through risk, portfolio, constraints, execution, and reporting.

The asset-selection section explains how AssetAllocationAgent chooses names. It looks for assets that fit the current strategy and window, not just assets that happened to move recently.

The strategy-selection section explains how StrategyAllocationAgent chooses the active strategy. It compares candidates under the current window, while respecting thresholds, turnover discipline, training evidence, and measured-window behavior.

The strategy augmentation section ties the layers together. AlphaWeave can sit above a simple incumbent strategy, then add strategy selection, asset selection, policy-only execution, and compact AI and PSM as separately measured stages.

The historic-learning section explains what learning means here. It is not vague memory. It is outcome evidence: what was selected, what was rejected, what happened next, which policies helped, and which policies should be retired.

The granularity section shows why timing matters. The same system was compared across fifteen-minute, one-hour, three-hour, six-hour, and one-day bars over a recent window. The point is not that the finest bar always wins. The point is that granularity changes how many chances the system has to switch, resize, or protect capital.

The market-extension section is deliberately conservative. Shorts, futures, options, and crypto are presented as estimates, not completed performance claims. Each can help only if it gives the same governed state machine a cleaner way to express an already-detected opportunity after costs, liquidity, and risk controls.

The current-capabilities and next-stage enhancements section is the roadmap. It organizes improvement into selection, AI execution, and learning feedback. The next stage is not blindly adding more rules. It is simplifying policies, deactivating weak ones, replaying failures in simulation, and using compact AI only where it can add value over policy.

That is the core message of the presentation: AlphaWeave is an allocation and evidence system. Every layer has to be answerable: strategy, asset, policy, compact AI and PSM, risk, capital, and reporting.

## Episode Takeaways

- The presentation now frames AlphaWeave as a decision layer, not a standalone strategy.
- Compact AI/PSM is the preferred measured LLM path.
- Policy-only overlay and compact AI/PSM are separated so LLM value can be tested honestly.
- Report evidence, transition tapes, and simulator replay are central to the workflow.
- The performance numbers are tied to sampled windows, not broad annualized promises.
