# Data-backed homepage chart

The JSON contains 250 Yahoo Finance daily OHLC records for 2025, not dividend-adjusted, with source URL and download endpoint. The SVG displays the 64 sessions in October-December for readable candles.

Regenerate offline: `.venv/Scripts/python.exe scripts/render_home_market_chart.py`.

Bands: trailing 20-session simple mean of close +/- 2 population standard deviations, including the current session. Pre-October records supply warmup. An upper breakout requires current close > current upper band and previous close <= previous upper band; lower breakout uses the inverse comparison at the lower band. All qualifying events in the displayed period are marked (3), determined after the session closes. These are chart events, not trade fills or AlphaWeave strategy performance.

Band convention: https://www.bollingerbands.com/bollinger-band-rules

`alphaweave-chart-assistant.png` was created with built-in image_gen, using the existing assistant illustration as reference.

Prompt: Extract the same marshmallow assistant character into a standalone full-body illustration on transparent background. Preserve green hat with existing slate-blue A over teal W emblem, green shirt, friendly face, tablet and pointing gesture. Remove the entire chart, all panels, text, numbers, backgrounds and ribbons. Only the character with tablet, a soft contact shadow beneath feet, transparent surroundings. Keep character upright, portrait composition, full body visible. This will be placed beside a real data chart in HTML.
