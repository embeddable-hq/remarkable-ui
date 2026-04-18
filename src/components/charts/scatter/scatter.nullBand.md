# Scatter null band (`scatter.nullBand.utils.ts`)

This module supports **nullable x/y measures** on the scatter chart when using **linear** scales. Chart.js expects numeric `x` and `y` for each point, so missing values are mapped to a dedicated region on each axis—the **null band**—and the axes are extended so that band is visible and labeled (e.g. “No value”).

---

## Why it exists

- **Data model**: Points can have `x` and/or `y` as `null` (or missing) to mean “no measure.”
- **Rendering**: We still plot every point by substituting a numeric coordinate: `x ?? xNullPos`, `y ?? yNullPos`, so markers sit in a consistent “null” zone to the left/below the real numeric range.
- **Axes**: Users need a tick and label at that zone. Built-in tick generation does not know about “null,” so we **compute** band positions and **inject** a tick via a small Chart.js plugin.

Logarithmic scale does not use this path (nulls are filtered out elsewhere).

---

## `computeScatterNullBand`

**Input**: All datasets’ `data` arrays (points with optional `null` `x`/`y`).

**Steps**

1. **Numeric extent**  
   Collect only finite `x` and `y` values across all points. From those, compute `xNumMin` / `xNumMax`, `yNumMin` / `yNumMax`, and ranges `xRange`, `yRange` (each range is at least `1` to avoid division issues when all values coincide).

2. **Null flags**  
   If any point has a missing `x`, set `hasNullX` (same for `y` → `hasNullY`). Missing means `null` or `undefined`.

3. **Band positions** (constants `NULL_BAND_OFFSET` = `0.25`, `NULL_BAND_PADDING` = `0.08`)
   - `xNullPos = xNumMin - NULL_BAND_OFFSET * xRange`
   - `yNullPos = yNumMin - NULL_BAND_OFFSET * yRange`

   So the null tick sits **outside** the numeric min, scaled by the data range—same idea as the Pro/sandbox implementation.

4. **Axis minimum** (only when there are nulls on that axis)
   - If `hasNullX`: `computedXAxisMin = xNullPos - NULL_BAND_PADDING * xRange`
   - If `hasNullY`: `computedYAxisMin = yNullPos - NULL_BAND_PADDING * yRange`

   Those values are merged with any user `min` in `scatter.utils` so the chart area includes the null band.

**Output**: `null` if there are no datasets; otherwise a `ScatterNullBandResult` with the values above. Downstream code uses this to build Chart.js data, scale options, and the plugin.

---

## `createScatterNullBandPlugin`

Chart.js builds ticks from the scale’s numeric domain. The null-band value (`xNullPos` / `yNullPos`) is usually **not** one of the generated ticks, so the axis would not show a label at the right place.

**Hook**: `afterBuildTicks` runs after the scale has built its default tick list.

**Behavior**

- **X scale** (when `hasNullX`): Keep only ticks with `value >= xNumMin`, then **prepend** a single tick `{ value: xNullPos }`. That forces a tick (and label) exactly at the null-band position.
- **Y scale** (when `hasNullY`): Same with `yNumMin` and `yNullPos`.

The plugin **replaces** `scale.ticks` with a new array (no in-place mutation of the original list).

**Label text** (“No value” or translated) is **not** set here—it is applied in scale `ticks.callback` in `scatter.utils.ts` when the tick value matches `xNullPos` / `yNullPos`.

---

## Related files

- `scatter.utils.ts` — maps `null` coordinates to `xNullPos`/`yNullPos`, merges `computed*AxisMin`, tooltip/datalabel formatting, optional grid styling at null ticks.
- `ScatterChart.tsx` — wires `computeScatterNullBand`, `getScatterChartData`, `getScatterChartOptions`, and registers this plugin when nulls exist on a linear scale.
