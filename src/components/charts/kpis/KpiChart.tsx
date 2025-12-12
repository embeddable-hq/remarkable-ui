import { FC } from 'react';
import styles from './KpiChart.module.css';
import { KpiChartChange } from './components/KpiChartChange';
import { KpiChartProps } from './KpiChart.types';
import { AutoTextSize } from 'auto-text-size';
import ConditionalWrapper from '../../shared/ConditionalWrapper/ConditionalWrapper';

export const KpiChart: FC<KpiChartProps> = ({
  value,
  valueFontSize,
  trendFontSize,
  comparisonValue,
  comparisonLabel,
  invertChangeColors,
  showChangeAsPercentage,
  percentageDecimalPlaces = 1,
  equalComparisonLabel = 'No change',
  noPreviousDataLabel = 'No previous data',
  valueFormatter,
}) => {
  const hasComparisonValue = comparisonValue !== undefined;

  const displayValue = value === undefined ? '' : valueFormatter ? valueFormatter(value) : value;

  const autoResizeValueFontSize = !valueFontSize;
  return (
    <div className={styles.kpiChartContainer}>
      <div className={styles.kpiChartValueContainer}>
        <ConditionalWrapper
          condition={autoResizeValueFontSize}
          wrapper={(children) => (
            <AutoTextSize mode="boxoneline" minFontSizePx={1} maxFontSizePx={999}>
              {children}
            </AutoTextSize>
          )}
        >
          <h2
            title={displayValue.toString()}
            style={{
              fontSize: valueFontSize,
            }}
          >
            {displayValue}
          </h2>
        </ConditionalWrapper>
      </div>

      <div className={styles.kpiComparisonContainer} style={{ fontSize: trendFontSize }}>
        <div style={{ visibility: hasComparisonValue ? 'visible' : 'hidden' }}>
          <KpiChartChange
            equalComparisonLabel={equalComparisonLabel}
            comparisonLabel={comparisonLabel}
            comparisonValue={comparisonValue}
            invertChangeColors={invertChangeColors}
            percentageDecimalPlaces={percentageDecimalPlaces}
            showChangeAsPercentage={showChangeAsPercentage}
            value={value}
            valueFormatter={valueFormatter}
            noPreviousDataLabel={noPreviousDataLabel}
          />
        </div>
      </div>
    </div>
  );
};
